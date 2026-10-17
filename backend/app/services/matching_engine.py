"""
Deterministic job-resume matching engine (scoring version v1).

Scoring weights:
  - Skills:        35%
  - Education:     25%
  - Projects:      20%
  - Role relevance:10%
  - Experience:    10%
"""
import uuid
import logging
from typing import List, Optional

from app.models.resume import ResumeProfile
from app.models.job import Job
from app.models.match import MatchResult, SkillGapReport, SkillGapItem

logger = logging.getLogger(__name__)

SCORING_VERSION = "v1"

# Component weights (must sum to 1.0)
WEIGHTS = {
    "skills": 0.35,
    "education": 0.25,
    "projects": 0.20,
    "role": 0.10,
    "experience": 0.10,
}

# Education hierarchy for comparison
_EDU_HIERARCHY = {
    "phd": 6,
    "doctorate": 6,
    "mba": 5,
    "master": 4,
    "masters": 4,
    "postgraduate": 4,
    "bachelor": 3,
    "bachelors": 3,
    "b.tech": 3,
    "be": 3,
    "bsc": 3,
    "bca": 3,
    "bcom": 3,
    "bba": 3,
    "diploma": 2,
    "associate": 2,
    "high school": 1,
}


def compute_match(
    profile: ResumeProfile,
    job: Job,
    analysis_id: str,
) -> MatchResult:
    """
    Compute a deterministic match score for one resume vs one job.

    Returns a MatchResult with component scores and skill breakdowns.
    """
    # Normalise candidate skills to lowercase for comparison
    candidate_skills_lower = [s.lower() for s in profile.skills]

    # ── Skills Score (35%) ───────────────────────────────────────────────────
    skills_score, matched_skills, missing_required, missing_preferred = _score_skills(
        candidate_skills_lower,
        profile.skills,
        job.required_skills,
        job.preferred_skills,
    )

    # ── Education Score (25%) ────────────────────────────────────────────────
    education_score = _score_education(profile, job.education_requirement)

    # ── Projects Score (20%) ─────────────────────────────────────────────────
    projects_score = _score_projects(profile, job.required_skills)

    # ── Role Relevance Score (10%) ───────────────────────────────────────────
    role_score = _score_role_relevance(profile, job)

    # ── Experience Score (10%) ───────────────────────────────────────────────
    experience_score = _score_experience(profile, job)

    # ── Weighted Final Score ─────────────────────────────────────────────────
    overall = (
        skills_score * WEIGHTS["skills"]
        + education_score * WEIGHTS["education"]
        + projects_score * WEIGHTS["projects"]
        + role_score * WEIGHTS["role"]
        + experience_score * WEIGHTS["experience"]
    )
    overall = round(overall, 1)

    score_breakdown = {
        "skills": {"score": round(skills_score, 1), "weight": WEIGHTS["skills"]},
        "education": {"score": round(education_score, 1), "weight": WEIGHTS["education"]},
        "projects": {"score": round(projects_score, 1), "weight": WEIGHTS["projects"]},
        "role_relevance": {"score": round(role_score, 1), "weight": WEIGHTS["role"]},
        "experience": {"score": round(experience_score, 1), "weight": WEIGHTS["experience"]},
    }

    # Mandatory failure: 0 matched required skills → flag (but still score)
    has_mandatory_failure = bool(job.required_skills) and len(matched_skills) == 0

    explanation = _build_explanation(
        overall,
        matched_skills,
        missing_required,
        education_score,
        experience_score,
        has_mandatory_failure,
    )

    return MatchResult(
        match_id=str(uuid.uuid4()),
        analysis_id=analysis_id,
        job_id=job.id,
        overall_score=overall,
        skills_score=round(skills_score, 1),
        education_score=round(education_score, 1),
        projects_score=round(projects_score, 1),
        role_relevance_score=round(role_score, 1),
        experience_score=round(experience_score, 1),
        matched_skills=matched_skills,
        missing_required_skills=missing_required,
        missing_preferred_skills=missing_preferred,
        has_mandatory_failure=has_mandatory_failure,
        explanation=explanation,
        score_breakdown=score_breakdown,
        scoring_version=SCORING_VERSION,
    )


def compute_matches(
    profile: ResumeProfile,
    jobs: List[Job],
    analysis_id: str,
    max_results: int = 20,
) -> List[MatchResult]:
    """Score all provided jobs and return top `max_results` sorted by overall_score desc."""
    results = [compute_match(profile, job, analysis_id) for job in jobs]
    results.sort(key=lambda r: r.overall_score, reverse=True)
    return results[:max_results]


def build_skill_gap_report(match: MatchResult, job: Job) -> SkillGapReport:
    """
    Build a detailed report using 'not_demonstrated' for requirements absent from
    the extracted profile. This is not proof that the candidate lacks a skill.
    """
    missing_required_items: List[SkillGapItem] = []
    for skill in match.missing_required_skills:
        missing_required_items.append(
            SkillGapItem(
                skill=skill,
                status="not_demonstrated",
                category="required",
                recommendation=f"If you have this skill, add truthful evidence such as a project or coursework example. Otherwise, consider a practical learning project.",
            )
        )

    missing_preferred_items: List[SkillGapItem] = []
    for skill in match.missing_preferred_skills:
        missing_preferred_items.append(
            SkillGapItem(
                skill=skill,
                status="not_demonstrated",
                category="preferred",
                recommendation=f"This preferred skill is not demonstrated in the resume. Consider a small project or course if it fits your goals.",
            )
        )

    total_required = len(job.required_skills)
    total_matched = len(match.matched_skills)
    coverage = (total_matched / max(1, total_required)) * 100

    return SkillGapReport(
        matched_skills=match.matched_skills,
        missing_required=missing_required_items,
        missing_preferred=missing_preferred_items,
        total_required=total_required,
        total_matched=total_matched,
        coverage_percent=round(coverage, 1),
    )


# ---------------------------------------------------------------------------
# Component scorers
# ---------------------------------------------------------------------------

def _score_skills(
    candidate_lower: List[str],
    candidate_original: List[str],
    required: List[str],
    preferred: List[str],
) -> tuple[float, List[str], List[str], List[str]]:
    """
    Returns (score, matched_required, missing_required, missing_preferred).
    Score = (matched_required / total_required) * 100.
    Partial / substring matching is used.
    """
    if not required:
        return 100.0, [], [], _find_missing(candidate_lower, preferred)

    matched: List[str] = []
    missing_req: List[str] = []

    for req_skill in required:
        req_lower = req_skill.lower()
        if _skill_match(req_lower, candidate_lower):
            # Find original-cased version
            orig = next(
                (s for s in candidate_original if req_lower in s.lower() or s.lower() in req_lower),
                req_skill,
            )
            matched.append(orig)
        else:
            missing_req.append(req_skill)

    score = (len(matched) / len(required)) * 100
    missing_pref = _find_missing(candidate_lower, preferred)
    return score, matched, missing_req, missing_pref


def _skill_match(req_lower: str, candidate_lower: List[str]) -> bool:
    """
    Case-insensitive, partial-match check.
    'react' matches 'reactjs', 'react.js', 'react native'.
    """
    for cand in candidate_lower:
        if req_lower == cand:
            return True
        if req_lower in cand or cand in req_lower:
            return True
    return False


def _find_missing(candidate_lower: List[str], skills: List[str]) -> List[str]:
    return [s for s in skills if not _skill_match(s.lower(), candidate_lower)]


def _score_education(profile: ResumeProfile, requirement: str) -> float:
    """
    Score education against the job requirement.
    Returns 0-100.
    """
    req = (requirement or "any").lower().strip()
    if req in ("any", "", "none"):
        return 100.0

    # Determine highest candidate education level
    candidate_level = 0
    for edu in profile.education:
        degree_text = (edu.degree + " " + edu.field).lower()
        for key, level in _EDU_HIERARCHY.items():
            if key in degree_text:
                candidate_level = max(candidate_level, level)

    req_level = 0
    for key, level in _EDU_HIERARCHY.items():
        if key in req:
            req_level = max(req_level, level)

    if req_level == 0:
        return 100.0  # Unknown requirement → assume match

    if candidate_level == 0:
        # Missing education evidence is unknown. Keep the score neutral and
        # require the candidate to confirm eligibility in the detailed report.
        return 50.0

    if candidate_level >= req_level:
        return 100.0
    elif candidate_level == req_level - 1:
        return 50.0
    else:
        return 0.0


def _score_projects(profile: ResumeProfile, required_skills: List[str]) -> float:
    """
    Score how well projects demonstrate required skills.
    Returns 0-100.
    """
    if not required_skills or not profile.projects:
        return 0.0 if required_skills else 100.0

    req_lower = [s.lower() for s in required_skills]
    matching_tech: set[str] = set()

    for project in profile.projects:
        for tech in project.technologies:
            tech_lower = tech.lower()
            for req in req_lower:
                if req in tech_lower or tech_lower in req:
                    matching_tech.add(req)
                    break

    score = min(100.0, (len(matching_tech) / max(1, len(required_skills))) * 150)
    return score


def _score_role_relevance(profile: ResumeProfile, job: Job) -> float:
    """
    Keyword overlap between job title/description and candidate's internship titles.
    Returns 0-100 (capped).
    """
    # Build job keyword set from title
    job_keywords = set((job.title + " " + job.role_category).lower().split())
    # Remove very common words
    stop = {"the", "and", "or", "for", "in", "of", "a", "an", "to", "with", "at", "is"}
    job_keywords -= stop

    # Candidate role keywords from internship titles + project names
    candidate_text = " ".join(
        [i.title for i in profile.internships]
        + [p.name for p in profile.projects]
        + profile.achievements
    ).lower()
    candidate_words = set(candidate_text.split())

    overlap = len(job_keywords & candidate_words)
    score = min(100.0, overlap * 25)
    return score


def _score_experience(profile: ResumeProfile, job: Job) -> float:
    """
    Experience scoring for fresher-oriented jobs.
    Returns 0-100.
    """
    has_internships = len(profile.internships) > 0 or len(profile.work_experience) > 0
    min_exp = job.min_experience_years or 0
    max_exp = job.max_experience_years or 0

    # Fresher/entry-level
    if min_exp == 0 and max_exp == 0:
        return 100.0
    if min_exp == 0 and max_exp <= 2:
        return 90.0 if has_internships else 80.0
    if min_exp <= 2 and has_internships:
        return 90.0
    if min_exp <= 2 and not has_internships:
        return 60.0
    # Requires significant experience
    return 30.0


def _build_explanation(
    score: float,
    matched: List[str],
    missing: List[str],
    edu_score: float,
    exp_score: float,
    mandatory_fail: bool,
) -> str:
    parts = [f"Overall match: {score}%."]
    if matched:
        parts.append(f"Matched skills: {', '.join(matched[:5])}" + (" and more." if len(matched) > 5 else "."))
    if missing:
        parts.append(f"Missing required skills: {', '.join(missing[:5])}" + (" and more." if len(missing) > 5 else "."))
    if edu_score < 100:
        parts.append("Education level may not fully meet job requirements.")
    if mandatory_fail:
        parts.append("⚠ No required skills matched — consider upskilling before applying.")
    return " ".join(parts)
