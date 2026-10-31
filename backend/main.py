from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import youcam, recommendations
from backend.config import settings

app = FastAPI(
    title="SkinMate Intelligence API",
    description="S2S Orchestration layer for YouCam AI Computer Vision and Cosmetic Biochemical Rules Engine",
    version="1.0.0"
)

# Enable CORS for local Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(youcam.router)
app.include_router(recommendations.router)

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "app": "SkinMate API",
        "version": "1.0.0",
        "youcam_configured": bool(settings.YOUCAM_API_KEY),
        "mode": "Live Production" if settings.YOUCAM_API_KEY else "Sandbox Mock"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
