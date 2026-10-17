"""
Pydantic schemas for resume analysis results.
"""
from typing import Optional, List
from pydantic import BaseModel, Field


class Education(BaseModel):
    degree: str = ""
    field: str = ""
    institution: str = ""
    year: str = ""
    percentage: str = ""


class Internship(BaseModel):
    title: str = ""
    company: str = ""
    duration: str = ""
    description: str = ""


class Project(BaseModel):
    name: str = ""
    description: str = ""
    technologies: List[str] = Field(default_factory=list)
    url: str = ""


class Certification(BaseModel):
    name: str = ""
    issuer: str = ""
    year: str = ""


class Suggestion(BaseModel):
    category: str = ""
    issue: str = ""
    recommendation: str = ""


class ResumeProfile(BaseModel):
    """Structured data extracted from the resume by the LLM."""
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    education: List[Education] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    work_experience: List[Internship] = Field(default_factory=list)
    internships: List[Internship] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    summary: str = ""
    missing_sections: List[str] = Field(default_factory=list)


class ResumeFeedback(BaseModel):
    """AI-generated feedback about the resume quality."""
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    suggestions: List[Suggestion] = Field(default_factory=list)
    overall_score: int = Field(default=0, ge=0, le=100)
    readability: str = "fair"  # good|fair|poor


class ResumeAnalysisResponse(BaseModel):
    """Full response returned by POST /resumes/analyze."""
    analysis_id: str
    session_id: Optional[str] = None
    structured_profile: ResumeProfile
    feedback: ResumeFeedback
    warnings: List[str] = Field(default_factory=list)
    word_count: int = 0


class ParseResult(BaseModel):
    """Internal result from the resume parser."""
    extracted_text: str
    word_count: int
    warnings: List[str] = Field(default_factory=list)
