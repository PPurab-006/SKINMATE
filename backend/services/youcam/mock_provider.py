"""
High-Fidelity Mock Provider Reproducing YouCam S2S Response Schemas
Used for unit testing and zero-unit sandbox mode.
"""

from typing import Dict, Any, Optional

class YouCamMockProvider:
    """
    Generates realistic, schema-accurate responses matching Perfect Corp S2S v2.0 API specifications.
    """

    @staticmethod
    def get_mock_skin_analysis(image_url: str = "") -> Dict[str, Any]:
        return {
            "status": "success",
            "skin_type": "Combination",
            "overall_score": 83,
            "skin_age": 27,
            "concerns": {
                "pores": {
                    "score": 75,
                    "severity": "moderate",
                    "description": "Subtle oil-gland dilation noted across the central T-zone and nose bridge.",
                    "regions": ["Nose Bridge", "Medial Cheeks"],
                    "coordinates": [
                        {"x": 50, "y": 52, "radius": 24, "intensity": 0.65},
                        {"x": 42, "y": 56, "radius": 18, "intensity": 0.45}
                    ]
                },
                "hydration": {
                    "score": 82,
                    "severity": "mild",
                    "description": "Stratum corneum hydration shows balanced moisture retention with supple elasticity.",
                    "regions": ["Lateral Cheeks", "Temples"],
                    "coordinates": [
                        {"x": 35, "y": 60, "radius": 32, "intensity": 0.35},
                        {"x": 65, "y": 60, "radius": 32, "intensity": 0.35}
                    ]
                },
                "texture": {
                    "score": 78,
                    "severity": "mild",
                    "description": "Smooth epidermal micro-relief with localized surface texture along jawline.",
                    "regions": ["Perioral Area", "Chin"],
                    "coordinates": [
                        {"x": 50, "y": 72, "radius": 22, "intensity": 0.40}
                    ]
                },
                "dark_circles": {
                    "score": 70,
                    "severity": "moderate",
                    "description": "Mild vascular discoloration and periorbital shadowing in the infraorbital trough.",
                    "regions": ["Infraorbital Hollows"],
                    "coordinates": [
                        {"x": 38, "y": 44, "radius": 20, "intensity": 0.55},
                        {"x": 62, "y": 44, "radius": 20, "intensity": 0.55}
                    ]
                },
                "redness": {
                    "score": 88,
                    "severity": "mild",
                    "description": "Minimal cutaneous erythema. Capillary circulation appears calm and resilient.",
                    "regions": ["Alar Creases"],
                    "coordinates": [
                        {"x": 45, "y": 55, "radius": 14, "intensity": 0.30},
                        {"x": 55, "y": 55, "radius": 14, "intensity": 0.30}
                    ]
                },
                "oiliness": {
                    "score": 74,
                    "severity": "moderate",
                    "description": "Active sebum film along mid-forehead and nasal dorsum.",
                    "regions": ["Forehead Center", "Nose"],
                    "coordinates": [
                        {"x": 50, "y": 32, "radius": 28, "intensity": 0.60}
                    ]
                }
            }
        }

    @staticmethod
    def get_mock_fitzpatrick() -> Dict[str, Any]:
        return {
            "status": "success",
            "fitzpatrick_type": "IV",
            "description": "Type IV: Moderately pigmented skin. Tends to tan easily, burns minimally under moderate UV.",
            "melanin_index": 42
        }

    @staticmethod
    def get_mock_facial_color_tones() -> Dict[str, Any]:
        return {
            "status": "success",
            "dominant_hex": "#C59572",
            "undertone": "Olive",
            "contrast": "Medium-High",
            "melanin_index": 44,
            "season_palette": "Warm Autumn Earth Tones",
            "recommended_accents": ["Terracotta", "Forest Green", "Burnt Sienna", "Warm Ivory"]
        }

    @staticmethod
    def get_mock_face_attributes() -> Dict[str, Any]:
        return {
            "status": "success",
            "face_shape": "Oval",
            "symmetry_score": 91,
            "eye_distance_ratio": 1.02,
            "golden_ratio_match": 0.94,
            "jawline_type": "Soft Angular"
        }

    @staticmethod
    def get_mock_skin_simulation(image_url: str, weeks: int = 8) -> Dict[str, Any]:
        return {
            "status": "success",
            "simulated_image_url": image_url or "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
            "simulation_timeline_weeks": weeks,
            "targeted_improvements": ["Pore Refinement", "Enhanced Hydration Radiance", "Redness Calming"]
        }

    @staticmethod
    def get_mock_hair_analysis(image_url: str = "") -> Dict[str, Any]:
        return {
            "status": "success",
            "pattern": "Type 2B (Defined Soft Waves)",
            "length": "Medium / Collarbone Length",
            "frizziness_score": 68,
            "density": "Medium / Dense",
            "porosity": "Medium",
            "scalp_type": "Normal to Slightly Dry",
            "key_attributes": [
                "Soft S-pattern bends",
                "Cuticle responds well to lightweight hair oils",
                "High elasticity and natural movement"
            ]
        }

    @staticmethod
    def get_mock_vto_result(
        service_slug: str, 
        base_image: str, 
        effect_id: str, 
        category: str
    ) -> Dict[str, Any]:
        return {
            "status": "success",
            "service_slug": service_slug,
            "original_image_url": base_image,
            "styled_image_url": base_image,  # Uses base image with simulated style in mock mode
            "effect_id": effect_id,
            "category": category,
            "rendered_at": "Mock Sandbox Engine (No units spent)"
        }
