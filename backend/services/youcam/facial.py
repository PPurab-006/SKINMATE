"""
Facial Intelligence Adapter: Fitzpatrick Scale, Color Tones, Attributes, Face Lift & Reshape
"""

import logging
from typing import Dict, Any, Optional
from backend.services.youcam.task_manager import TaskManager
from backend.services.youcam.result_normalizer import ResultNormalizer
from backend.services.youcam.mock_provider import YouCamMockProvider
from backend.services.youcam.schemas import FacialColorTone, FaceAttributes, NormalizedVtoResult
from backend.services.youcam.exceptions import YouCamTaskError

logger = logging.getLogger("skinmate.youcam.facial")

class FacialAdapter:
    def __init__(self, task_manager: TaskManager):
        self.task_manager = task_manager

    async def get_facial_color_tones(self, file_id: str, image_url: str = "") -> FacialColorTone:
        """
        Analyzes dominant cutaneous tones, undertone, and seasonal palette.
        """
        options = {}
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task(
            service_slug="facial-color-tones",
            file_id=file_id,
            options=options,
            unit_cost=1
        )
        poll_res = await self.task_manager.poll_task(
            service_slug="facial-color-tones",
            task_id=task.task_id
        )
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Facial Color Tones failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_facial_color_tones() if poll_res.is_mock else {})
        return FacialColorTone(
            dominant_hex=raw.get("dominant_hex", "#C59572"),
            undertone=raw.get("undertone", "Olive"),
            contrast=raw.get("contrast", "Medium"),
            melanin_index=raw.get("melanin_index", 42),
            season_palette=raw.get("season_palette", "Warm Autumn")
        )

    async def get_face_attributes(self, file_id: str, image_url: str = "") -> FaceAttributes:
        """
        Analyzes facial symmetry, geometric shape, and proportions.
        """
        options = {}
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task(
            service_slug="face-attr-analysis",
            file_id=file_id,
            options=options,
            unit_cost=1
        )
        poll_res = await self.task_manager.poll_task(
            service_slug="face-attr-analysis",
            task_id=task.task_id
        )
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Face Attributes failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_face_attributes() if poll_res.is_mock else {})
        return FaceAttributes(
            face_shape=raw.get("face_shape", "Oval"),
            symmetry_score=raw.get("symmetry_score", 90),
            eye_distance_ratio=raw.get("eye_distance_ratio", 1.0),
            golden_ratio_match=raw.get("golden_ratio_match", 0.92),
            jawline_type=raw.get("jawline_type", "Soft Angular")
        )

    async def apply_face_lift(self, file_id: str, image_url: str = "", intensity: int = 50) -> NormalizedVtoResult:
        """
        Simulates facial lifting / tightening with 0-100% intensity.
        """
        options = {"intensity": intensity}
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task(
            service_slug="face-lift",
            file_id=file_id,
            options=options,
            unit_cost=1
        )
        poll_res = await self.task_manager.poll_task("face-lift", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Face Lift failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("face-lift", image_url, f"lift_{intensity}", "facial") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="face-lift",
            original_image_url=image_url,
            effect_name=f"Subtle Contour Lift ({intensity}%)",
            category="appearance",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_face_reshape(self, file_id: str, image_url: str = "", parameters: Optional[Dict[str, Any]] = None) -> NormalizedVtoResult:
        """
        Applies aesthetic facial contour micro-adjustments (jawline, chin, cheekbones).
        """
        options = dict(parameters or {"jawline": 15, "chin": 10, "cheekbones": 15})
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task(
            service_slug="face-reshape",
            file_id=file_id,
            options=options,
            unit_cost=1
        )
        poll_res = await self.task_manager.poll_task("face-reshape", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Face Reshape failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("face-reshape", image_url, "custom_reshape", "facial") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="face-reshape",
            original_image_url=image_url,
            effect_name="Natural Facial Contouring",
            category="appearance",
            parameters=options,
            is_mock=poll_res.is_mock
        )
