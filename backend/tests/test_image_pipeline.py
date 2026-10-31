"""
Unit Tests for Image Processing Pipeline
"""

import io
import pytest
from PIL import Image
from backend.services.youcam.image_upload import ImageProcessor
from backend.services.youcam.exceptions import YouCamValidationError

def create_test_image(width=600, height=800, color=(200, 150, 120), format="JPEG"):
    buf = io.BytesIO()
    img = Image.new("RGB", (width, height), color)
    img.save(buf, format=format, quality=90)
    return buf.getvalue()

def test_valid_image_processing():
    raw = create_test_image(600, 800)
    optimized_bytes, sha256_hash, meta = ImageProcessor.validate_and_process(raw, "selfie.jpg", "skin-analysis")
    
    assert len(optimized_bytes) > 0
    assert len(sha256_hash) == 64
    assert meta["width"] == 600
    assert meta["height"] == 800
    assert meta["original_format"] == "JPEG"

def test_too_small_dimensions():
    # Min dimension is 384
    raw = create_test_image(200, 200)
    with pytest.raises(YouCamValidationError) as exc:
        ImageProcessor.validate_and_process(raw, "tiny.jpg")
    assert "dimensions" in str(exc.value)

def test_corrupt_image_data():
    garbage_bytes = b"not_an_image_binary_data_at_all_12345"
    with pytest.raises(YouCamValidationError):
        ImageProcessor.validate_and_process(garbage_bytes, "fake.jpg")

def test_rgba_to_rgb_conversion():
    buf = io.BytesIO()
    img = Image.new("RGBA", (512, 512), (200, 100, 100, 255))
    img.save(buf, format="PNG")
    raw = buf.getvalue()
    
    optimized, sha, meta = ImageProcessor.validate_and_process(raw, "alpha.png")
    # Verify resulting image is RGB
    res_img = Image.open(io.BytesIO(optimized))
    assert res_img.mode == "RGB"
