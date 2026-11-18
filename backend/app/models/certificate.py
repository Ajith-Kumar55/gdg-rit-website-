from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_code = Column(String(50), unique=True, index=True, nullable=False)
    student_name = Column(String(100), index=True, nullable=False)
    usn = Column(String(50), index=True, nullable=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="SET NULL"), nullable=True)
    event_name = Column(String(150), nullable=False)
    issue_date = Column(String(50), nullable=False)
    status = Column(String(50), default="VERIFIED")  # VERIFIED, REVOKED
    pdf_url = Column(String(500), nullable=True)
    verification_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    event = relationship("Event", back_populates="certificates")
