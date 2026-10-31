# ==============================================================================
# SkinMate Production Multi-Stage Container (FastAPI + Vite React SPA)
# ==============================================================================

# --- Stage 1: Build Frontend Assets ---
FROM node:20-slim AS frontend-builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Build production bundle
COPY tsconfig*.json vite.config.ts tailwind.config.js postcss.config.js index.html ./
COPY src/ ./src/
RUN npm run build

# --- Stage 2: Production Python Runtime ---
FROM python:3.11-slim AS runtime
WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Application source
COPY backend/ ./backend/
COPY --from=frontend-builder /app/dist ./dist

# Environment defaults
ENV HOST=0.0.0.0
ENV PORT=8000
ENV PYTHONUNBUFFERED=1
ENV YOUCAM_MOCK_MODE=true
ENV YOUCAM_BASE_URL=https://yce-api-01.makeupar.com

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Launch production server
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}"]
