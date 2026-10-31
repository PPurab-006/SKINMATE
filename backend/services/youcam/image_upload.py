"""
Image Processing Pipeline & YouCam S2S File Uploader
"""

import hashlib
import io
import logging
from typing import Tuple, Dict, Any, Optional
from PIL import Image, ImageOps
import httpx

from backend.services.youcam.authentication import YouCamAuthManager
from backend.services.youcam.exceptions import YouCamValidationError, YouCamBaseException
from backend.services.youcam.schemas import FileUploadResponse

logger = logging.getLogger("skinmate.youcam.image_upload")

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
MIN_FILE_SIZE_BYTES = 512               # 512 Bytes (corrupt file check)

# Dimension constraints by category
MIN_DIMENSION = 384
MAX_DIMENSION = 4096


class ImageProcessor:
    """
    Validates, normalizes, strips EXIF, and checks quality before YouCam transmission.
    """

    @staticmethod
    def validate_and_process(
        content: bytes, 
        filename: str = "image.jpg",
        service_slug: str = "generic"
    ) -> Tuple[bytes, str, Dict[str, Any]]:
        """
        Validates image binary and produces clean, normalized JPEG bytes with SHA-256 fingerprint.
        """
        if not content or len(content) < MIN_FILE_SIZE_BYTES:
            raise YouCamValidationError(
                f"Image file is too small or corrupt ({len(content)} bytes). Minimum required is 8KB."
            )

        if len(content) > MAX_FILE_SIZE_BYTES:
            raise YouCamValidationError(
                f"Image file exceeds maximum allowable size of 10MB ({len(content)/(1024*1024):.2f}MB provided)."
            )

        try:
            pil_img = Image.open(io.BytesIO(content))
            pil_img.verify()
            # Reopen after verify() as verify alters image pointer
            pil_img = Image.open(io.BytesIO(content))
        except Exception as e:
            raise YouCamValidationError(f"Invalid or unreadable image format: {str(e)}")

        orig_format = pil_img.format
        if orig_format not in ALLOWED_FORMATS:
            raise YouCamValidationError(
                f"Unsupported format '{orig_format}'. Expected one of: JPEG, PNG, WEBP."
            )

        # Correct EXIF rotation if present
        try:
            pil_img = ImageOps.exif_transpose(pil_img)
        except Exception:
            pass  # Fall back to un-transposed if EXIF is malformed

        width, height = pil_img.size

        # Dimension checks
        if width < MIN_DIMENSION or height < MIN_DIMENSION:
            raise YouCamValidationError(
                f"Image dimensions ({width}x{height}) are too small for accurate AI detection. Minimum is {MIN_DIMENSION}x{MIN_DIMENSION}px."
            )

        # Scale down if exceeds max dimension
        if width > MAX_DIMENSION or height > MAX_DIMENSION:
            pil_img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
            width, height = pil_img.size

        # Convert to RGB (remove Alpha channel if PNG)
        if pil_img.mode in ("RGBA", "LA", "P"):
            rgb_img = Image.new("RGB", pil_img.size, (255, 255, 255))
            if pil_img.mode == "RGBA":
                rgb_img.paste(pil_img, mask=pil_img.split()[3])
            else:
                rgb_img.paste(pil_img)
            pil_img = rgb_img
        elif pil_img.mode != "RGB":
            pil_img = pil_img.convert("RGB")

        # Encode normalized high-quality JPEG
        out_buffer = io.BytesIO()
        pil_img.save(out_buffer, format="JPEG", quality=92, optimize=True)
        optimized_bytes = out_buffer.getvalue()

        # Compute SHA-256 fingerprint for idempotency & deduplication
        sha256_hash = hashlib.sha256(optimized_bytes).hexdigest()

        meta = {
            "width": width,
            "height": height,
            "original_format": orig_format,
            "optimized_size_kb": round(len(optimized_bytes) / 1024, 1),
            "sha256": sha256_hash,
            "service_slug": service_slug
        }

        return optimized_bytes, sha256_hash, meta


class YouCamFileUploader:
    """
    Handles S2S /s2s/v2.0/file upload protocol.
    """
    def __init__(self, auth: YouCamAuthManager):
        self.auth = auth

    async def upload(
        self, 
        image_bytes: bytes, 
        sha256_hash: str, 
        filename: str = "portrait.jpg"
    ) -> FileUploadResponse:
        """
        Uploads image to YouCam S2S File API. Returns FileUploadResponse with file_id.
        """
        # If in Mock Mode, return realistic mock response
        if not self.auth.is_configured:
            mock_id = f"file_{sha256_hash[:16]}"
            logger.info("Mock mode active: Generated mock file_id '%s'", mock_id)
            return FileUploadResponse(
                status="success",
                file_id=mock_id,
                file_url=f"https://skinmate-assets.local/uploads/{mock_id}.jpg",
                sha256_hash=sha256_hash,
                is_mock=True
            )

        # Step 1: Request pre-signed upload URL from YouCam File API
        headers = self.auth.get_auth_headers()
        payload = {
            "files": [
                {
                    "content_type": "image/jpeg",
                    "file_name": filename,
                    "file_size": len(image_bytes)
                }
            ]
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                res = await client.post(
                    f"{self.auth.base_url}/s2s/v2.0/file",
                    json=payload,
                    headers=headers
                )
                res.raise_for_status()
                data = res.json()
            except httpx.HTTPStatusError as e:
                # Some YouCam accounts also support direct multipart form-data upload
                if e.response.status_code in (400, 404, 415):
                    logger.warning("JSON file endpoint returned %s. Attempting multipart upload fallback...", e.response.status_code)
                    return await self._upload_multipart_fallback(client, image_bytes, filename, headers, sha256_hash)
                raise YouCamBaseException(f"YouCam File API initialization failed: {e.response.text}", status_code=e.response.status_code)
            except Exception as e:
                raise YouCamBaseException(f"YouCam File API connection failed: {str(e)}", status_code=502)

            # Check structure of response (handles Perfect Corp S2S {"data": {"files": [...]}} structure)
            payload_data = data.get("data", data)
            files_meta = payload_data.get("files", [])
            if not files_meta:
                raise YouCamBaseException("YouCam File API did not return file destination metadata.")

            file_info = files_meta[0]
            file_id = file_info.get("file_id")
            requests_list = file_info.get("requests", [])
            upload_url = None
            if requests_list and isinstance(requests_list, list):
                upload_url = requests_list[0].get("url")
            else:
                upload_url = file_info.get("upload_url")
            download_url = file_info.get("file_url")

            # Step 2: Binary PUT to upload_url if pre-signed destination provided
            if upload_url:
                try:
                    put_res = await client.put(
                        upload_url,
                        content=image_bytes,
                        headers={"Content-Type": "image/jpeg", "Content-Length": str(len(image_bytes))}
                    )
                    put_res.raise_for_status()
                except Exception as e:
                    raise YouCamBaseException(f"Failed to transmit image binary to pre-signed URL: {str(e)}", status_code=502)

            return FileUploadResponse(
                status="success",
                file_id=file_id,
                file_url=download_url,
                upload_url=upload_url,
                sha256_hash=sha256_hash,
                is_mock=False
            )

    async def _upload_multipart_fallback(
        self,
        client: httpx.AsyncClient,
        image_bytes: bytes,
        filename: str,
        headers: Dict[str, str],
        sha256_hash: str
    ) -> FileUploadResponse:
        """Fallback for direct multipart upload endpoint."""
        files = {"file": (filename, image_bytes, "image/jpeg")}
        multipart_headers = {k: v for k, v in headers.items() if k.lower() != "content-type"}
        
        res = await client.post(
            f"{self.auth.base_url}/s2s/v2.0/file",
            files=files,
            headers=multipart_headers
        )
        res.raise_for_status()
        data = res.json()
        file_id = data.get("file_id") or data.get("files", [{}])[0].get("file_id", f"file_{sha256_hash[:16]}")
        return FileUploadResponse(
            status="success",
            file_id=file_id,
            sha256_hash=sha256_hash,
            is_mock=False
        )
