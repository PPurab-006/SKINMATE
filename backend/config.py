import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    YOUCAM_API_KEY: str = os.getenv("YOUCAM_API_KEY", "")
    YOUCAM_SECRET_KEY: str = os.getenv("YOUCAM_SECRET_KEY", "")
    YOUCAM_BASE_URL: str = os.getenv("YOUCAM_BASE_URL", "https://yce-api-01.makeupar.com")
    YOUCAM_MOCK_MODE: bool = os.getenv("YOUCAM_MOCK_MODE", "false").lower() in ("true", "1", "yes")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

settings = Settings()
