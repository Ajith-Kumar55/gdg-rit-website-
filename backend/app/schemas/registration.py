from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class RegistrationCreate(BaseModel):
    event_id: int
    full_name: str
    email: EmailStr
    phone: str
    college: Optional[str] = "Rajeev Institute of Technology, Hassan"
    department: Optional[str] = "Computer Science & Engineering"
    usn: Optional[str] = None
    year: str
    semester: Optional[str] = None
    is_team: bool = False
    team_name: Optional[str] = None
    team_members: Optional[str] = None

class RegistrationStatusUpdate(BaseModel):
    status: str  # CONFIRMED, PENDING, REJECTED

class RegistrationResponse(BaseModel):
    id: int
    registration_code: str
    event_id: int
    event_title: Optional[str] = None
    full_name: str
    email: str
    phone: str
    college: str
    department: str
    usn: Optional[str] = None
    year: str
    semester: Optional[str] = None
    is_team: bool
    team_name: Optional[str] = None
    team_members: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
