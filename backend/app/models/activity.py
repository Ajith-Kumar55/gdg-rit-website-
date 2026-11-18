from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database.session import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(100), default="WORKSHOP")  # WORKSHOPS, HACKATHONS, COMPETITIONS, GUEST_LECTURES, MEETUPS, SESSIONS
    description = Column(Text, nullable=False)
    date = Column(String(50), nullable=False)
    highlights = Column(Text, nullable=True)  # JSON or comma-separated list
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(100), default="COMPETITION")  # AWARDS, COMPETITIONS, PROJECTS, MILESTONES, RECOGNITIONS
    recipient_name = Column(String(150), nullable=True)
    date = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    proof_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
