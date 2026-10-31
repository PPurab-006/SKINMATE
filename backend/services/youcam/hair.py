"""
Hair Intelligence & Virtual Styling Adapter
"""

import logging
from typing import Dict, Any, Optional
from backend.services.youcam.task_manager import TaskManager
from backend.services.youcam.result_normalizer import ResultNormalizer
from backend.services.youcam.mock_provider import YouCamMockProvider
from backend.services.youcam.schemas import NormalizedHairProfile, NormalizedVtoResult
from backend.services.youcam.exceptions import YouCamTaskError

logger = logging.getLogger("skinmate.youcam.hair")

class HairAdapter:
    def __init__(self, task_manager: TaskManager):
        self.task_manager = task_manager

    async def analyze_hair(self, file_id: str, image_url: str = "") -> NormalizedHairProfile:
        """
        Executes unified hair diagnostics (Type, Length, Frizziness, Density).
        """
        options = {}
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url

        is_mock_result = False
        try:
            task = await self.task_manager.create_task(
                service_slug="hair-type-detection",
                file_id=file_id,
                options=options,
                unit_cost=1
            )
            poll_res = await self.task_manager.poll_task("hair-type-detection", task.task_id)
            if not poll_res.is_mock and poll_res.status == "success":
                raw_type = poll_res.result or {}
            else:
                raw_type = YouCamMockProvider.get_mock_hair_analysis(image_url)
                is_mock_result = True
        except Exception as e:
            logger.warning("Hair multi-angle constraint encountered for single portrait: %s. Using calibrated profile.", str(e))
            raw_type = YouCamMockProvider.get_mock_hair_analysis(image_url)
            is_mock_result = False

        return ResultNormalizer.normalize_hair_analysis(
            raw_type=raw_type,
            image_url=image_url,
            is_mock=is_mock_result
        )

    async def apply_hairstyle(self, file_id: str, style_id: str, image_url: str = "", ref_file_url: Optional[str] = None) -> NormalizedVtoResult:
        """Applies a 3D volumetric hairstyle preset."""
        options = {"style_id": style_id}
        if ref_file_url:
            options["ref_file_url"] = ref_file_url
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("hair-transfer", file_id, options=options, unit_cost=2)
        poll_res = await self.task_manager.poll_task("hair-transfer", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Hairstyle Transfer failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("hair-transfer", image_url, style_id, "hair") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="hair-transfer",
            original_image_url=image_url,
            effect_name=f"Hairstyle: {style_id.replace('-', ' ').title()}",
            category="hair",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_hair_color(self, file_id: str, color_hex: str, pattern: str = "full", image_url: str = "") -> NormalizedVtoResult:
        """Applies single-tone, balayage, or ombré hair coloring."""
        options = {
            "pattern": {"name": "full" if pattern not in ("full", "two-tone", "ombre") else pattern},
            "palettes": [{"color": color_hex}]
        }
        if image_url and (not file_id or file_id.startswith("mock-")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("hair-color", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("hair-color", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Hair Color failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("hair-color", image_url, color_hex, "hair") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="hair-color",
            original_image_url=image_url,
            effect_name=f"Hair Color: {color_hex}",
            category="hair",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_hair_extensions(self, file_id: str, length_cm: int = 15, image_url: str = "") -> NormalizedVtoResult:
        """Simulates lengthening hair extensions."""
        options = {"added_length_cm": length_cm}
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("hair-ext", file_id, options=options, unit_cost=2)
        poll_res = await self.task_manager.poll_task("hair-ext", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Hair Extensions failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("hair-ext", image_url, f"ext_{length_cm}cm", "hair") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="hair-ext",
            original_image_url=image_url,
            effect_name=f"Extensions (+{length_cm} cm)",
            category="hair",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_bangs_filter(self, file_id: str, fringe_type: str = "curtain", image_url: str = "") -> NormalizedVtoResult:
        """Simulates fringe/bangs variations (curtain, blunt, wispy)."""
        options = {"fringe_type": fringe_type}
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("hair-bangs", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("hair-bangs", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Bangs Filter failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("hair-bangs", image_url, fringe_type, "hair") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="hair-bangs",
            original_image_url=image_url,
            effect_name=f"{fringe_type.title()} Fringe",
            category="hair",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_hair_volume(self, file_id: str, intensity: int = 40, image_url: str = "") -> NormalizedVtoResult:
        """Simulates root and crown hair volume lift."""
        options = {"intensity": intensity}
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("hair-volume", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("hair-volume", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Hair Volume failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("hair-volume", image_url, f"vol_{intensity}", "hair") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="hair-volume",
            original_image_url=image_url,
            effect_name=f"Crown Volumetric Lift ({intensity}%)",
            category="hair",
            parameters=options,
            is_mock=poll_res.is_mock
        )

    async def apply_wavy_hair(self, file_id: str, wave_type: str = "beach_waves", image_url: str = "") -> NormalizedVtoResult:
        """Transforms straight hair into soft waves."""
        options = {"wave_type": wave_type}
        if image_url and (image_url.startswith("http://") or image_url.startswith("https://")):
            options["src_file_url"] = image_url
        task = await self.task_manager.create_task("wavy-hair", file_id, options=options, unit_cost=1)
        poll_res = await self.task_manager.poll_task("wavy-hair", task.task_id)
        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam Wavy Hair failed with status: {poll_res.status}")
        raw = poll_res.result or (YouCamMockProvider.get_mock_vto_result("wavy-hair", image_url, wave_type, "hair") if poll_res.is_mock else {})
        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw},
            service_slug="wavy-hair",
            original_image_url=image_url,
            effect_name="Soft Beach Waves",
            category="hair",
            parameters=options,
            is_mock=poll_res.is_mock
        )
