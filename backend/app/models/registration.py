from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id = Column(Integer, primary_key=True, index=True)
    registration_code = Column(String(50), unique=True, index=True, nullable=False)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), index=True, nullable=False)
    phone = Column(String(20), nullable=False)
    college = Column(String(150), default="Rajeev Institute of Technology, Hassan")
    department = Column(String(100), default="Computer Science & Engineering")
    usn = Column(String(50), nullable=True)
    year = Column(String(20), nullable=False)      # 1st Year, 2nd Year, 3rd Year, 4th Year
    semester = Column(String(20), nullable=True)  # 1st to 8th Semester
    
    is_team = Column(Boolean, default=False)
    team_name = Column(String(100), nullable=True)
    team_members = Column(Text, nullable=True)     # JSON string of members
    
    status = Column(String(50), default="CONFIRMED")  # CONFIRMED, PENDING, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    event = relationship("Event", back_populates="registrations")
