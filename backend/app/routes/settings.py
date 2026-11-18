from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.settings import Announcement, WebsiteSetting
from app.schemas.settings import (
    AnnouncementCreate, AnnouncementResponse,
    WebsiteSettingUpdate, WebsiteSettingResponse
)
from app.routes.deps import get_current_admin

router = APIRouter(prefix="/settings", tags=["Website Settings & Announcements"])

# Announcements
@router.get("/announcements", response_model=List[AnnouncementResponse])
def get_public_announcements(db: Session = Depends(get_db)):
    return db.query(Announcement).filter(Announcement.is_active == True).order_by(Announcement.id.desc()).all()

@router.get("/announcements/admin", response_model=List[AnnouncementResponse])
def get_all_announcements(
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Announcement).order_by(Announcement.id.desc()).all()

@router.post("/announcements", response_model=AnnouncementResponse)
def create_announcement(
    data: AnnouncementCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_ann = Announcement(**data.model_dump())
    db.add(new_ann)
    db.commit()
    db.refresh(new_ann)
    return new_ann

@router.put("/announcements/{ann_id}", response_model=AnnouncementResponse)
def toggle_announcement(
    ann_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    ann = db.query(Announcement).filter(Announcement.id == ann_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")
    ann.is_active = not ann.is_active
    db.commit()
    db.refresh(ann)
    return ann

@router.delete("/announcements/{ann_id}")
def delete_announcement(
    ann_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    ann = db.query(Announcement).filter(Announcement.id == ann_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="Announcement not found")
    db.delete(ann)
    db.commit()
    return {"message": "Announcement deleted successfully"}

# Content Settings
@router.get("/content", response_model=Dict[str, str])
def get_all_settings(db: Session = Depends(get_db)):
    settings_list = db.query(WebsiteSetting).all()
    return {s.key: s.value for s in settings_list}

@router.post("/content/{key}")
def set_setting_value(
    key: str,
    data: WebsiteSettingUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    setting = db.query(WebsiteSetting).filter(WebsiteSetting.key == key).first()
    if setting:
        setting.value = data.value
        if data.description:
            setting.description = data.description
    else:
        setting = WebsiteSetting(key=key, value=data.value, description=data.description)
        db.add(setting)
    db.commit()
    return {"message": f"Setting '{key}' updated successfully", "key": key, "value": setting.value}
