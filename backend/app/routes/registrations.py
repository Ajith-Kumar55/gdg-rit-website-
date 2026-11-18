import csv
import io
import secrets
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.event import Event
from app.models.registration import EventRegistration
from app.schemas.registration import RegistrationCreate, RegistrationStatusUpdate, RegistrationResponse
from app.routes.deps import get_current_admin

router = APIRouter(prefix="/registrations", tags=["Registrations"])

@router.post("/", response_model=RegistrationResponse)
def register_for_event(
    reg_data: RegistrationCreate,
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == reg_data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Selected event does not exist")
    
    if not event.registration_open:
        raise HTTPException(status_code=400, detail="Registrations for this event are closed")

    if event.registration_deadline:
        from datetime import date
        try:
            deadline_str = str(event.registration_deadline).strip()[:10]
            deadline_dt = date.fromisoformat(deadline_str)
            if date.today() > deadline_dt:
                raise HTTPException(status_code=400, detail="Registration deadline for this event has passed")
        except ValueError:
            pass

    if event.max_participants > 0 and event.current_participants >= event.max_participants:
        raise HTTPException(status_code=400, detail="Event registration capacity has been reached")
    
    # Duplicate prevention: Check if email already registered for this event
    existing_email = db.query(EventRegistration).filter(
        EventRegistration.event_id == reg_data.event_id,
        EventRegistration.email == reg_data.email
    ).first()
    if existing_email:
        raise HTTPException(
            status_code=400, 
            detail=f"This email ({reg_data.email}) is already registered for this event. Unique ID: {existing_email.registration_code}"
        )
        
    if reg_data.usn:
        existing_usn = db.query(EventRegistration).filter(
            EventRegistration.event_id == reg_data.event_id,
            EventRegistration.usn == reg_data.usn
        ).first()
        if existing_usn:
            raise HTTPException(
                status_code=400,
                detail=f"USN {reg_data.usn} is already registered for this event."
            )
            
    code_suffix = secrets.token_hex(3).upper()
    registration_code = f"GDG-RIT-EVT{event.id:02d}-{code_suffix}"
    
    new_reg = EventRegistration(
        registration_code=registration_code,
        event_id=reg_data.event_id,
        full_name=reg_data.full_name,
        email=reg_data.email,
        phone=reg_data.phone,
        college=reg_data.college or "Rajeev Institute of Technology, Hassan",
        department=reg_data.department or "Computer Science & Engineering",
        usn=reg_data.usn,
        year=reg_data.year,
        semester=reg_data.semester,
        is_team=reg_data.is_team,
        team_name=reg_data.team_name,
        team_members=reg_data.team_members,
        status="CONFIRMED"
    )
    
    event.current_participants += 1
    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)
    
    response_data = RegistrationResponse.model_validate(new_reg)
    response_data.event_title = event.title
    return response_data

@router.get("/", response_model=List[RegistrationResponse])
def list_registrations(
    event_id: Optional[int] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(EventRegistration)
    if event_id:
        query = query.filter(EventRegistration.event_id == event_id)
    if department:
        query = query.filter(EventRegistration.department.ilike(f"%{department}%"))
    if search:
        query = query.filter(
            (EventRegistration.full_name.ilike(f"%{search}%")) |
            (EventRegistration.email.ilike(f"%{search}%")) |
            (EventRegistration.usn.ilike(f"%{search}%")) |
            (EventRegistration.registration_code.ilike(f"%{search}%"))
        )
    
    results = query.order_by(EventRegistration.id.desc()).all()
    # attach event title
    out = []
    for r in results:
        item = RegistrationResponse.model_validate(r)
        if r.event:
            item.event_title = r.event.title
        out.append(item)
    return out

@router.get("/export-csv")
def export_csv(
    event_id: Optional[int] = None,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(EventRegistration)
    if event_id:
        query = query.filter(EventRegistration.event_id == event_id)
        
    regs = query.order_by(EventRegistration.id.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Reg Code", "Event Title", "Full Name", "Email", "Phone", 
        "College", "Department", "USN", "Year", "Semester", 
        "Is Team", "Team Name", "Status", "Registered At"
    ])
    
    for r in regs:
        writer.writerow([
            r.registration_code,
            r.event.title if r.event else "",
            r.full_name,
            r.email,
            r.phone,
            r.college,
            r.department,
            r.usn or "",
            r.year,
            r.semester or "",
            "Yes" if r.is_team else "No",
            r.team_name or "",
            r.status,
            r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else ""
        ])
        
    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=event_registrations.csv"}
    )

@router.put("/{reg_id}/status")
def update_status(
    reg_id: int,
    data: RegistrationStatusUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    reg = db.query(EventRegistration).filter(EventRegistration.id == reg_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    reg.status = data.status
    db.commit()
    return {"message": "Status updated successfully", "status": reg.status}

@router.delete("/{reg_id}")
def delete_registration(
    reg_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    reg = db.query(EventRegistration).filter(EventRegistration.id == reg_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    if reg.event and reg.event.current_participants > 0:
        reg.event.current_participants -= 1
        
    db.delete(reg)
    db.commit()
    return {"message": "Registration deleted successfully"}
