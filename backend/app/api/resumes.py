"""
/api/v1/resumes — resume upload, analysis retrieval, correction, and privacy deletion.
Rate limited to 10 requests per hour per IP for upload.
"""
import logging
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException, Header

from app.core.security import limiter
from app.models.resume import ResumeAnalysisResponse, ResumeProfile
from app.services.resume_analyzer import analyze_resume, _generate_feedback
from app.services.database import save_analysis, get_analysis, delete_analysis

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/resumes", tags=["Resumes"])


@router.post(
    "/analyze",
    response_model=ResumeAnalysisResponse,
    summary="Upload and analyse a resume (PDF or DOCX)",
)
@limiter.limit("10/hour")
async def analyze_resume_endpoint(
    request: Request,
    file: UploadFile = File(..., description="Resume file (PDF or DOCX, max 5 MB)"),
    session_id: str = Form(..., min_length=32, max_length=160, description="Private guest session capability"),
    x_session_id: str = Header(..., min_length=32, max_length=160),
):
    """
    1. Validates and parses the uploaded resume file.
    2. Calls NVIDIA NIM (or truthful deterministic fallback) to extract structured profile data.
    3. Generates transparent feedback and scoring.
    4. Persists the result and returns it.
    """
    if not x_session_id or x_session_id != session_id:
        raise HTTPException(status_code=403, detail="A matching private session is required.")
    result = await analyze_resume(file=file, session_id=session_id)

    # Persist for later retrieval
    await save_analysis(
        result.analysis_id,
        {
            "id": result.analysis_id,
            "structured_profile": result.structured_profile.model_dump(),
            "feedback": result.feedback.model_dump(),
            "session_id": session_id,
            "word_count": result.word_count,
            "warnings": result.warnings,
        },
    )

    logger.info(
        "Analysis %s completed: score=%d, words=%d",
        result.analysis_id,
        result.feedback.overall_score,
        result.word_count,
    )
    return result


@router.get(
    "/{analysis_id}",
    response_model=ResumeAnalysisResponse,
    summary="Retrieve an existing resume analysis",
)
async def get_analysis_endpoint(analysis_id: str, x_session_id: str = Header(..., min_length=32, max_length=160)):
    """Retrieve previously parsed resume analysis by analysis_id."""
    data = await get_analysis(analysis_id, x_session_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"Resume analysis '{analysis_id}' not found.")

    profile_data = data.get("structured_profile", {})
    feedback_data = data.get("feedback", {})

    return ResumeAnalysisResponse(
        analysis_id=analysis_id,
        session_id=data.get("session_id"),
        structured_profile=ResumeProfile(**profile_data),
        feedback=feedback_data,
        warnings=data.get("warnings", []),
        word_count=data.get("word_count", 0),
    )


@router.put(
    "/{analysis_id}",
    response_model=ResumeAnalysisResponse,
    summary="Correct and update extracted profile details",
)
async def update_analysis_endpoint(analysis_id: str, updated_profile: ResumeProfile, x_session_id: str = Header(..., min_length=32, max_length=160)):
    """
    Candidate review and correction: allows candidates to adjust extracted skills,
    education, or projects and updates the stored profile.
    """
    data = await get_analysis(analysis_id, x_session_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"Resume analysis '{analysis_id}' not found.")

    # Re-evaluate feedback against updated profile
    new_warnings = data.get("warnings", [])
    new_feedback = await _generate_feedback(updated_profile, new_warnings)

    updated_data = {
        **data,
        "structured_profile": updated_profile.model_dump(),
        "feedback": new_feedback.model_dump(),
    }
    await save_analysis(analysis_id, updated_data)

    return ResumeAnalysisResponse(
        analysis_id=analysis_id,
        session_id=data.get("session_id"),
        structured_profile=updated_profile,
        feedback=new_feedback,
        warnings=new_warnings,
        word_count=data.get("word_count", 0),
    )


@router.delete(
    "/{analysis_id}",
    summary="Delete resume data and associated matches (Privacy compliance)",
)
async def delete_analysis_endpoint(analysis_id: str, x_session_id: str = Header(..., min_length=32, max_length=160)):
    """Permanently delete candidate's resume analysis and associated match records."""
    owned = await get_analysis(analysis_id, x_session_id)
    success = await delete_analysis(analysis_id) if owned else False
    if not success:
        raise HTTPException(status_code=404, detail=f"Resume analysis '{analysis_id}' not found.")
    return {"success": True, "message": f"Resume analysis '{analysis_id}' and associated data removed."}
