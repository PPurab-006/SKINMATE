"""
Facial Grooming & Beard Style Generator Adapter
"""

import logging
from typing import Dict, Any, Optional
from backend.services.youcam.task_manager import TaskManager
from backend.services.youcam.result_normalizer import ResultNormalizer
from backend.services.youcam.mock_provider import YouCamMockProvider
from backend.services.youcam.schemas import NormalizedVtoResult
from backend.services.youcam.exceptions import YouCamTaskError

logger = logging.getLogger("skinmate.youcam.beard")

class BeardAdapter:
    def __init__(self, task_manager: TaskManager):
        self.task_manager = task_manager

    async def generate_beard_style(
        self, 
        file_id: str, 
        style_id: str = "stubble", 
        color_hex: Optional[str] = None,
        image_url: str = ""
    ) -> NormalizedVtoResult:
        """
        Generates virtual beard/facial hair styling (Stubble, Goatee, Full Beard, Van Dyke, Moustache).
        """
        BEARD_MAP = {
            "stubble": "all_circle",
            "boxed": "all_garibaldi",
            "balbo": "all_anchor",
            "full": "all_bandholz",
            "goatee": "all_goatee",
            "mustache": "all_mustache",
            "shaved": "all_shaved",
            "clean": "all_shaved"
        }
        clean_key = style_id.lower().replace("beard-", "").replace(" ", "_")
        template_id = style_id if style_id.startswith("all_") else BEARD_MAP.get(clean_key, "all_circle")
        options = {"template_id": template_id}
        if color_hex:
            options["color_hex"] = color_hex
        if image_url and (not file_id or file_id.startswith("mock-")):
            options["src_file_url"] = image_url

        task = await self.task_manager.create_task("beard-style", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("beard-style", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Beard Style Generation failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("beard-style", image_url, style_id, "beard") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="beard-style",
            original_image_url=image_url,
            effect_name=f"Beard: {style_id.replace('-', ' ').title()}",
            category="beard",
            parameters=options,
            is_mock=poll_res.is_mock
        )
