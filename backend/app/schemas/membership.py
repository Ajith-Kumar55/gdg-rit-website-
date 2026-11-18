from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class MembershipApplicationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    college: Optional[str] = "Rajeev Institute of Technology, Hassan"
    department: Optional[str] = "Computer Science & Engineering"
    year: str
    tech_interests: str
    reason_for_joining: str

class MembershipApplicationStatusUpdate(BaseModel):
    status: str  # PENDING, APPROVED, REJECTED

class MembershipApplicationResponse(BaseModel):
    id: int
    application_code: str
    full_name: str
    email: str
    phone: str
    college: str
    department: str
    year: str
    tech_interests: str
    reason_for_joining: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
