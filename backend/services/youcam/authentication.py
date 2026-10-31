"""
Authentication and Unit Quota Protection Manager
"""

import logging
from typing import Dict, Optional
from backend.config import settings
from backend.services.youcam.exceptions import YouCamAuthError, InsufficientUnitsError

logger = logging.getLogger("skinmate.youcam.auth")

class YouCamAuthManager:
    """
    Manages server-side YouCam API credentials and enforces unit safety limits.
    """
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None, mock_mode: Optional[bool] = None):
        if api_key is not None:
            self._api_key = api_key
            self._mock_mode = mock_mode if mock_mode is not None else False
        else:
            self._api_key = settings.YOUCAM_API_KEY
            self._mock_mode = mock_mode if mock_mode is not None else settings.YOUCAM_MOCK_MODE
        self._base_url = (base_url or settings.YOUCAM_BASE_URL).rstrip("/")
        self._units_consumed = 0
        self._initial_allotment = 1000

    @property
    def is_configured(self) -> bool:
        if self._mock_mode:
            return False
        return bool(self._api_key and self._api_key.strip())

    @property
    def base_url(self) -> str:
        return self._base_url

    @property
    def remaining_units(self) -> int:
        return max(0, self._initial_allotment - self._units_consumed)

    @property
    def units_consumed(self) -> int:
        return self._units_consumed

    def get_auth_headers(self) -> Dict[str, str]:
        """
        Returns standard Authorization headers. Raises YouCamAuthError if key is missing in live mode.
        """
        if not self.is_configured:
            raise YouCamAuthError("YOUCAM_API_KEY is not configured in server environment.")
        return {
            "Authorization": f"Bearer {self._api_key}",
            "User-Agent": "SkinMate-Core/2.0 (FastAPI; Linux)"
        }

    def deduct_units(self, count: int = 1, service_slug: str = "generic"):
        """
        Safely records unit consumption and halts if quota would be breached.
        """
        if self._mock_mode:
            logger.info("Mock mode active: 0 units deducted for %s. (Remaining units protected: %d)", service_slug, self.remaining_units)
            return

        if self.remaining_units < count:
            logger.error("Unit quota exhausted! Requested %d units, %d remaining.", count, self.remaining_units)
            raise InsufficientUnitsError(
                f"Cannot execute {service_slug}: requires {count} units, only {self.remaining_units} left.",
                remaining_units=self.remaining_units
            )
        self._units_consumed += count
        logger.info("Deducted %d unit(s) for %s. Units remaining: %d", count, service_slug, self.remaining_units)

    def mask_key(self) -> str:
        """Returns a safe, masked representation of the API key for diagnostics."""
        if not self._api_key:
            return "NOT_CONFIGURED"
        clean = self._api_key.strip()
        if len(clean) <= 8:
            return "****"
        return f"{clean[:4]}...{clean[-4:]}"
