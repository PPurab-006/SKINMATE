from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import httpx
from typing import Optional, Dict, Any
from backend.config import settings

router = APIRouter(prefix="/api/youcam", tags=["YouCam S2S"])

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    S2S File Upload Proxy to YouCam API
    """
    if not settings.YOUCAM_API_KEY:
        # Return mock file id when no key configured
        return {
            "status": "success",
            "file_id": f"backend-mock-file-{file.filename}",
            "note": "Sandbox Mock Mode (No YOUCAM_API_KEY set)"
        }

    try:
        content = await file.read()
        async with httpx.AsyncClient() as client:
            files = {"file": (file.filename, content, file.content_type)}
            headers = {"Authorization": f"Bearer {settings.YOUCAM_API_KEY}"}
            response = await client.post(
                f"{settings.YOUCAM_BASE_URL}/s2s/v2.0/file",
                files=files,
                headers=headers,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"YouCam API upload error: {str(e)}")


@router.post("/task/{service_slug}")
async def create_task(service_slug: str, payload: Dict[str, Any]):
    """
    S2S Task Creation Proxy
    """
    if not settings.YOUCAM_API_KEY:
        return {
            "status": "success",
            "task_id": f"mock-task-{service_slug}-id",
            "estimated_wait_time_sec": 2,
            "note": "Sandbox Mock Mode"
        }

    try:
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {settings.YOUCAM_API_KEY}",
                "Content-Type": "application/json"
            }
            response = await client.post(
                f"{settings.YOUCAM_BASE_URL}/s2s/v2.0/task/{service_slug}",
                json=payload,
                headers=headers,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"YouCam Task creation error: {str(e)}")


@router.get("/poll/{service_slug}/{task_id}")
async def poll_task(service_slug: str, task_id: str):
    """
    S2S Task Polling Endpoint
    """
    if not settings.YOUCAM_API_KEY or task_id.startswith("mock-task"):
        return {
            "status": "success",
            "task_id": task_id,
            "progress_pct": 100,
            "note": "Sandbox Mock Result"
        }

    try:
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {settings.YOUCAM_API_KEY}"}
            response = await client.get(
                f"{settings.YOUCAM_BASE_URL}/s2s/v2.0/task/{service_slug}/{task_id}",
                headers=headers,
                timeout=15.0
            )
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"YouCam polling error: {str(e)}")
