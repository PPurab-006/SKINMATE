"""
Pydantic Schemas for YouCam Services and Normalized SkinMate Responses
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class FileUploadResponse(BaseModel):
    status: str
    file_id: str
    file_url: Optional[str] = None
    upload_url: Optional[str] = None
    sha256_hash: Optional[str] = None
    is_mock: bool = False


class TaskCreationRequest(BaseModel):
    service_slug: str
    file_id: str
    options: Optional[Dict[str, Any]] = Field(default_factory=dict)
    idempotency_key: Optional[str] = None


class TaskCreationResponse(BaseModel):
    status: str
    task_id: str
    service_slug: str
    estimated_wait_time_sec: int = 3
    is_cached: bool = False
    is_mock: bool = False


class TaskPollResponse(BaseModel):
    status: str  # pending, running, success, failed
    task_id: str
    service_slug: str
    progress_pct: int = 100
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    is_mock: bool = False


# --- Normalized Skin & Facial Schemas ---

class SkinConcernItem(BaseModel):
    id: str
    name: str
    score: int
    severity: str  # mild, moderate, pronounced
    description: str
    affected_regions: List[str] = Field(default_factory=list)
    heatmap_coordinates: List[Dict[str, Any]] = Field(default_factory=list)
    mask_urls: List[str] = Field(default_factory=list)


class FacialColorTone(BaseModel):
    dominant_hex: str
    undertone: str  # Warm, Cool, Neutral, Olive
    contrast: str
    melanin_index: int
    season_palette: str


class FaceAttributes(BaseModel):
    face_shape: str  # Oval, Round, Heart, Square, Oblong
    symmetry_score: int
    eye_distance_ratio: float
    golden_ratio_match: float
    jawline_type: str


class NormalizedSkinProfile(BaseModel):
    id: str
    timestamp: str
    image_url: str
    skin_type: str  # Oily, Dry, Combination, Normal, Sensitive
    fitzpatrick: str  # I, II, III, IV, V, VI
    color_tone: FacialColorTone
    face_attributes: Optional[FaceAttributes] = None
    concerns: Dict[str, SkinConcernItem]
    overall_balance_score: int
    is_mock_demonstration: bool = False
    disclaimer: str = "Consumer beauty intelligence evaluation. Not intended for clinical or dermatological diagnosis."


# --- Normalized Hair & Beard Schemas ---

class NormalizedHairProfile(BaseModel):
    id: str
    timestamp: str
    image_url: str
    pattern: str  # Straight (1), Wavy (2A-2C), Curly (3A-3C), Coily (4A-4C)
    length: str  # Short, Mid-Length, Long
    frizziness_score: int
    density: str  # Low, Medium, Dense
    porosity: str  # Low, Medium, High
    scalp_type: str  # Normal, Dry, Oily, Sensitive
    is_mock_demonstration: bool = False


# --- Normalized Virtual Try-On & Appearance Schemas ---

class NormalizedVtoResult(BaseModel):
    task_id: str
    service_slug: str
    original_image_url: str
    styled_image_url: str
    effect_name: str
    category: str  # hair, beard, makeup, nails, appearance
    parameters_applied: Dict[str, Any] = Field(default_factory=dict)
    is_mock_demonstration: bool = False


# --- Unit / Quota Status ---

class UnitUsageStatus(BaseModel):
    initial_allotment: int = 1000
    units_consumed: int
    remaining_units: int
    total_calls_logged: int
    is_mock_mode: bool
