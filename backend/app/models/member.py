from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.database.session import Base

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(150), nullable=False)          # e.g. "Student Lead Coordinator.", "HEAD OF THE DEPARTMENT-CSE"
    category = Column(String(50), default="STUDENT")     # "FACULTY", "LEADERSHIP", "STUDENT"
    department = Column(String(100), default="Computer Science and Engineering")
    academic_year = Column(String(50), nullable=True)
    bio = Column(Text, nullable=True)
    photo_url = Column(String(500), nullable=True)
    email = Column(String(100), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
