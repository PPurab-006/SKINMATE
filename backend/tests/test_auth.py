"""
Unit Tests for YouCam Authentication & Unit Quota Protection
"""

import pytest
from backend.services.youcam.authentication import YouCamAuthManager
from backend.services.youcam.exceptions import YouCamAuthError, InsufficientUnitsError

def test_auth_unconfigured():
    auth = YouCamAuthManager(api_key="")
    assert auth.is_configured is False
    assert auth.mask_key() == "NOT_CONFIGURED"
    with pytest.raises(YouCamAuthError):
        auth.get_auth_headers()

def test_auth_configured():
    auth = YouCamAuthManager(api_key="yc_test_secret_key_12345")
    assert auth.is_configured is True
    assert "..." in auth.mask_key()
    headers = auth.get_auth_headers()
    assert "Authorization" in headers
    assert headers["Authorization"] == "Bearer yc_test_secret_key_12345"

def test_unit_deduction():
    auth = YouCamAuthManager(api_key="test_key")
    assert auth.remaining_units == 1000
    assert auth.units_consumed == 0

    auth.deduct_units(1, "skin-analysis")
    assert auth.remaining_units == 999
    assert auth.units_consumed == 1

    auth.deduct_units(2, "hair-transfer")
    assert auth.remaining_units == 997
    assert auth.units_consumed == 3

def test_insufficient_units_guard():
    auth = YouCamAuthManager(api_key="test_key")
    auth._units_consumed = 1000  # Exhaust units
    assert auth.remaining_units == 0
    with pytest.raises(InsufficientUnitsError):
        auth.deduct_units(1, "skin-analysis")
