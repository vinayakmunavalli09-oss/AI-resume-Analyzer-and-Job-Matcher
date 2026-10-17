"""
/api/v1/jobs — job listing and detail endpoints.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.models.job import JobListResponse, Job, JobFilters
from app.services.job_service import search_jobs, get_job_by_id

router = APIRouter(prefix="/api/v1/jobs", tags=["Jobs"])


@router.get("", response_model=JobListResponse, summary="List and search jobs")
async def list_jobs(
    q: Optional[str] = Query(None, description="Full-text search in title, company, description"),
    location: Optional[str] = Query(None, description="Filter by location (partial match)"),
    role_category: Optional[str] = Query(None, description="Filter by role category"),
    experience_level: Optional[str] = Query(None, description="fresher|junior|mid|senior"),
    work_arrangement: Optional[str] = Query(None, description="onsite|remote|hybrid"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Results per page"),
):
    """
    Returns a paginated list of jobs. All filters are optional and combinable.
    Falls back to in-memory data when Supabase is not configured.
    """
    filters = JobFilters(
        q=q,
        location=location,
        role_category=role_category,
        experience_level=experience_level,
        work_arrangement=work_arrangement,
        page=page,
        page_size=page_size,
    )
    return await search_jobs(filters)


@router.get("/{job_id}", response_model=Job, summary="Get a job by ID")
async def get_job(job_id: str):
    """Return full detail for a single job."""
    job = await get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found.")
    return job
