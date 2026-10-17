"""
Job service: search, filter, and retrieve jobs.
Uses Supabase when configured, falls back to in-memory SAMPLE_JOBS.
"""
import logging
from typing import Optional, List

from app.models.job import Job, JobListResponse, JobFilters
from app.data.sample_jobs import SAMPLE_JOBS, SAMPLE_JOBS_BY_ID
from app.services.database import _get_supabase_client

logger = logging.getLogger(__name__)


def _normalize_supabase_job(row: dict) -> Job:
    """Translate persisted column names into the public API model."""
    data = dict(row)
    data["role_category"] = data.get("role_category") or _infer_category(data.get("title", ""))
    data["category"] = data.get("category") or data["role_category"]
    data["education_requirement"] = data.get("education_requirement") or data.get("education_required") or "any"
    data["min_experience_years"] = data.get("min_experience_years") or 0
    data["max_experience_years"] = data.get("max_experience_years") or data.get("experience_years_max") or 2
    data["apply_url"] = data.get("apply_url") or data.get("application_url") or ""
    data["source"] = data.get("source") or data.get("provider") or "seed"
    data["posted_at"] = data.get("posted_at") or data.get("published_at")
    return Job(**data)


def _infer_category(title: str) -> str:
    text = title.lower()
    categories = (
        ("marketing", "Digital Marketing"), ("sales", "Sales"), ("business development", "Business Development"),
        ("recruit", "Human Resources"), ("hr ", "Human Resources"), ("analyst", "Business Analytics"),
        ("finance", "Finance & Accounting"), ("account", "Finance & Accounting"),
        ("operation", "Operations"), ("support", "Customer Support"), ("test", "Quality Assurance"),
        ("developer", "Software Engineering"), ("engineer", "Software Engineering"),
    )
    return next((category for word, category in categories if word in text), "Entry-level")


async def search_jobs(filters: JobFilters) -> JobListResponse:
    """
    Search and paginate jobs.

    Falls back to in-memory SAMPLE_JOBS when Supabase is unavailable.
    """
    client = _get_supabase_client()

    if client:
        try:
            return await _search_supabase(client, filters)
        except Exception as exc:
            logger.warning("Supabase job search failed, using in-memory: %s", exc)

    return _search_memory(filters)


async def get_job_by_id(job_id: str) -> Optional[Job]:
    """Retrieve a single job by ID."""
    client = _get_supabase_client()

    if client:
        try:
            resp = client.table("jobs").select("*").eq("id", job_id).execute()
            if resp.data:
                return _normalize_supabase_job(resp.data[0])
        except Exception as exc:
            logger.warning("Supabase get_job failed, using in-memory: %s", exc)

    return SAMPLE_JOBS_BY_ID.get(job_id)


async def get_jobs_by_ids(job_ids: List[str]) -> List[Job]:
    """Bulk-fetch jobs by a list of IDs."""
    results = []
    for jid in job_ids:
        job = await get_job_by_id(jid)
        if job:
            results.append(job)
    return results


# ---------------------------------------------------------------------------
# Supabase search
# ---------------------------------------------------------------------------

async def _search_supabase(client, filters: JobFilters) -> JobListResponse:
    query = client.table("jobs").select("*", count="exact").eq("is_active", True)

    search_query = filters.q or filters.search
    if search_query:
        query = query.or_(
            f"title.ilike.%{search_query}%,"
            f"description.ilike.%{search_query}%,"
            f"company.ilike.%{search_query}%"
        )
    if filters.location:
        query = query.ilike("location", f"%{filters.location}%")
    category = filters.role_category or filters.category
    if category:
        query = query.ilike("role_category", f"%{category}%")
    if filters.experience_level:
        query = query.eq("experience_level", filters.experience_level)
    if filters.work_arrangement:
        query = query.eq("work_arrangement", filters.work_arrangement)

    page_size = filters.limit or filters.page_size
    offset = (filters.page - 1) * page_size
    query = query.range(offset, offset + page_size - 1)

    resp = query.execute()
    jobs = [_normalize_supabase_job(r) for r in (resp.data or [])]
    total = resp.count or len(jobs)

    return JobListResponse(
        jobs=jobs,
        total=total,
        page=filters.page,
        page_size=page_size,
        has_more=(offset + len(jobs)) < total,
    )


# ---------------------------------------------------------------------------
# In-memory search
# ---------------------------------------------------------------------------

def _search_memory(filters: JobFilters) -> JobListResponse:
    jobs = list(SAMPLE_JOBS)

    search_query = filters.q or filters.search
    if search_query:
        q_lower = search_query.lower()
        jobs = [
            j for j in jobs
            if q_lower in j.title.lower()
            or q_lower in j.description.lower()
            or q_lower in j.company.lower()
            or any(q_lower in s.lower() for s in j.required_skills)
        ]
    if filters.location:
        loc = filters.location.lower()
        jobs = [j for j in jobs if loc in j.location.lower() or (j.city and loc in j.city.lower())]
    category = filters.role_category or filters.category
    if category:
        cat_lower = category.lower()
        jobs = [
            j for j in jobs
            if cat_lower in (j.role_category or "").lower()
            or cat_lower in (j.category or "").lower()
            or cat_lower in j.title.lower()
        ]
    if filters.experience_level:
        exp_lower = filters.experience_level.lower()
        jobs = [j for j in jobs if exp_lower in (j.experience_level or "").lower()]
    if filters.work_arrangement:
        wa_lower = filters.work_arrangement.lower()
        jobs = [j for j in jobs if wa_lower in (j.work_arrangement or "").lower()]
    if filters.employment_type:
        et_lower = filters.employment_type.lower()
        jobs = [j for j in jobs if et_lower in (j.employment_type or "").lower()]

    page_size = filters.limit or filters.page_size
    total = len(jobs)
    start = (filters.page - 1) * page_size
    end = start + page_size
    page_jobs = jobs[start:end]

    return JobListResponse(
        jobs=page_jobs,
        total=total,
        page=filters.page,
        page_size=page_size,
        has_more=end < total,
    )
