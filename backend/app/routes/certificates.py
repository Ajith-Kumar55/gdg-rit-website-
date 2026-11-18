from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.certificate import Certificate
from app.schemas.certificate import CertificateCreate, CertificateUpdate, CertificateResponse, CertificateVerifyResult
from app.routes.deps import get_current_admin

router = APIRouter(prefix="/certificates", tags=["Certificates"])

@router.get("/verify", response_model=CertificateVerifyResult)
def verify_certificate(
    q: str = Query(..., description="Certificate ID, Student Name, USN, or Event Name"),
    db: Session = Depends(get_db)
):
    cleaned = q.strip()
    if not cleaned:
        return CertificateVerifyResult(is_valid=False, certificate=None, message="Please enter a valid search query")

    # Search exact match for code or USN, or partial match for student name/event
    cert = db.query(Certificate).filter(
        (Certificate.certificate_code.ilike(cleaned)) |
        (Certificate.usn.ilike(cleaned)) |
        (Certificate.student_name.ilike(f"%{cleaned}%")) |
        (Certificate.event_name.ilike(f"%{cleaned}%"))
    ).first()

    if not cert:
        return CertificateVerifyResult(
            is_valid=False, 
            certificate=None, 
            message="No certificate found matching the provided details. Check the Certificate ID or Student Name."
        )

    if cert.status != "VERIFIED":
        return CertificateVerifyResult(
            is_valid=False,
            certificate=CertificateResponse.model_validate(cert),
            message=f"Certificate status is '{cert.status}'. This credential is not officially verified."
        )

    cert.verification_count += 1
    db.commit()
    db.refresh(cert)

    return CertificateVerifyResult(
        is_valid=True,
        certificate=CertificateResponse.model_validate(cert),
        message="Official certificate successfully verified and authenticated."
    )

@router.get("/", response_model=List[CertificateResponse])
def list_certificates(
    search: Optional[str] = None,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Certificate)
    if search:
        query = query.filter(
            (Certificate.certificate_code.ilike(f"%{search}%")) |
            (Certificate.student_name.ilike(f"%{search}%")) |
            (Certificate.usn.ilike(f"%{search}%")) |
            (Certificate.event_name.ilike(f"%{search}%"))
        )
    return query.order_by(Certificate.id.desc()).all()

@router.post("/", response_model=CertificateResponse)
def create_certificate(
    data: CertificateCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Certificate).filter(Certificate.certificate_code == data.certificate_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Certificate ID already exists")

    new_cert = Certificate(**data.model_dump())
    db.add(new_cert)
    db.commit()
    db.refresh(new_cert)
    return new_cert

@router.put("/{cert_id}", response_model=CertificateResponse)
def update_certificate(
    cert_id: int,
    data: CertificateUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
        
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(cert, key, value)
        
    db.commit()
    db.refresh(cert)
    return cert

@router.delete("/{cert_id}")
def delete_certificate(
    cert_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    cert = db.query(Certificate).filter(Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    db.delete(cert)
    db.commit()
    return {"message": "Certificate record deleted"}
