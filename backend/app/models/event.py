from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database.session import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    category = Column(String(100), default="TECHNICAL")  # CLUB INAUGURATION, TECHNICAL, WORKSHOP, HACKATHON
    description = Column(Text, nullable=False)
    event_date = Column(String(50), nullable=False)  # "2026-11-18" or "18 November 2026"
    event_time = Column(String(50), default="09:00 AM - 05:00 PM")
    venue = Column(String(200), default="ME Block, Seminar Hall, RIT Hassan")
    registration_deadline = Column(String(50), nullable=True)
    max_participants = Column(Integer, default=100)
    current_participants = Column(Integer, default=0)
    
    # Rich fields
    agenda = Column(Text, nullable=True)         # JSON or markdown text
    speakers = Column(Text, nullable=True)       # JSON or newline-separated
    coordinators = Column(Text, nullable=True)   # JSON or newline-separated
    eligibility = Column(String(200), default="Open to all engineering students")
    rules = Column(Text, nullable=True)
    faqs = Column(Text, nullable=True)           # JSON structure
    poster_url = Column(String(500), nullable=True)
    
    is_published = Column(Boolean, default=True)
    registration_open = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    registrations = relationship("EventRegistration", back_populates="event", cascade="all, delete-orphan")
    gallery_images = relationship("GalleryImage", back_populates="event")
    certificates = relationship("Certificate", back_populates="event")
