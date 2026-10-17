"""
/api/v1/matches — job-resume matching endpoints.
Supports single match calculation, batch matching, and skill gap reporting.
"""
import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, Header
from pydantic import BaseModel

from app.models.match import MatchRequest, MatchListResponse, MatchResult, SkillGapReport
from app.models.resume import ResumeProfile
from app.services import matching_engine
from app.services.database import get_analysis, save_match, get_match, get_match_by_job_and_analysis
from app.services.job_service import search_jobs, get_jobs_by_ids, get_job_by_id
from app.models.job import JobFilters
from app.core.exceptions import AnalysisNotFoundError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/matches", tags=["Matches"])


class BatchMatchRequest(BaseModel):
    analysis_id: str
    job_ids: Optional[List[str]] = None


@router.post("", response_model=MatchListResponse, summary="Calculate match scores")
async def calculate_matches(body: MatchRequest, x_session_id: str = Header(..., min_length=32, max_length=160)):
    """
    Given an analysis_id and optional job_ids / filters:
    1. Loads the resume profile from storage.
    2. Fetches jobs (specific IDs or all with optional filters).
    3. Scores each job against the profile (deterministic algorithm).
    4. Returns top 20 matches sorted by score descending.
    """
    analysis_data = await get_analysis(body.analysis_id, x_session_id)
    if not analysis_data:
        raise AnalysisNotFoundError(body.analysis_id)

    profile = ResumeProfile(**analysis_data.get("structured_profile", {}))

    if body.job_ids:
        jobs = await get_jobs_by_ids(body.job_ids)
    else:
        filters_dict = body.filters or {}
        filters = JobFilters(
            q=filters_dict.get("q"),
            search=filters_dict.get("search"),
            location=filters_dict.get("location"),
            role_category=filters_dict.get("role_category") or filters_dict.get("category"),
            experience_level=filters_dict.get("experience_level"),
            work_arrangement=filters_dict.get("work_arrangement"),
            page=1,
            page_size=100,
        )
        job_list_resp = await search_jobs(filters)
        jobs = job_list_resp.jobs

    if not jobs:
        return MatchListResponse(matches=[], analysis_id=body.analysis_id, total=0)

    results = matching_engine.compute_matches(profile, jobs, body.analysis_id, max_results=len(jobs))

    for match in results:
        await save_match(match.match_id, match.model_dump())

    return MatchListResponse(
        matches=results[:20],
        analysis_id=body.analysis_id,
        total=len(results),
    )


@router.post("/batch", response_model=List[MatchResult], summary="Batch match specific job IDs")
async def calculate_matches_batch(body: BatchMatchRequest, x_session_id: str = Header(..., min_length=32, max_length=160)):
    """Calculate match results for a list of job IDs for a given analysis."""
    analysis_data = await get_analysis(body.analysis_id, x_session_id)
    if not analysis_data:
        raise AnalysisNotFoundError(body.analysis_id)

    profile = ResumeProfile(**analysis_data.get("structured_profile", {}))

    if body.job_ids:
        jobs = await get_jobs_by_ids(body.job_ids)
    else:
        job_list_resp = await search_jobs(JobFilters(page=1, page_size=20))
        jobs = job_list_resp.jobs

    results = matching_engine.compute_matches(profile, jobs, body.analysis_id, max_results=len(jobs))
    for match in results:
        await save_match(match.match_id, match.model_dump())

    return results


@router.get("/by-job/{job_id}", response_model=MatchResult, summary="Get or calculate match for a specific job")
async def get_match_for_job(job_id: str, analysis_id: str = Query(..., description="Active analysis ID"), x_session_id: str = Header(..., min_length=32, max_length=160)):
    """Retrieve existing match or compute on-the-fly for a specific job."""
    # Check if existing
    analysis_data = await get_analysis(analysis_id, x_session_id)
    if not analysis_data:
        raise AnalysisNotFoundError(analysis_id)
    existing = await get_match_by_job_and_analysis(job_id, analysis_id)
    if existing:
        return MatchResult(**existing)

    job = await get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found.")

    profile = ResumeProfile(**analysis_data.get("structured_profile", {}))
    match = matching_engine.compute_match(profile, job, analysis_id)
    await save_match(match.match_id, match.model_dump())
    return match


@router.get("/{match_id}", response_model=MatchResult, summary="Get match detail")
async def get_match_detail(match_id: str, x_session_id: str = Header(..., min_length=32, max_length=160)):
    """Return full detail for a previously computed match."""
    data = await get_match(match_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"Match '{match_id}' not found.")
    if not await get_analysis(data.get("analysis_id", ""), x_session_id):
        raise HTTPException(status_code=404, detail=f"Match '{match_id}' not found.")
    return MatchResult(**data)


@router.get("/{match_id}/skill-gaps", response_model=SkillGapReport, summary="Skill gap analysis")
async def skill_gap_analysis(match_id: str, x_session_id: str = Header(..., min_length=32, max_length=160)):
    """
    Return a structured skill gap report for a match.
    Distinguishes 'not_demonstrated' from 'missing' skills.
    """
    data = await get_match(match_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"Match '{match_id}' not found.")
    if not await get_analysis(data.get("analysis_id", ""), x_session_id):
        raise HTTPException(status_code=404, detail=f"Match '{match_id}' not found.")

    match = MatchResult(**data)
    job = await get_job_by_id(match.job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job '{match.job_id}' not found.")

    return matching_engine.build_skill_gap_report(match, job)
