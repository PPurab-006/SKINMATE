import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.routers import youcam, recommendations, history, products
from backend.config import settings

app = FastAPI(
    title="SkinMate Intelligence API",
    description="S2S Orchestration layer for YouCam AI Computer Vision and Cosmetic Biochemical Rules Engine",
    version="1.0.0"
)

# Enable CORS for local Vite dev server and external clients
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
app.include_router(history.router)
app.include_router(products.router)

@app.get("/health")
def health_check():
    is_live = bool(settings.YOUCAM_API_KEY) and not settings.YOUCAM_MOCK_MODE
    return {
        "status": "online",
        "app": "SkinMate API",
        "version": "1.0.0",
        "youcam_configured": is_live,
        "mode": "Live Production" if is_live else "Sandbox Mock (Zero Credits Mode - Quota Preserved)"
    }

# Serve React frontend in production if dist/ exists
dist_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
    async def serve_spa(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
