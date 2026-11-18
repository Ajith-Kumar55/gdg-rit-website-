from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CertificateBase(BaseModel):
    certificate_code: str
    student_name: str
    usn: Optional[str] = None
    event_id: Optional[int] = None
    event_name: str
    issue_date: str
    status: str = "VERIFIED"
    pdf_url: Optional[str] = None

class CertificateCreate(CertificateBase):
    pass

class CertificateUpdate(BaseModel):
    student_name: Optional[str] = None
    usn: Optional[str] = None
    event_name: Optional[str] = None
    issue_date: Optional[str] = None
    status: Optional[str] = None
    pdf_url: Optional[str] = None

class CertificateResponse(CertificateBase):
    id: int
    verification_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class CertificateVerifyResult(BaseModel):
    is_valid: bool
    certificate: Optional[CertificateResponse] = None
    message: str
