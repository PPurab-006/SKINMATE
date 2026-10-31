"""
Unified YouCam Service Client
Centralized server-side client uniting authentication, image pipelines, task lifecycle, and adapters.
"""

import logging
from typing import Optional, Dict, Any

from backend.services.youcam.authentication import YouCamAuthManager
from backend.services.youcam.image_upload import ImageProcessor, YouCamFileUploader
from backend.services.youcam.task_manager import TaskManager
from backend.services.youcam.schemas import FileUploadResponse, UnitUsageStatus, NormalizedSkinProfile, NormalizedHairProfile
from backend.services.youcam.skin import SkinAdapter
from backend.services.youcam.facial import FacialAdapter
from backend.services.youcam.hair import HairAdapter
from backend.services.youcam.makeup import MakeupAdapter
from backend.services.youcam.nails import NailAdapter
from backend.services.youcam.beard import BeardAdapter
from backend.services.youcam.appearance import AppearanceAdapter

logger = logging.getLogger("skinmate.youcam.client")


class YouCamUnifiedClient:
    """
    Central server-side YouCam client.
    Ensures safe credentials, unit protection, input validation, and unified normalization.
    """
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        self.auth = YouCamAuthManager(api_key=api_key, base_url=base_url)
        self.uploader = YouCamFileUploader(auth=self.auth)
        self.tasks = TaskManager(auth=self.auth)

        # Domain Adapters
        self.skin = SkinAdapter(task_manager=self.tasks)
        self.facial = FacialAdapter(task_manager=self.tasks)
        self.hair = HairAdapter(task_manager=self.tasks)
        self.makeup = MakeupAdapter(task_manager=self.tasks)
        self.nails = NailAdapter(task_manager=self.tasks)
        self.beard = BeardAdapter(task_manager=self.tasks)
        self.appearance = AppearanceAdapter(task_manager=self.tasks)

    @property
    def is_live_mode(self) -> bool:
        return self.auth.is_configured

    def get_quota_status(self) -> UnitUsageStatus:
        """Returns unit consumption metrics and remaining quota."""
        return UnitUsageStatus(
            initial_allotment=1000,
            units_consumed=self.auth.units_consumed,
            remaining_units=self.auth.remaining_units,
            total_calls_logged=self.auth.units_consumed,
            is_mock_mode=not self.is_live_mode
        )

    async def process_and_upload(
        self, 
        raw_bytes: bytes, 
        filename: str = "portrait.jpg",
        service_slug: str = "generic"
    ) -> FileUploadResponse:
        """Validates, strips EXIF, normalizes dimensions, and uploads to YouCam."""
        optimized_bytes, sha256_hash, meta = ImageProcessor.validate_and_process(
            content=raw_bytes,
            filename=filename,
            service_slug=service_slug
        )
        return await self.uploader.upload(
            image_bytes=optimized_bytes,
            sha256_hash=sha256_hash,
            filename=filename
        )


# Global singleton client instance for FastAPI application
youcam_service = YouCamUnifiedClient()
