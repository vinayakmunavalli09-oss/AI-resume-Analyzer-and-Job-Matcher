"""
Pydantic schemas for job-resume matching.
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class SkillGapItem(BaseModel):
    skill: str
    status: str  # "not_demonstrated" | "missing" | "matched"
    category: str = ""
    recommendation: str = ""


class SkillGapReport(BaseModel):
    matched_skills: List[str] = Field(default_factory=list)
    missing_required: List[SkillGapItem] = Field(default_factory=list)
    missing_preferred: List[SkillGapItem] = Field(default_factory=list)
    total_required: int = 0
    total_matched: int = 0
    coverage_percent: float = 0.0


class MatchResult(BaseModel):
    """Full match result for one resume vs one job."""
    match_id: str
    analysis_id: str
    job_id: str
    overall_score: float = Field(ge=0.0, le=100.0)
    skills_score: float = Field(ge=0.0, le=100.0)
    education_score: float = Field(ge=0.0, le=100.0)
    projects_score: float = Field(ge=0.0, le=100.0)
    role_relevance_score: float = Field(ge=0.0, le=100.0)
    experience_score: float = Field(ge=0.0, le=100.0)
    matched_skills: List[str] = Field(default_factory=list)
    missing_required_skills: List[str] = Field(default_factory=list)
    missing_preferred_skills: List[str] = Field(default_factory=list)
    has_mandatory_failure: bool = False
    explanation: str = ""
    score_breakdown: Dict[str, Any] = Field(default_factory=dict)
    scoring_version: str = "v1"


class MatchRequest(BaseModel):
    analysis_id: str
    job_ids: Optional[List[str]] = None
    filters: Optional[Dict[str, Any]] = None


class MatchListResponse(BaseModel):
    matches: List[MatchResult]
    analysis_id: str
    total: int
