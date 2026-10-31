"""
Beauty & Makeup Virtual Try-On Adapter
"""

import logging
from typing import Dict, Any, List, Optional
from backend.services.youcam.task_manager import TaskManager
from backend.services.youcam.result_normalizer import ResultNormalizer
from backend.services.youcam.mock_provider import YouCamMockProvider
from backend.services.youcam.schemas import NormalizedVtoResult
from backend.services.youcam.exceptions import YouCamTaskError

logger = logging.getLogger("skinmate.youcam.makeup")

class MakeupAdapter:
    def __init__(self, task_manager: TaskManager):
        self.task_manager = task_manager

    async def apply_makeup_vto(
        self, 
        file_id: str, 
        effects: List[Dict[str, Any]], 
        image_url: str = ""
    ) -> NormalizedVtoResult:
        """
        Applies discrete cosmetics effects (e.g. lipstick, blush, eyeshadow).
        """
        options = {"effects": effects}
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("makeup-vto", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("makeup-vto", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Makeup VTO failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("makeup-vto", image_url, "custom_makeup", "makeup") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="makeup-vto",
            original_image_url=image_url,
            effect_name="Custom Makeup Blend",
            category="makeup",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_look_vto(
        self, 
        file_id: str, 
        look_preset_id: str, 
        image_url: str = ""
    ) -> NormalizedVtoResult:
        """
        Applies a complete thematic beauty look preset (e.g. Bronze Goddess, Soft Parisian).
        """
        LOOK_MAP = {
            "look-editorial-bronze": "all_the_sun",
            "look-parisienne": "all_albion",
            "look-golden-hour": "all_sun_stars",
            "look-cyberpunk": "all_feline"
        }
        template_id = look_preset_id if look_preset_id.startswith("all_") else LOOK_MAP.get(look_preset_id, "all_feline")
        options = {"template_id": template_id}
        if image_url and (not file_id or file_id.startswith("mock-")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("look-vto", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("look-vto", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Look VTO failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("look-vto", image_url, look_preset_id, "makeup") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="look-vto",
            original_image_url=image_url,
            effect_name=f"Look: {look_preset_id.replace('-', ' ').title()}",
            category="makeup",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def transfer_makeup(
        self, 
        target_file_id: str, 
        reference_file_id: str, 
        image_url: str = ""
    ) -> NormalizedVtoResult:
        """
        Extracts makeup style from reference photo and applies to target face.
        """
        options = {"ref_file_id": reference_file_id}
        task = await self.task_manager.create_task("makeup-transfer", target_file_id, options=options, unit_cost=2)
        poll_res = await self.task_manager.poll_task("makeup-transfer", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Makeup Transfer failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("makeup-transfer", image_url, "ref_transfer", "makeup") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="makeup-transfer",
            original_image_url=image_url,
            effect_name="Editorial Makeup Transfer",
            category="makeup",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_eye_color(
        self, 
        file_id: str, 
        lens_color: str = "Hazel", 
        image_url: str = ""
    ) -> NormalizedVtoResult:
        """
        Applies cosmetic contact lens coloration to the iris.
        """
        options = {"color": lens_color}
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("eye-color", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("eye-color", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Eye Color failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("eye-color", image_url, lens_color, "makeup") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="eye-color",
            original_image_url=image_url,
            effect_name=f"{lens_color.title()} Contact Lenses",
            category="makeup",
            parameters=options,
            is_mock=poll_res.is_mock
        )
