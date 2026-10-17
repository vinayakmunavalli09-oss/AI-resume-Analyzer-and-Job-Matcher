"""
Pydantic schemas for Job data.
"""
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class JobBase(BaseModel):
    title: str
    company: str
    location: str
    description: str
    role_category: str = ""          # e.g. "Software Engineering"
    experience_level: str = "fresher"  # fresher|junior|mid|senior
    work_arrangement: str = "onsite"   # onsite|remote|hybrid
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    min_experience_years: int = 0
    max_experience_years: int = 2
    education_requirement: str = "any"  # any|bachelor|master|phd|mba
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "INR"
    posted_at: Optional[datetime] = None
    apply_url: str = ""
    source: str = "internal"        # internal|seed
    is_demo: bool = True
    source_label: str = "Demo Data"
    employment_type: str = "full-time"
    city: Optional[str] = None
    state: Optional[str] = None
    category: Optional[str] = None


class Job(JobBase):
    id: str

    model_config = {"from_attributes": True}


class JobListResponse(BaseModel):
    jobs: List[Job]
    total: int
    page: int
    page_size: int
    has_more: bool


class JobFilters(BaseModel):
    q: Optional[str] = None
    search: Optional[str] = None
    location: Optional[str] = None
    role_category: Optional[str] = None
    category: Optional[str] = None
    experience_level: Optional[str] = None
    work_arrangement: Optional[str] = None
    employment_type: Optional[str] = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    limit: Optional[int] = None
