import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate, EventResponse
from app.routes.deps import get_current_admin
from app.core.security import decode_access_token
from app.utils.file_storage import save_uploaded_file

router = APIRouter(prefix="/events", tags=["Events"])

def create_slug(title: str) -> str:
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title).lower()
    return re.sub(r'[\s-]+', '-', slug).strip('-')

@router.get("/", response_model=List[EventResponse])
def list_events(
    request: Request,
    category: Optional[str] = None,
    all_events: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Event)
    include_drafts = False
    if all_events:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer ") and decode_access_token(auth_header[7:]):
            include_drafts = True
    if not include_drafts:
        query = query.filter(Event.is_published == True)
    if category:
        query = query.filter(Event.category == category)
    return query.order_by(Event.id.desc()).all()

@router.get("/{id_or_slug}", response_model=EventResponse)
def get_event(id_or_slug: str, db: Session = Depends(get_db)):
    if id_or_slug.isdigit():
        event = db.query(Event).filter(Event.id == int(id_or_slug)).first()
    else:
        event = db.query(Event).filter(Event.slug == id_or_slug).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("/", response_model=EventResponse)
def create_event(
    event_data: EventCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    base_slug = event_data.slug or create_slug(event_data.title)
    slug = base_slug
    counter = 1
    while db.query(Event).filter(Event.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    event_dict = event_data.model_dump()
    event_dict["slug"] = slug
    
    new_event = Event(**event_dict)
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event_data: EventUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_data.model_dump(exclude_unset=True)
    if "title" in update_data and update_data["title"] and not event_data.model_dump().get("slug"):
        # optionally refresh slug
        pass

    for key, value in update_data.items():
        setattr(event, key, value)
        
    db.commit()
    db.refresh(event)
    return event

@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}

@router.post("/upload-poster")
def upload_poster(
    file: UploadFile = File(...),
    current_admin = Depends(get_current_admin)
):
    url = save_uploaded_file(file, subfolder="posters")
    return {"url": url}
