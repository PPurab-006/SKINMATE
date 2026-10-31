"""
Nail Art & Polish Virtual Try-On Adapter
"""

import logging
from typing import Dict, Any, Optional
from backend.services.youcam.task_manager import TaskManager
from backend.services.youcam.result_normalizer import ResultNormalizer
from backend.services.youcam.mock_provider import YouCamMockProvider
from backend.services.youcam.schemas import NormalizedVtoResult
from backend.services.youcam.exceptions import YouCamTaskError

logger = logging.getLogger("skinmate.youcam.nails")

class NailAdapter:
    def __init__(self, task_manager: TaskManager):
        self.task_manager = task_manager

    async def apply_nail_vto(
        self, 
        file_id: str, 
        color_hex: str = "#8B1E3F", 
        finish: str = "Glossy", 
        image_url: str = ""
    ) -> NormalizedVtoResult:
        """
        Applies nail polish color and finish (Glossy, Matte, Chrome, Shimmer).
        """
        options = {"color_hex": color_hex, "finish": finish}
        task = await self.task_manager.create_task("nail-vto", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("nail-vto", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Nail VTO failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("nail-vto", image_url, color_hex, "nails") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="nail-vto",
            original_image_url=image_url,
            effect_name=f"{finish} Polish ({color_hex})",
            category="nails",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def transfer_nail_art(
        self, 
        target_file_id: str, 
        reference_file_id: str, 
        image_url: str = ""
    ) -> NormalizedVtoResult:
        """
        Transfers nail art design from a reference image onto detected fingernails.
        """
        options = {"ref_file_id": reference_file_id}
        task = await self.task_manager.create_task("ai-nail", target_file_id, options=options, unit_cost=2)
        poll_res = await self.task_manager.poll_task("ai-nail", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Nail Art Transfer failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("ai-nail", image_url, "art_transfer", "nails") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="ai-nail",
            original_image_url=image_url,
            effect_name="Artistic Nail Transfer",
            category="nails",
            parameters=options,
            is_mock=poll_res.is_mock
        )
