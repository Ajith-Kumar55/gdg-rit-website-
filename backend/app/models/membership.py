from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database.session import Base

class MembershipApplication(Base):
    __tablename__ = "membership_applications"

    id = Column(Integer, primary_key=True, index=True)
    application_code = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), index=True, nullable=False)
    phone = Column(String(20), nullable=False)
    college = Column(String(150), default="Rajeev Institute of Technology, Hassan")
    department = Column(String(100), default="Computer Science & Engineering")
    year = Column(String(20), nullable=False)
    tech_interests = Column(String(250), nullable=False)  # Web Dev, AI/ML, Cloud, UI/UX
    reason_for_joining = Column(Text, nullable=False)
    status = Column(String(50), default="PENDING")  # PENDING, APPROVED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)
