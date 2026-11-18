from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.activity import Activity, Achievement
from app.schemas.activity import (
    ActivityCreate, ActivityUpdate, ActivityResponse,
    AchievementCreate, AchievementResponse
)
from app.routes.deps import get_current_admin

router = APIRouter(prefix="/activities", tags=["Activities & Achievements"])

# Activities
@router.get("/", response_model=List[ActivityResponse])
def list_activities(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Activity)
    if category and category.upper() != "ALL":
        query = query.filter(Activity.category == category.upper())
    return query.order_by(Activity.id.desc()).all()

@router.post("/", response_model=ActivityResponse)
def create_activity(
    data: ActivityCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_act = Activity(**data.model_dump())
    db.add(new_act)
    db.commit()
    db.refresh(new_act)
    return new_act

@router.put("/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: int,
    data: ActivityUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    act = db.query(Activity).filter(Activity.id == activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(act, key, value)
    db.commit()
    db.refresh(act)
    return act

@router.delete("/{activity_id}")
def delete_activity(
    activity_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    act = db.query(Activity).filter(Activity.id == activity_id).first()
    if not act:
        raise HTTPException(status_code=404, detail="Activity not found")
    db.delete(act)
    db.commit()
    return {"message": "Activity deleted successfully"}

# Achievements
@router.get("/achievements", response_model=List[AchievementResponse])
def list_achievements(db: Session = Depends(get_db)):
    return db.query(Achievement).order_by(Achievement.id.desc()).all()

@router.post("/achievements", response_model=AchievementResponse)
def create_achievement(
    data: AchievementCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_ach = Achievement(**data.model_dump())
    db.add(new_ach)
    db.commit()
    db.refresh(new_ach)
    return new_ach

@router.delete("/achievements/{achievement_id}")
def delete_achievement(
    achievement_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    ach = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    if not ach:
        raise HTTPException(status_code=404, detail="Achievement not found")
    db.delete(ach)
    db.commit()
    return {"message": "Achievement deleted successfully"}
