"""
YouCam Service Custom Exceptions
"""

class YouCamBaseException(Exception):
    """Base exception for all YouCam integration errors."""
    def __init__(self, message: str, status_code: int = 500, details: dict = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class YouCamAuthError(YouCamBaseException):
    """Raised when API key is missing, invalid, or unauthorized."""
    def __init__(self, message: str = "Invalid or missing YouCam API key.", details: dict = None):
        super().__init__(message, status_code=401, details=details)


class YouCamValidationError(YouCamBaseException):
    """Raised when an uploaded image fails dimension, format, or size criteria."""
    def __init__(self, message: str, details: dict = None):
        super().__init__(message, status_code=422, details=details)


class YouCamTaskError(YouCamBaseException):
    """Raised when an asynchronous task fails or returns an error status from YouCam."""
    def __init__(self, message: str, task_id: str = None, details: dict = None):
        super().__init__(message, status_code=502, details=details or {"task_id": task_id})
        self.task_id = task_id


class YouCamTimeoutError(YouCamBaseException):
    """Raised when task polling exceeds the maximum allotted wait time."""
    def __init__(self, message: str = "YouCam task processing timed out.", task_id: str = None):
        super().__init__(message, status_code=504, details={"task_id": task_id})
        self.task_id = task_id


class DuplicateSubmissionError(YouCamBaseException):
    """Raised when an identical analysis request is submitted within the cooldown period."""
    def __init__(self, message: str = "Duplicate request detected. Utilizing cached result to conserve API units.", cached_task_id: str = None):
        super().__init__(message, status_code=409, details={"cached_task_id": cached_task_id})
        self.cached_task_id = cached_task_id


class InsufficientUnitsError(YouCamBaseException):
    """Raised when available unit budget is exhausted or call would exceed safety limit."""
    def __init__(self, message: str = "Unit consumption safety limit reached.", remaining_units: int = 0):
        super().__init__(message, status_code=402, details={"remaining_units": remaining_units})
