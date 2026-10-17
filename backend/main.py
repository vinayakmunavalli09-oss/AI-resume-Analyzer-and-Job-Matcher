"""
AI Resume Analyzer & Job Matcher — FastAPI Application Entry Point.
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from config import get_settings
from app.core.security import limiter
from app.core.exceptions import register_exception_handlers
from app.services.database import is_supabase_configured
from app.api.health import router as health_router
from app.api.jobs import router as jobs_router
from app.api.resumes import router as resumes_router
from app.api.matches import router as matches_router
from app.api.saved_jobs import router as saved_jobs_router
from app.api.profile import router as profile_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("vpm.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info("==================================================")
    logger.info("Starting AI Resume Analyzer & Job Matcher Backend")
    logger.info("Storage mode: %s", "Supabase PostgreSQL" if is_supabase_configured() else "In-Memory Fallback")
    logger.info("NVIDIA NIM AI: %s", "CONFIGURED" if settings.nvidia_api_key else "NOT CONFIGURED (Deterministic fallback)")
    logger.info("Model: %s", settings.nvidia_model)
    logger.info("==================================================")
    yield
    logger.info("Shutting down backend service.")


app = FastAPI(
    title="AI Resume Analyzer and Job Matcher API",
    description="Career guidance, resume analysis, and entry-level job matching for freshers and early-career seekers.",
    version="1.0.0",
    lifespan=lifespan,
)

# Attach limiter to application state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Register custom and global exception handlers
register_exception_handlers(app)

# Configure CORS
settings = get_settings()
origins = [origin.strip() for origin in settings.backend_cors_origins.split(",") if origin.strip()]
if not origins:
    origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(health_router)
app.include_router(jobs_router)
app.include_router(resumes_router)
app.include_router(matches_router)
app.include_router(saved_jobs_router)
app.include_router(profile_router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "name": "AI Resume Analyzer and Job Matcher API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_url": "/health",
        "jobs_url": "/api/v1/jobs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.backend_host, port=settings.backend_port, reload=True)
