from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GalleryImageBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "COMMUNITY"
    event_id: Optional[int] = None
    image_url: str
    thumbnail_url: Optional[str] = None
    upload_date: Optional[str] = None

class GalleryImageCreate(GalleryImageBase):
    pass

class GalleryImageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    event_id: Optional[int] = None

class GalleryImageResponse(GalleryImageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
