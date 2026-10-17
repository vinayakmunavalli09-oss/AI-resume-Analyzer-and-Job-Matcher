"""
/api/v1/saved-jobs — bookmark and application status tracking.
Provides guest-friendly fallback user identification when auth header is omitted.
"""
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

from app.services.database import (
    get_saved_jobs,
    save_job,
    delete_saved_job,
    update_saved_job_status,
)

router = APIRouter(prefix="/api/v1/saved-jobs", tags=["Saved Jobs"])

VALID_STATUSES = {"interested", "saved", "applied", "interview", "interviewing", "offer", "offered", "rejected", "withdrawn"}


def _get_effective_user_id(x_user_id: Optional[str] = None) -> str:
    """Return provided user_id or default to local candidate profile."""
    return x_user_id.strip() if x_user_id and x_user_id.strip() else "local_candidate"


class SaveJobRequest(BaseModel):
    job_id: str
    notes: str = ""
    status: Optional[str] = "interested"


class UpdateStatusRequest(BaseModel):
    application_status: Optional[str] = None
    status: Optional[str] = None


@router.get("", summary="List saved jobs for the user")
async def list_saved_jobs(x_user_id: Optional[str] = Header(None)):
    user_id = _get_effective_user_id(x_user_id)
    jobs = await get_saved_jobs(user_id)
    return jobs


@router.post("", status_code=201, summary="Bookmark a job")
async def bookmark_job(body: SaveJobRequest, x_user_id: Optional[str] = Header(None)):
    user_id = _get_effective_user_id(x_user_id)
    status = body.status or "interested"
    record = await save_job(user_id, body.job_id, body.notes, status=status)
    return record


@router.delete("/{job_id}", summary="Remove a bookmarked job")
async def remove_saved_job(job_id: str, x_user_id: Optional[str] = Header(None)):
    user_id = _get_effective_user_id(x_user_id)
    deleted = await delete_saved_job(user_id, job_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Saved job '{job_id}' not found.")
    return {"success": True, "message": f"Job '{job_id}' removed from saved jobs."}


@router.patch("/{job_id}", summary="Update application status for a saved job")
async def update_status(
    job_id: str,
    body: UpdateStatusRequest,
    x_user_id: Optional[str] = Header(None),
):
    user_id = _get_effective_user_id(x_user_id)
    status_val = body.application_status or body.status or "interested"
    if status_val.lower() not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status '{status_val}'. Must be one of: {', '.join(sorted(VALID_STATUSES))}",
        )
    updated = await update_saved_job_status(user_id, job_id, status_val.lower())
    if not updated:
        raise HTTPException(status_code=404, detail=f"Saved job '{job_id}' not found.")
    return updated
