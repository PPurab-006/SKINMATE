"""
FastAPI Router for YouCam AI Computer Vision Integration
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

from backend.services.youcam.client import youcam_service
from backend.services.youcam.schemas import (
    FileUploadResponse,
    NormalizedSkinProfile,
    NormalizedHairProfile,
    NormalizedVtoResult,
    UnitUsageStatus,
    TaskCreationResponse,
    TaskPollResponse,
)
from backend.services.youcam.exceptions import (
    YouCamBaseException,
    YouCamValidationError,
    YouCamAuthError,
    InsufficientUnitsError,
)

router = APIRouter(prefix="/api/youcam", tags=["YouCam AI Core"])


class SkinAnalysisRequest(BaseModel):
    file_id: str
    image_url: Optional[str] = ""
    include_fitzpatrick: bool = True
    include_color_tones: bool = True
    include_face_attributes: bool = True


class HairAnalysisRequest(BaseModel):
    file_id: str
    image_url: Optional[str] = ""


class SkinSimulationRequest(BaseModel):
    file_id: str
    image_url: Optional[str] = ""
    timeline_weeks: int = 8
    target_concerns: Optional[List[str]] = None


class VtoApplyRequest(BaseModel):
    file_id: str
    category: str  # hair, beard, makeup, nails, appearance
    service_slug: str  # hair-transfer, hair-color, makeup-vto, beard-style, nail-vto, etc.
    effect_id: str
    parameters: Optional[Dict[str, Any]] = None
    image_url: Optional[str] = ""


@router.get("/quota", response_model=UnitUsageStatus)
def get_quota():
    """Returns YouCam unit balance and consumption tracking."""
    return youcam_service.get_quota_status()


@router.post("/upload", response_model=FileUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    service_slug: str = Form("generic")
):
    """
    Validates, normalizes dimensions, strips EXIF, and uploads image to YouCam S2S.
    """
    try:
        content = await file.read()
        return await youcam_service.process_and_upload(
            raw_bytes=content,
            filename=file.filename or "portrait.jpg",
            service_slug=service_slug
        )
    except YouCamValidationError as e:
        raise HTTPException(status_code=422, detail=e.message)
    except YouCamBaseException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")


@router.post("/skin/analyze", response_model=NormalizedSkinProfile)
async def analyze_skin(payload: SkinAnalysisRequest):
    """
    Executes AI Skin Analysis, Fitzpatrick classification, and Facial Color Tone evaluation.
    """
    try:
        return await youcam_service.skin.analyze_skin(
            file_id=payload.file_id,
            image_url=payload.image_url,
            include_fitzpatrick=payload.include_fitzpatrick,
            include_color_tones=payload.include_color_tones,
            include_face_attributes=payload.include_face_attributes
        )
    except InsufficientUnitsError as e:
        raise HTTPException(status_code=402, detail=e.message)
    except YouCamBaseException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skin analysis failed: {str(e)}")


@router.post("/skin/simulate", response_model=NormalizedVtoResult)
async def simulate_skin(payload: SkinSimulationRequest):
    """
    Simulates skin improvement progress over weeks.
    """
    try:
        return await youcam_service.skin.simulate_skin_progression(
            file_id=payload.file_id,
            image_url=payload.image_url,
            weeks=payload.timeline_weeks,
            target_concerns=payload.target_concerns
        )
    except YouCamBaseException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/hair/analyze", response_model=NormalizedHairProfile)
async def analyze_hair(payload: HairAnalysisRequest):
    """
    Executes comprehensive hair diagnostics: Type, Length, Frizziness, Density.
    """
    try:
        return await youcam_service.hair.analyze_hair(
            file_id=payload.file_id,
            image_url=payload.image_url
        )
    except YouCamBaseException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/style/vto", response_model=NormalizedVtoResult)
async def apply_vto(payload: VtoApplyRequest):
    """
    Dispatches to the appropriate studio adapter (hair, beard, makeup, nails, appearance).
    """
    try:
        cat = payload.category.lower()
        if cat == "hair":
            if payload.service_slug == "hair-color":
                color_hex = payload.parameters.get("color_hex", "#4A3728") if payload.parameters else "#4A3728"
                return await youcam_service.hair.apply_hair_color(payload.file_id, color_hex, image_url=payload.image_url)
            elif payload.service_slug == "hair-ext":
                length_cm = payload.parameters.get("length_cm", 15) if payload.parameters else 15
                return await youcam_service.hair.apply_hair_extensions(payload.file_id, length_cm, image_url=payload.image_url)
            elif payload.service_slug == "hair-bangs":
                fringe = payload.parameters.get("fringe_type", "curtain") if payload.parameters else "curtain"
                return await youcam_service.hair.apply_bangs_filter(payload.file_id, fringe, image_url=payload.image_url)
            elif payload.service_slug == "hair-volume":
                vol = payload.parameters.get("intensity", 40) if payload.parameters else 40
                return await youcam_service.hair.apply_hair_volume(payload.file_id, vol, image_url=payload.image_url)
            elif payload.service_slug == "wavy-hair":
                return await youcam_service.hair.apply_wavy_hair(payload.file_id, image_url=payload.image_url)
            else:
                ref_url = payload.parameters.get("ref_file_url") if payload.parameters else None
                return await youcam_service.hair.apply_hairstyle(payload.file_id, payload.effect_id, image_url=payload.image_url, ref_file_url=ref_url)

        elif cat == "beard":
            return await youcam_service.beard.generate_beard_style(
                payload.file_id, 
                style_id=payload.effect_id,
                image_url=payload.image_url
            )

        elif cat == "makeup":
            if payload.service_slug == "look-vto":
                return await youcam_service.makeup.apply_look_vto(payload.file_id, payload.effect_id, image_url=payload.image_url)
            elif payload.service_slug == "eye-color":
                color = payload.parameters.get("color", "Hazel") if payload.parameters else "Hazel"
                return await youcam_service.makeup.apply_eye_color(payload.file_id, color, image_url=payload.image_url)
            else:
                effects = payload.parameters.get("effects", []) if payload.parameters else []
                return await youcam_service.makeup.apply_makeup_vto(payload.file_id, effects, image_url=payload.image_url)

        elif cat == "nails":
            finish = payload.parameters.get("finish", "Glossy") if payload.parameters else "Glossy"
            return await youcam_service.nails.apply_nail_vto(payload.file_id, color_hex=payload.effect_id, finish=finish, image_url=payload.image_url)

        elif cat == "appearance":
            if payload.service_slug in ("ai-smile", "smile"):
                intensity = payload.parameters.get("intensity", 50) if payload.parameters else 50
                return await youcam_service.appearance.apply_smile(payload.file_id, intensity, image_url=payload.image_url)
            elif payload.service_slug in ("teeth-whitening", "teeth-whiten"):
                intensity = payload.parameters.get("intensity", 60) if payload.parameters else 60
                return await youcam_service.appearance.apply_teeth_whitening(payload.file_id, intensity, image_url=payload.image_url)
            elif payload.service_slug == "face-lift":
                intensity = payload.parameters.get("intensity", 50) if payload.parameters else 50
                return await youcam_service.facial.apply_face_lift(payload.file_id, image_url=payload.image_url, intensity=intensity)
            elif payload.service_slug == "face-reshape":
                return await youcam_service.facial.apply_face_reshape(payload.file_id, image_url=payload.image_url, parameters=payload.parameters)
            elif payload.service_slug == "body-reshape":
                return await youcam_service.appearance.apply_body_reshape(payload.file_id, payload.parameters, image_url=payload.image_url)
            elif payload.service_slug == "breast-augmentation":
                cup = payload.parameters.get("cup_size", "+1 Cup") if payload.parameters else "+1 Cup"
                return await youcam_service.appearance.apply_breast_augmentation(payload.file_id, cup, image_url=payload.image_url)
            elif payload.service_slug == "ai-abs":
                definition = payload.parameters.get("definition", "Toned") if payload.parameters else "Toned"
                return await youcam_service.appearance.apply_abs_filter(payload.file_id, definition, image_url=payload.image_url)

        raise HTTPException(status_code=400, detail=f"Unrecognized capability or category: {cat}/{payload.service_slug}")
    except YouCamBaseException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


# --- Low-level S2S Task Creation and Polling Proxies ---

@router.post("/task/{service_slug}", response_model=TaskCreationResponse)
async def create_generic_task(service_slug: str, payload: Dict[str, Any]):
    file_id = payload.get("file_id")
    if not file_id:
        raise HTTPException(status_code=422, detail="Missing required 'file_id' in payload.")
    options = {k: v for k, v in payload.items() if k != "file_id"}
    return await youcam_service.tasks.create_task(service_slug, file_id, options=options)


@router.get("/poll/{service_slug}/{task_id}", response_model=TaskPollResponse)
async def poll_generic_task(service_slug: str, task_id: str):
    return await youcam_service.tasks.poll_task(service_slug, task_id)
