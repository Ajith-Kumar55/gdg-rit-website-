from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MemberBase(BaseModel):
    name: str
    role: str
    category: str = "STUDENT"  # FACULTY, LEADERSHIP, STUDENT
    department: str = "Computer Science and Engineering"
    academic_year: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class MemberCreate(MemberBase):
    pass

class MemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    academic_year: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

class MemberResponse(MemberBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
