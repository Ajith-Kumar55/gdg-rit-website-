from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityBase(BaseModel):
    title: str
    category: str = "WORKSHOP"
    description: str
    date: str
    highlights: Optional[str] = None
    image_url: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    highlights: Optional[str] = None
    image_url: Optional[str] = None

class ActivityResponse(ActivityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AchievementBase(BaseModel):
    title: str
    category: str = "COMPETITION"
    recipient_name: Optional[str] = None
    date: str
    description: str
    proof_url: Optional[str] = None

class AchievementCreate(AchievementBase):
    pass

class AchievementResponse(AchievementBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
