from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import ContactMessageCreate, ContactMessageResponse
from app.routes.deps import get_current_admin

router = APIRouter(prefix="/contact", tags=["Contact Messages"])

@router.post("/", response_model=ContactMessageResponse)
def submit_contact_message(
    data: ContactMessageCreate,
    db: Session = Depends(get_db)
):
    new_msg = ContactMessage(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message,
        is_read=False
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg

@router.get("/", response_model=List[ContactMessageResponse])
def list_messages(
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(ContactMessage).order_by(ContactMessage.id.desc()).all()

@router.put("/{msg_id}/read")
def mark_message_as_read(
    msg_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    return {"message": "Message marked as read"}

@router.delete("/{msg_id}")
def delete_message(
    msg_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"message": "Message deleted successfully"}
