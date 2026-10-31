"""
Integration Tests for YouCam Capability Adapters
Verifies every adapter functions cleanly and yields validated Pydantic schemas.
"""

import pytest
from backend.services.youcam.client import YouCamUnifiedClient

@pytest.fixture
def client():
    # Initializes client in Mock Sandbox mode (0 units consumed)
    return YouCamUnifiedClient(api_key="")

@pytest.mark.asyncio
async def test_skin_adapter(client):
    skin_profile = await client.skin.analyze_skin(
        file_id="test_file_skin",
        image_url="https://images.unsplash.com/selfie.jpg"
    )
    assert skin_profile.skin_type in ("Combination", "Oily", "Dry", "Normal")
    assert skin_profile.fitzpatrick in ("I", "II", "III", "IV", "V", "VI")
    assert skin_profile.color_tone.undertone in ("Warm", "Cool", "Neutral", "Olive")
    assert "pores" in skin_profile.concerns
    assert skin_profile.is_mock_demonstration is True

    # Skin simulation
    sim_res = await client.skin.simulate_skin_progression(
        file_id="test_file_skin",
        weeks=8
    )
    assert sim_res.category == "skin"
    assert "8-Week" in sim_res.effect_name

@pytest.mark.asyncio
async def test_facial_adapter(client):
    tones = await client.facial.get_facial_color_tones(file_id="test_file_face")
    assert tones.undertone in ("Warm", "Cool", "Neutral", "Olive")
    assert tones.dominant_hex.startswith("#")

    attrs = await client.facial.get_face_attributes(file_id="test_file_face")
    assert attrs.face_shape in ("Oval", "Round", "Heart", "Square", "Oblong")
    assert attrs.symmetry_score > 0

    lift = await client.facial.apply_face_lift(file_id="test_file_face", intensity=40)
    assert lift.service_slug == "face-lift"

    reshape = await client.facial.apply_face_reshape(file_id="test_file_face")
    assert reshape.service_slug == "face-reshape"

@pytest.mark.asyncio
async def test_hair_adapter(client):
    hair_profile = await client.hair.analyze_hair(file_id="test_file_hair")
    assert "Type" in hair_profile.pattern
    assert hair_profile.frizziness_score >= 0
    assert hair_profile.density in ("Low", "Medium / Dense", "Dense")

    style = await client.hair.apply_hairstyle("test_file_hair", "french-bob")
    assert style.category == "hair"

    color = await client.hair.apply_hair_color("test_file_hair", "#3D2314")
    assert color.category == "hair"

    ext = await client.hair.apply_hair_extensions("test_file_hair", length_cm=20)
    assert ext.category == "hair"

    bangs = await client.hair.apply_bangs_filter("test_file_hair", fringe_type="curtain")
    assert bangs.category == "hair"

    vol = await client.hair.apply_hair_volume("test_file_hair", intensity=35)
    assert vol.category == "hair"

    waves = await client.hair.apply_wavy_hair("test_file_hair")
    assert waves.category == "hair"

@pytest.mark.asyncio
async def test_makeup_adapter(client):
    vto = await client.makeup.apply_makeup_vto("test_file_makeup", [{"category": "lipstick", "color": "#D1345B"}])
    assert vto.category == "makeup"

    look = await client.makeup.apply_look_vto("test_file_makeup", "sunset-glow")
    assert look.category == "makeup"

    transfer = await client.makeup.transfer_makeup("target_file", "ref_file")
    assert transfer.category == "makeup"

    lens = await client.makeup.apply_eye_color("test_file_makeup", "Emerald")
    assert lens.category == "makeup"

@pytest.mark.asyncio
async def test_nail_adapter(client):
    nail = await client.nails.apply_nail_vto("test_file_nail", color_hex="#8B1E3F", finish="Chrome")
    assert nail.category == "nails"
    assert nail.service_slug == "nail-vto"

    transfer = await client.nails.transfer_nail_art("target_file", "ref_file")
    assert transfer.category == "nails"

@pytest.mark.asyncio
async def test_beard_adapter(client):
    beard = await client.beard.generate_beard_style("test_file_beard", style_id="van-dyke")
    assert beard.category == "beard"
    assert "Van Dyke" in beard.effect_name

@pytest.mark.asyncio
async def test_appearance_adapter(client):
    smile = await client.appearance.apply_smile("test_file_app", intensity=60)
    assert smile.service_slug == "ai-smile"

    teeth = await client.appearance.apply_teeth_whitening("test_file_app", intensity=75)
    assert teeth.service_slug == "teeth-whitening"

    body = await client.appearance.apply_body_reshape("test_file_app")
    assert body.service_slug == "body-reshape"

    breast = await client.appearance.apply_breast_augmentation("test_file_app", cup_adjustment="+2 Cups")
    assert breast.service_slug == "breast-augmentation"

    abs_res = await client.appearance.apply_abs_filter("test_file_app", definition_level="Athletic")
    assert abs_res.service_slug == "ai-abs"
