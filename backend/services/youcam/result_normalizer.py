"""
Result Normalizer: Converts raw provider payloads into standardized SkinMate schemas
"""

import time
from typing import Dict, Any, Optional
from backend.services.youcam.schemas import (
    NormalizedSkinProfile,
    NormalizedHairProfile,
    NormalizedVtoResult,
    SkinConcernItem,
    FacialColorTone,
    FaceAttributes,
)

class ResultNormalizer:
    """
    Safely normalizes raw YouCam S2S task outputs into consumer-first SkinMate models.
    """

    @staticmethod
    def normalize_skin_analysis(
        raw_skin: Dict[str, Any],
        raw_fitzpatrick: Optional[Dict[str, Any]] = None,
        raw_color_tones: Optional[Dict[str, Any]] = None,
        raw_face_attr: Optional[Dict[str, Any]] = None,
        image_url: str = "",
        is_mock: bool = False
    ) -> NormalizedSkinProfile:
        """
        Normalizes composite skin analysis data from multiple YouCam endpoints.
        """
        concerns_dict: Dict[str, SkinConcernItem] = {}

        # 1. Parse official YouCam S2S v2.0 array format in "output"
        metric_labels = {
            "pore": "Pores & Surface Balance",
            "texture": "Surface Texture",
            "wrinkle": "Fine Lines & Wrinkles",
            "acne": "Blemishes & Clarity",
            "age_spot": "Pigmentation & Spots",
            "redness": "Cutaneous Redness",
            "oiliness": "T-Zone Sebum Equilibrium",
            "eye_bag": "Dark Circles & Eye Bags",
            "moisture": "Hydration Equilibrium",
            "radiance": "Skin Radiance"
        }
        overall_score = None
        if "output" in raw_skin and isinstance(raw_skin["output"], list):
            for item in raw_skin["output"]:
                if not isinstance(item, dict):
                    continue
                itype = item.get("type", "").lower()
                if itype == "all":
                    try:
                        overall_score = int(round(float(item.get("score", item.get("ui_score", 82)))))
                    except Exception:
                        overall_score = 82
                elif itype in metric_labels:
                    ui_score = int(item.get("ui_score", item.get("raw_score", 75)))
                    severity = "low" if ui_score >= 80 else ("moderate" if ui_score >= 60 else "high")
                    regions = ["T-Zone", "Cheeks"] if itype in ("pore", "oiliness") else (["Under-Eye"] if itype == "eye_bag" else ["Forehead", "Cheeks"])
                    raw_coords = item.get("heatmap_coordinates") or item.get("coordinates") or []
                    raw_masks = item.get("mask_urls") or ([item.get("overlay_url")] if item.get("overlay_url") else [])
                    concerns_dict[itype] = SkinConcernItem(
                        id=itype,
                        name=metric_labels[itype],
                        score=ui_score,
                        severity=severity,
                        description=f"Measured condition score {ui_score}/100 from optical facial analysis.",
                        affected_regions=regions,
                        heatmap_coordinates=raw_coords,
                        mask_urls=raw_masks
                    )

        # 2. Parse official Perfect Corp S2S format: list of concerns in "skincare_concerns"
        if not concerns_dict and "skincare_concerns" in raw_skin and isinstance(raw_skin["skincare_concerns"], list):
            for item in raw_skin["skincare_concerns"]:
                cid = item.get("concern", "").lower()
                if not cid:
                    continue
                ui_score = int(item.get("ui_score", item.get("raw_score", 75)))
                severity = "mild" if ui_score >= 80 else ("moderate" if ui_score >= 60 else "high")
                regions = ["T-zone", "Nose", "Cheeks"] if cid in ("pore", "oiliness", "spots") else ["Forehead", "Eye Contour"]
                raw_coords = item.get("heatmap_coordinates") or item.get("coordinates") or []
                raw_masks = item.get("mask_urls") or ([item.get("overlay_url")] if item.get("overlay_url") else [])

                concerns_dict[cid] = SkinConcernItem(
                    id=cid,
                    name=metric_labels.get(cid, cid.replace("_", " ").title()),
                    score=ui_score,
                    severity=severity,
                    description=f"Measured condition score {ui_score}/100 from facial scanning.",
                    affected_regions=regions,
                    heatmap_coordinates=raw_coords,
                    mask_urls=raw_masks
                )

        # 3. Parse dictionary format (mock or alternate S2S payload)
        raw_concerns = raw_skin.get("concerns", {})
        if not concerns_dict and isinstance(raw_concerns, dict):
            for cid, cdata in raw_concerns.items():
                raw_coords = cdata.get("coordinates") or cdata.get("heatmap_coordinates") or []
                raw_masks = cdata.get("mask_urls") or ([cdata.get("overlay_url")] if cdata.get("overlay_url") else [])
                concerns_dict[cid] = SkinConcernItem(
                    id=cid,
                    name=cdata.get("name", cid.replace("_", " ").title()),
                    score=cdata.get("score", 75),
                    severity=cdata.get("severity", "mild"),
                    description=cdata.get("description", "Even texture observed."),
                    affected_regions=cdata.get("regions", []),
                    heatmap_coordinates=raw_coords,
                    mask_urls=raw_masks
                )

        # 4. Parse Perfect Corp score_info.json dictionary directly
        if not concerns_dict and isinstance(raw_skin, dict):
            for cid, label in metric_labels.items():
                if cid in raw_skin and isinstance(raw_skin[cid], dict):
                    cdata = raw_skin[cid]
                    ui_score = int(cdata.get("ui_score", cdata.get("raw_score", 75)))
                    severity = "low" if ui_score >= 80 else ("moderate" if ui_score >= 60 else "high")
                    regions = ["T-Zone", "Cheeks"] if cid in ("pore", "oiliness") else (["Under-Eye"] if cid == "eye_bag" else ["Forehead", "Cheeks"])
                    raw_coords = cdata.get("heatmap_coordinates") or cdata.get("coordinates") or []
                    raw_masks = cdata.get("mask_urls") or ([cdata.get("overlay_url")] if cdata.get("overlay_url") else [])
                    concerns_dict[cid] = SkinConcernItem(
                        id=cid,
                        name=label,
                        score=ui_score,
                        severity=severity,
                        description=f"Measured condition score {ui_score}/100 from optical facial analysis.",
                        affected_regions=regions,
                        heatmap_coordinates=raw_coords,
                        mask_urls=raw_masks
                    )

        # Fitzpatrick phototype
        fitz = "IV"
        if raw_fitzpatrick:
            fitz = raw_fitzpatrick.get("fitzpatrick_type") or raw_fitzpatrick.get("type", "IV")

        # Color tones
        color_tone = FacialColorTone(
            dominant_hex="#C59572",
            undertone="Olive",
            contrast="Medium",
            melanin_index=42,
            season_palette="Warm Autumn"
        )
        if raw_color_tones:
            color_tone = FacialColorTone(
                dominant_hex=raw_color_tones.get("dominant_hex", "#C59572"),
                undertone=raw_color_tones.get("undertone", "Olive"),
                contrast=raw_color_tones.get("contrast", "Medium"),
                melanin_index=raw_color_tones.get("melanin_index", 42),
                season_palette=raw_color_tones.get("season_palette", "Warm Autumn")
            )

        # Face attributes
        face_attributes: Optional[FaceAttributes] = None
        if raw_face_attr:
            face_attributes = FaceAttributes(
                face_shape=raw_face_attr.get("face_shape", "Oval"),
                symmetry_score=raw_face_attr.get("symmetry_score", 90),
                eye_distance_ratio=raw_face_attr.get("eye_distance_ratio", 1.0),
                golden_ratio_match=raw_face_attr.get("golden_ratio_match", 0.92),
                jawline_type=raw_face_attr.get("jawline_type", "Soft Angular")
            )

        if overall_score is None:
            overall_score = raw_skin.get("overall_score") or raw_skin.get("score")
            if not overall_score and "all" in raw_skin and isinstance(raw_skin["all"], dict):
                overall_score = int(raw_skin["all"].get("ui_score", 82))
            if not overall_score:
                overall_score = 82

        skin_type = raw_skin.get("skin_type")
        if not skin_type:
            oil = raw_skin.get("oiliness", {}).get("ui_score", 70) if isinstance(raw_skin.get("oiliness"), dict) else 70
            moist = raw_skin.get("moisture", {}).get("ui_score", 70) if isinstance(raw_skin.get("moisture"), dict) else 70
            if oil < 60 and moist > 70:
                skin_type = "Oily"
            elif moist < 60:
                skin_type = "Dry"
            else:
                skin_type = "Combination"

        return NormalizedSkinProfile(
            id=f"skin_eval_{int(time.time())}",
            timestamp="Just now",
            image_url=image_url,
            skin_type=skin_type,
            fitzpatrick=fitz,
            color_tone=color_tone,
            face_attributes=face_attributes,
            concerns=concerns_dict,
            overall_balance_score=overall_score,
            is_mock_demonstration=is_mock
        )

    @staticmethod
    def normalize_hair_analysis(
        raw_type: Dict[str, Any],
        raw_length: Optional[Dict[str, Any]] = None,
        raw_frizz: Optional[Dict[str, Any]] = None,
        raw_density: Optional[Dict[str, Any]] = None,
        image_url: str = "",
        is_mock: bool = False
    ) -> NormalizedHairProfile:
        """
        Normalizes composite hair detection outputs into a single holistic hair profile.
        """
        pattern = raw_type.get("pattern") or raw_type.get("hair_type", "Type 2B (Soft Waves)")
        length = "Medium / Collarbone"
        if raw_length:
            length = raw_length.get("length", length)

        frizziness = 65
        if raw_frizz:
            frizziness = raw_frizz.get("frizziness_score", frizziness)

        density = "Medium / Dense"
        if raw_density:
            density = raw_density.get("density", density)

        return NormalizedHairProfile(
            id=f"hair_eval_{int(time.time())}",
            timestamp="Just now",
            image_url=image_url,
            pattern=pattern,
            length=length,
            frizziness_score=frizziness,
            density=density,
            porosity="Medium",
            scalp_type="Normal to Dry",
            is_mock_demonstration=is_mock
        )

    @staticmethod
    def normalize_vto(
        raw_task_poll: Dict[str, Any],
        service_slug: str,
        original_image_url: str,
        effect_name: str,
        category: str,
        parameters: Optional[Dict[str, Any]] = None,
        is_mock: bool = False
    ) -> NormalizedVtoResult:
        """
        Normalizes virtual try-on and appearance simulation results.
        """
        result = raw_task_poll.get("result", {})
        styled_url = (
            result.get("url")
            or (result.get("results", {}).get("url") if isinstance(result.get("results"), dict) else None)
            or (result.get("files", [{}])[0].get("file_url") if isinstance(result.get("files"), list) and result.get("files") and isinstance(result.get("files")[0], dict) else None)
            or (result.get("files", [{}])[0].get("url") if isinstance(result.get("files"), list) and result.get("files") and isinstance(result.get("files")[0], dict) else None)
            or result.get("styled_image_url") 
            or result.get("output_file_url") 
            or result.get("file_url") 
            or original_image_url
        )

        return NormalizedVtoResult(
            task_id=raw_task_poll.get("task_id", f"vto_{int(time.time())}"),
            service_slug=service_slug,
            original_image_url=original_image_url,
            styled_image_url=styled_url,
            effect_name=effect_name,
            category=category,
            parameters_applied=parameters or {},
            is_mock_demonstration=is_mock
        )
