"""
Database service: Supabase client wrapper with in-memory fallback.

When SUPABASE_URL / SUPABASE_SECRET_KEY are set, all operations use the real DB.
Otherwise, an in-memory store is used so the app works reliably for development and demos.
"""
import logging
import uuid
from typing import Any, Optional, List

from config import get_settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# In-memory stores (fallback when Supabase is not configured)
# ---------------------------------------------------------------------------
_ANALYSIS_STORE: dict[str, dict] = {}
_MATCH_STORE: dict[str, dict] = {}
_SAVED_JOBS_STORE: dict[str, list[dict]] = {}  # user_id -> list of saved job dicts
_PROFILE_STORE: dict[str, dict] = {}  # user_id -> profile dict


def _get_supabase_client():
    """Return a Supabase client or None if not configured."""
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_secret_key:
        return None
    try:
        from supabase import create_client
        client = create_client(settings.supabase_url, settings.supabase_secret_key)
        return client
    except Exception as exc:
        logger.error("Failed to create Supabase client: %s", exc)
        return None


# ---------------------------------------------------------------------------
# Analysis persistence & deletion
# ---------------------------------------------------------------------------

async def save_analysis(analysis_id: str, data: dict) -> None:
    """Persist a resume analysis result."""
    client = _get_supabase_client()
    if client:
        try:
            row = {"id": analysis_id, **data, "status": "completed"}
            row["ai_feedback"] = row.pop("feedback", row.get("ai_feedback", {}))
            client.table("resume_analyses").upsert(row).execute()
            return
        except Exception as exc:
            logger.warning("Supabase save_analysis failed, falling back to memory: %s", exc)
    _ANALYSIS_STORE[analysis_id] = data


async def get_analysis(analysis_id: str, session_id: Optional[str] = None) -> Optional[dict]:
    """Retrieve a resume analysis result by ID."""
    client = _get_supabase_client()
    if client:
        try:
            query = client.table("resume_analyses").select("*").eq("id", analysis_id)
            if session_id:
                query = query.eq("session_id", session_id)
            resp = query.execute()
            if resp.data:
                row = dict(resp.data[0])
                row["feedback"] = row.get("ai_feedback", row.get("feedback", {}))
                return row
        except Exception as exc:
            logger.warning("Supabase get_analysis failed, falling back to memory: %s", exc)
    row = _ANALYSIS_STORE.get(analysis_id)
    if row and session_id and row.get("session_id") != session_id:
        return None
    return row


async def delete_analysis(analysis_id: str) -> bool:
    """Delete an analysis and any associated match records (privacy compliance)."""
    client = _get_supabase_client()
    if client:
        try:
            client.table("job_matches").delete().eq("analysis_id", analysis_id).execute()
            client.table("resume_analyses").delete().eq("id", analysis_id).execute()
            return True
        except Exception as exc:
            logger.warning("Supabase delete_analysis failed: %s", exc)

    deleted = analysis_id in _ANALYSIS_STORE
    _ANALYSIS_STORE.pop(analysis_id, None)

    # Clean up associated matches
    to_remove = [mid for mid, m in _MATCH_STORE.items() if m.get("analysis_id") == analysis_id]
    for mid in to_remove:
        _MATCH_STORE.pop(mid, None)

    return deleted


# ---------------------------------------------------------------------------
# Match persistence
# ---------------------------------------------------------------------------

async def save_match(match_id: str, data: dict) -> None:
    """Persist a match result."""
    client = _get_supabase_client()
    if client:
        try:
            row = {**data, "id": match_id}
            row.pop("match_id", None)
            client.table("job_matches").upsert(row, on_conflict="analysis_id,job_id").execute()
            return
        except Exception as exc:
            logger.warning("Supabase save_match failed, falling back to memory: %s", exc)
    _MATCH_STORE[match_id] = data


async def get_match(match_id: str) -> Optional[dict]:
    """Retrieve a match result by ID."""
    client = _get_supabase_client()
    if client:
        try:
            resp = client.table("job_matches").select("*").eq("id", match_id).execute()
            if resp.data:
                row = dict(resp.data[0])
                row["match_id"] = row.get("id", match_id)
                return row
        except Exception as exc:
            logger.warning("Supabase get_match failed, falling back to memory: %s", exc)
    return _MATCH_STORE.get(match_id)


async def get_match_by_job_and_analysis(job_id: str, analysis_id: str) -> Optional[dict]:
    """Retrieve match for a specific job and analysis."""
    client = _get_supabase_client()
    if client:
        try:
            resp = (
                client.table("job_matches").select("*")
                .eq("job_id", job_id).eq("analysis_id", analysis_id).limit(1).execute()
            )
            if resp.data:
                row = dict(resp.data[0])
                row["match_id"] = row.get("id", "")
                return row
        except Exception as exc:
            logger.warning("Supabase get_match_by_job_and_analysis failed: %s", exc)
    for m in _MATCH_STORE.values():
        if m.get("job_id") == job_id and m.get("analysis_id") == analysis_id:
            return m
    return None


async def get_matches_by_analysis(analysis_id: str) -> List[dict]:
    """Retrieve all matches for an analysis."""
    return [m for m in _MATCH_STORE.values() if m.get("analysis_id") == analysis_id]


# ---------------------------------------------------------------------------
# Saved-jobs persistence
# ---------------------------------------------------------------------------

async def get_saved_jobs(user_id: str) -> list[dict]:
    from app.data.sample_jobs import SAMPLE_JOBS_BY_ID
    client = _get_supabase_client()
    records = []
    if client:
        try:
            resp = (
                client.table("saved_jobs")
                .select("*, jobs(*)")
                .eq("user_id", user_id)
                .execute()
            )
            records = resp.data or []
        except Exception as exc:
            logger.warning("Supabase get_saved_jobs failed: %s", exc)

    if not records:
        records = _SAVED_JOBS_STORE.get(user_id, [])

    # Enrich each record with job details if missing
    enriched = []
    for r in records:
        entry = dict(r)
        if "job" not in entry or not entry["job"]:
            job_obj = SAMPLE_JOBS_BY_ID.get(entry.get("job_id"))
            if job_obj:
                entry["job"] = job_obj.model_dump()
            else:
                entry["job"] = {"id": entry.get("job_id"), "title": "Job Posting", "company": "Company"}
        enriched.append(entry)
    return enriched


async def save_job(user_id: str, job_id: str, notes: str = "", status: str = "interested") -> dict:
    from app.data.sample_jobs import SAMPLE_JOBS_BY_ID
    record = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "job_id": job_id,
        "notes": notes,
        "application_status": status,
        "saved_at": "2026-10-16T12:00:00Z",
    }
    client = _get_supabase_client()
    if client:
        try:
            resp = client.table("saved_jobs").insert(record).execute()
            res = resp.data[0] if resp.data else record
            job_obj = SAMPLE_JOBS_BY_ID.get(job_id)
            if job_obj:
                res["job"] = job_obj.model_dump()
            return res
        except Exception as exc:
            logger.warning("Supabase save_job failed: %s", exc)

    job_obj = SAMPLE_JOBS_BY_ID.get(job_id)
    if job_obj:
        record["job"] = job_obj.model_dump()

    user_store = _SAVED_JOBS_STORE.setdefault(user_id, [])
    # Update if already exists, else append
    existing = next((j for j in user_store if j["job_id"] == job_id), None)
    if existing:
        existing["application_status"] = status
        existing["notes"] = notes or existing.get("notes", "")
        return existing
    user_store.append(record)
    return record


async def delete_saved_job(user_id: str, job_id: str) -> bool:
    client = _get_supabase_client()
    if client:
        try:
            client.table("saved_jobs").delete().eq("user_id", user_id).eq("job_id", job_id).execute()
            return True
        except Exception as exc:
            logger.warning("Supabase delete_saved_job failed: %s", exc)
    store = _SAVED_JOBS_STORE.get(user_id, [])
    original_len = len(store)
    _SAVED_JOBS_STORE[user_id] = [j for j in store if j["job_id"] != job_id]
    return len(_SAVED_JOBS_STORE[user_id]) < original_len


async def update_saved_job_status(user_id: str, job_id: str, status: str) -> Optional[dict]:
    client = _get_supabase_client()
    if client:
        try:
            resp = (
                client.table("saved_jobs")
                .update({"application_status": status})
                .eq("user_id", user_id)
                .eq("job_id", job_id)
                .execute()
            )
            return resp.data[0] if resp.data else None
        except Exception as exc:
            logger.warning("Supabase update_saved_job_status failed: %s", exc)
    store = _SAVED_JOBS_STORE.get(user_id, [])
    for entry in store:
        if entry["job_id"] == job_id:
            entry["application_status"] = status
            return entry
    return None


# ---------------------------------------------------------------------------
# User Profile persistence
# ---------------------------------------------------------------------------

async def get_user_profile(user_id: str) -> Optional[dict]:
    client = _get_supabase_client()
    if client:
        try:
            resp = client.table("profiles").select("*").eq("id", user_id).execute()
            if resp.data:
                return resp.data[0]
        except Exception as exc:
            logger.warning("Supabase get_user_profile failed: %s", exc)
    return _PROFILE_STORE.get(user_id)


async def save_user_profile(user_id: str, profile_data: dict) -> dict:
    data = {**profile_data, "id": user_id}
    client = _get_supabase_client()
    if client:
        try:
            resp = client.table("profiles").upsert(data).execute()
            return resp.data[0] if resp.data else data
        except Exception as exc:
            logger.warning("Supabase save_user_profile failed: %s", exc)
    _PROFILE_STORE[user_id] = data
    return data


# ---------------------------------------------------------------------------
# Health check helper
# ---------------------------------------------------------------------------

def is_supabase_configured() -> bool:
    settings = get_settings()
    return bool(settings.supabase_url and settings.supabase_secret_key)
