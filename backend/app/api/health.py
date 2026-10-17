"""
GET /health — application health check endpoint.
"""
from fastapi import APIRouter
from config import get_settings
from app.services.database import is_supabase_configured

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Application health check")
async def health_check():
    """
    Returns the status of the application and its external dependencies.
    Does NOT make live network calls — only checks configuration.
    """
    settings = get_settings()
    return {
        "status": "ok",
        "version": "1.0.0",
        "nvidia_configured": bool(settings.nvidia_api_key),
        "supabase_configured": is_supabase_configured(),
        "storage_mode": "supabase" if is_supabase_configured() else "in-memory",
    }
