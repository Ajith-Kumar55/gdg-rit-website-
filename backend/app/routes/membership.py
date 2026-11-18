import secrets
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.membership import MembershipApplication
from app.schemas.membership import (
    MembershipApplicationCreate,
    MembershipApplicationStatusUpdate,
    MembershipApplicationResponse
)
from app.routes.deps import get_current_admin

router = APIRouter(prefix="/membership", tags=["Membership Applications"])

@router.post("/", response_model=MembershipApplicationResponse)
def apply_for_membership(
    data: MembershipApplicationCreate,
    db: Session = Depends(get_db)
):
    code = f"GDG-MEM-{secrets.token_hex(3).upper()}"
    new_app = MembershipApplication(
        application_code=code,
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        college=data.college or "Rajeev Institute of Technology, Hassan",
        department=data.department or "Computer Science & Engineering",
        year=data.year,
        tech_interests=data.tech_interests,
        reason_for_joining=data.reason_for_joining,
        status="PENDING"
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@router.get("/", response_model=List[MembershipApplicationResponse])
def list_applications(
    status: Optional[str] = None,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(MembershipApplication)
    if status and status.upper() != "ALL":
        query = query.filter(MembershipApplication.status == status.upper())
    return query.order_by(MembershipApplication.id.desc()).all()

@router.put("/{app_id}/status")
def update_application_status(
    app_id: int,
    data: MembershipApplicationStatusUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    app = db.query(MembershipApplication).filter(MembershipApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = data.status
    db.commit()
    return {"message": "Status updated successfully", "status": app.status}

@router.delete("/{app_id}")
def delete_application(
    app_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    app = db.query(MembershipApplication).filter(MembershipApplication.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()
    return {"message": "Application deleted successfully"}
