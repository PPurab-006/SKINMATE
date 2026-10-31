from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

router = APIRouter(prefix="/api/recommendations", tags=["AI Recommendations"])

class AnalysisContext(BaseModel):
    skin_type: str
    fitzpatrick_scale: str
    primary_concerns: List[str]
    hair_pattern: Optional[str] = None
    target_budget_inr: Optional[float] = 3500.0

@router.post("/analyze")
async def generate_recommendations(context: AnalysisContext):
    """
    Deterministic clinical recommendation engine with Gemini-ready schema
    """
    recommended_actives = []
    
    if "pores" in [c.lower() for c in context.primary_concerns]:
        recommended_actives.append({
            "active": "Niacinamide (Vitamin B3) + Zinc PCA",
            "concentration": "10% / 1%",
            "mechanism": "5-alpha reductase inhibition for follicular sebum regulation and pore wall toning",
            "suggested_slot": "Morning Serum"
        })

    if "barrier" in [c.lower() for c in context.primary_concerns] or context.skin_type in ["Dry", "Sensitive"]:
        recommended_actives.append({
            "active": "Physiological 5-Ceramide Complex (NP, AP, EOP, AS, NS)",
            "concentration": "3:1:1:1 lipid ratio",
            "mechanism": "Replenishes intercellular lamellar lipid bilayers and prevents trans-epidermal water loss (TEWL)",
            "suggested_slot": "Evening Moisturizer"
        })

    # Always ensure photo-protection for Fitzpatrick III-IV
    recommended_actives.append({
        "active": "Broad-Spectrum Uvinul & Titanium Dioxide Filters (PA++++)",
        "concentration": "SPF 50+",
        "mechanism": "Prevents oxidative photo-degradation of collagen and post-inflammatory melanogenesis",
        "suggested_slot": "Morning Final Step"
    })

    return {
        "status": "success",
        "profile_summary": {
            "skin_type": context.skin_type,
            "fitzpatrick": context.fitzpatrick_scale,
            "budget_tier_inr": context.target_budget_inr
        },
        "recommendations": recommended_actives,
        "engine": "SkinMate Biochemical Rules Engine v1.0"
    }
