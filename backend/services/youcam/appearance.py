"""
Appearance Studio Adapter: Body Reshape, Breast Augmentation, AI Smile, Teeth Whitening & Abs Filter
"""

import logging
from typing import Dict, Any, Optional
from backend.services.youcam.task_manager import TaskManager
from backend.services.youcam.result_normalizer import ResultNormalizer
from backend.services.youcam.mock_provider import YouCamMockProvider
from backend.services.youcam.schemas import NormalizedVtoResult
from backend.services.youcam.exceptions import YouCamTaskError

logger = logging.getLogger("skinmate.youcam.appearance")

class AppearanceAdapter:
    def __init__(self, task_manager: TaskManager):
        self.task_manager = task_manager

    async def apply_smile(self, file_id: str, intensity: int = 50, image_url: str = "") -> NormalizedVtoResult:
        """Generates natural smile expression."""
        expr_type = "smile_with_teeth_visible" if intensity > 40 else "closed_mouth_smile"
        options = {"expression_type": expr_type}
        if image_url and (not file_id or file_id.startswith("mock-")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("ai-smile", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("ai-smile", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam AI Smile failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("ai-smile", image_url, f"smile_{intensity}", "appearance") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="ai-smile",
            original_image_url=image_url,
            effect_name=f"Radiant Smile ({intensity}%)",
            category="appearance",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_teeth_whitening(self, file_id: str, intensity: int = 60, image_url: str = "") -> NormalizedVtoResult:
        """Simulates cosmetic dental whitening (0-100%)."""
        options = {
            "version": "1.0",
            "effect": {
                "whitening_intensity": intensity
            }
        }
        if image_url and (not file_id or file_id.startswith("mock-")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("teeth-whiten", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("teeth-whiten", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Teeth Whitening failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("teeth-whiten", image_url, f"white_{intensity}", "appearance") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="teeth-whitening",
            original_image_url=image_url,
            effect_name=f"Teeth Brightening ({intensity}%)",
            category="appearance",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_body_reshape(self, file_id: str, parameters: Optional[Dict[str, Any]] = None, image_url: str = "") -> NormalizedVtoResult:
        """Applies full-body silhouette shaping."""
        options = parameters or {"waist": -10, "legs": 5}
        task = await self.task_manager.create_task("body-reshape", file_id, options=options, unit_cost=2)
        poll_res = await self.task_manager.poll_task("body-reshape", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Body Reshape failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("body-reshape", image_url, "body_contour", "appearance") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="body-reshape",
            original_image_url=image_url,
            effect_name="Body Silhouette Contouring",
            category="appearance",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_breast_augmentation(self, file_id: str, cup_adjustment: str = "+1 Cup", image_url: str = "") -> NormalizedVtoResult:
        """Simulates aesthetic breast augmentation volumetrics."""
        options = {"cup_size": cup_adjustment}
        task = await self.task_manager.create_task("breast-augmentation", file_id, options=options, unit_cost=2)
        poll_res = await self.task_manager.poll_task("breast-augmentation", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Breast Augmentation failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("breast-augmentation", image_url, cup_adjustment, "appearance") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="breast-augmentation",
            original_image_url=image_url,
            effect_name=f"Volumetric Silhouette ({cup_adjustment})",
            category="appearance",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_abs_filter(self, file_id: str, definition_level: str = "Toned", image_url: str = "") -> NormalizedVtoResult:
        """Applies athletic core/abdominal muscle definition."""
        options = {"definition": definition_level}
        task = await self.task_manager.create_task("ai-abs", file_id, options=options, unit_cost=2)
        poll_res = await self.task_manager.poll_task("ai-abs", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Abs Filter failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("ai-abs", image_url, definition_level, "appearance") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="ai-abs",
            original_image_url=image_url,
            effect_name=f"Core Tone ({definition_level})",
            category="appearance",
            parameters=options,
            is_mock=poll_res.is_mock
        )
