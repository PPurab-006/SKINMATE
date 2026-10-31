"""
Skin Intelligence Adapter: AI Skin Analysis & Simulation
"""

import logging
from typing import Dict, Any, Optional
from backend.services.youcam.task_manager import TaskManager
from backend.services.youcam.result_normalizer import ResultNormalizer
from backend.services.youcam.mock_provider import YouCamMockProvider
from backend.services.youcam.schemas import NormalizedSkinProfile, NormalizedVtoResult
from backend.services.youcam.exceptions import YouCamTaskError

logger = logging.getLogger("skinmate.youcam.skin")

class SkinAdapter:
    def __init__(self, task_manager: TaskManager):
        self.task_manager = task_manager

    async def analyze_skin(
        self, 
        file_id: str, 
        image_url: str = "",
        include_fitzpatrick: bool = True,
        include_color_tones: bool = True,
        include_face_attributes: bool = True
    ) -> NormalizedSkinProfile:
        """
        Executes AI Skin Analysis along with optional Fitzpatrick and Color Tone evaluation.
        """
        # Primary Skin Analysis Task with verified S2S accepted actions
        skin_task = await self.task_manager.create_task(
            service_slug="skin-analysis",
            file_id=file_id,
            options={
                "dst_actions": ["wrinkle", "pore", "texture", "acne", "age_spot", "redness", "oiliness", "eye_bag", "moisture", "radiance"],
                "miniserver_args": {"enable_mask_overlay": True},
                "format": "json"
            },
            unit_cost=1
        )

        poll_res = await self.task_manager.poll_task(
            service_slug="skin-analysis",
            task_id=skin_task.task_id
        )

        if not poll_res.is_mock and poll_res.status != "success":
            raise YouCamTaskError(f"YouCam AI Skin Analysis failed with status: {poll_res.status}")

        raw_skin = poll_res.result or {}
        
        # If YouCam returned an S3 zip artifact URL, download and unpack score_info.json in memory
        if isinstance(raw_skin, dict) and "url" in raw_skin:
            s3_url = raw_skin["url"]
            try:
                import io, zipfile, json, httpx
                async with httpx.AsyncClient(timeout=20.0) as client:
                    zip_res = await client.get(s3_url)
                    if zip_res.status_code == 200:
                        zf = zipfile.ZipFile(io.BytesIO(zip_res.content))
                        for fname in zf.namelist():
                            if fname.endswith("score_info.json"):
                                raw_skin = json.loads(zf.read(fname).decode("utf-8"))
                                break
            except Exception as e:
                logger.warning("Could not unpack skin analysis zip from %s: %s", s3_url, str(e))

        if not raw_skin and poll_res.is_mock:
            raw_skin = YouCamMockProvider.get_mock_skin_analysis(image_url)

        raw_fitz = YouCamMockProvider.get_mock_fitzpatrick() if (include_fitzpatrick and poll_res.is_mock) else None
        raw_tones = YouCamMockProvider.get_mock_facial_color_tones() if (include_color_tones and poll_res.is_mock) else None
        raw_face = YouCamMockProvider.get_mock_face_attributes() if (include_face_attributes and poll_res.is_mock) else None

        return ResultNormalizer.normalize_skin_analysis(
            raw_skin=raw_skin,
            raw_fitzpatrick=raw_fitz,
            raw_color_tones=raw_tones,
            raw_face_attr=raw_face,
            image_url=image_url,
            is_mock=poll_res.is_mock
        )

    async def simulate_skin_progression(
        self,
        file_id: str,
        image_url: str = "",
        weeks: int = 8,
        target_concerns: Optional[list] = None
    ) -> NormalizedVtoResult:
        """
        Executes AI Skin Simulation showing projected cutaneous improvements.
        """
        options = {
            "timeline_weeks": weeks,
            "concerns": target_concerns or ["pores", "texture", "radiance"]
        }
        task = await self.task_manager.create_task(
            service_slug="skin-simulation",
            file_id=file_id,
            options=options,
            unit_cost=2
        )
        poll_res = await self.task_manager.poll_task(
            service_slug="skin-simulation",
            task_id=task.task_id
        )

        raw_sim = poll_res.result or YouCamMockProvider.get_mock_skin_simulation(image_url, weeks)

        return ResultNormalizer.normalize_vto(
            raw_task_poll={"task_id": task.task_id, "result": raw_sim},
            service_slug="skin-simulation",
            original_image_url=image_url,
            effect_name=f"{weeks}-Week Skin Care Progression",
            category="skin",
            parameters=options,
            is_mock=poll_res.is_mock
        )
