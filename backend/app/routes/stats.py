from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.event import Event
from app.models.registration import EventRegistration
from app.models.member import Member
from app.models.gallery import GalleryImage
from app.models.certificate import Certificate
from app.models.membership import MembershipApplication
from app.models.contact import ContactMessage
from app.models.activity import Activity
from app.routes.deps import get_current_admin

router = APIRouter(prefix="/stats", tags=["Statistics & Overview"])

@router.get("/dashboard")
def get_dashboard_stats(
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_events = db.query(Event).count()
    upcoming_events = db.query(Event).filter(Event.registration_open == True).count()
    completed_events = db.query(Event).filter(Event.registration_open == False).count()
    total_registrations = db.query(EventRegistration).count()
    total_members = db.query(Member).count()
    gallery_images = db.query(GalleryImage).count()
    certificates = db.query(Certificate).count()
    membership_applications = db.query(MembershipApplication).count()
    pending_applications = db.query(MembershipApplication).filter(MembershipApplication.status == "PENDING").count()
    unread_messages = db.query(ContactMessage).filter(ContactMessage.is_read == False).count()

    recent_registrations = db.query(EventRegistration).order_by(EventRegistration.id.desc()).limit(5).all()
    recent_messages = db.query(ContactMessage).order_by(ContactMessage.id.desc()).limit(5).all()

    return {
        "total_events": total_events,
        "upcoming_events": upcoming_events,
        "completed_events": completed_events,
        "total_registrations": total_registrations,
        "total_members": total_members,
        "gallery_images": gallery_images,
        "certificates": certificates,
        "membership_applications": membership_applications,
        "pending_applications": pending_applications,
        "unread_messages": unread_messages,
        "recent_registrations": [
            {
                "id": r.id,
                "name": r.full_name,
                "code": r.registration_code,
                "email": r.email,
                "department": r.department,
                "date": r.created_at.strftime("%Y-%m-%d %H:%M")
            } for r in recent_registrations
        ],
        "recent_messages": [
            {
                "id": m.id,
                "name": m.name,
                "subject": m.subject,
                "is_read": m.is_read,
                "date": m.created_at.strftime("%Y-%m-%d %H:%M")
            } for m in recent_messages
        ]
    }

@router.get("/public")
def get_public_stats(db: Session = Depends(get_db)):
    events_count = db.query(Event).count()
    members_count = db.query(Member).count()
    activities_count = db.query(Activity).count()
    certs_count = db.query(Certificate).count()
    
    return {
        "community_members": max(members_count, 12),
        "events_count": max(events_count, 4),
        "events_conducted": max(events_count, 4),
        "activities_count": max(activities_count, 6),
        "certificates_verified": max(certs_count, 10),
        "technology_domains": 4
    }
