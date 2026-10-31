import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    YOUCAM_API_KEY: str = os.getenv("YOUCAM_API_KEY", "")
    YOUCAM_BASE_URL: str = os.getenv("YOUCAM_BASE_URL", "https://yce-api-01.makeupar.com")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")

settings = Settings()
