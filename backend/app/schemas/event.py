from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    title: str
    slug: Optional[str] = None
    category: str = "TECHNICAL"
    description: str
    event_date: str
    event_time: str = "09:00 AM - 05:00 PM"
    venue: str = "ME Block, Seminar Hall, RIT Hassan"
    registration_deadline: Optional[str] = None
    max_participants: int = 100
    agenda: Optional[str] = None
    speakers: Optional[str] = None
    coordinators: Optional[str] = None
    eligibility: Optional[str] = "Open to all engineering students"
    rules: Optional[str] = None
    faqs: Optional[str] = None
    poster_url: Optional[str] = None
    is_published: bool = True
    registration_open: bool = True

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[str] = None
    event_time: Optional[str] = None
    venue: Optional[str] = None
    registration_deadline: Optional[str] = None
    max_participants: Optional[int] = None
    agenda: Optional[str] = None
    speakers: Optional[str] = None
    coordinators: Optional[str] = None
    eligibility: Optional[str] = None
    rules: Optional[str] = None
    faqs: Optional[str] = None
    poster_url: Optional[str] = None
    is_published: Optional[bool] = None
    registration_open: Optional[bool] = None

class EventResponse(EventBase):
    id: int
    slug: str
    current_participants: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
