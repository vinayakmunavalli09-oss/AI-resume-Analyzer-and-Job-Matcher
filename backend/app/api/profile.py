"""
/api/v1/profile — candidate profile and career preferences endpoints.
"""
from typing import Optional, List
from fastapi import APIRouter, Header
from pydantic import BaseModel, Field

from app.services.database import get_user_profile, save_user_profile

router = APIRouter(prefix="/api/v1/profile", tags=["Profile"])


class UserProfileModel(BaseModel):
    id: Optional[str] = "local_candidate"
    name: Optional[str] = ""
    email: Optional[str] = ""
    location: Optional[str] = ""
    experience_level: Optional[str] = "fresher"
    target_roles: List[str] = Field(default_factory=list)
    preferred_locations: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    graduation_year: Optional[int] = None
    preferred_work_arrangement: List[str] = Field(default_factory=list)


def _get_user_id(x_user_id: Optional[str] = None) -> str:
    return x_user_id.strip() if x_user_id and x_user_id.strip() else "local_candidate"


@router.get("", response_model=UserProfileModel, summary="Get candidate profile")
async def get_profile(x_user_id: Optional[str] = Header(None)):
    user_id = _get_user_id(x_user_id)
    data = await get_user_profile(user_id)
    if not data:
        # Default fresh profile
        return UserProfileModel(
            id=user_id,
            name="",
            email="",
            location="Bengaluru, Karnataka",
            experience_level="fresher",
            target_roles=["Business Analyst", "Junior Developer"],
            preferred_locations=["Bengaluru", "Pune", "Remote"],
            skills=[],
            preferred_work_arrangement=["hybrid", "remote"],
        )
    return UserProfileModel(**data)


@router.put("", response_model=UserProfileModel, summary="Update candidate profile")
async def update_profile(body: UserProfileModel, x_user_id: Optional[str] = Header(None)):
    user_id = _get_user_id(x_user_id)
    saved = await save_user_profile(user_id, body.model_dump())
    return UserProfileModel(**saved)
