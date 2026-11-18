from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.member import Member
from app.schemas.member import MemberCreate, MemberUpdate, MemberResponse
from app.routes.deps import get_current_admin
from app.utils.file_storage import save_uploaded_file

router = APIRouter(prefix="/members", tags=["Team Members"])

@router.get("/", response_model=List[MemberResponse])
def list_members(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Member).filter(Member.is_active == True)
    if category and category.upper() != "ALL":
        query = query.filter(Member.category == category.upper())
    return query.order_by(Member.sort_order.asc(), Member.id.asc()).all()

@router.get("/admin-all", response_model=List[MemberResponse])
def admin_list_members(
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Member).order_by(Member.sort_order.asc(), Member.id.asc()).all()

@router.post("/", response_model=MemberResponse)
def create_member(
    data: MemberCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_member = Member(**data.model_dump())
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

@router.put("/{member_id}", response_model=MemberResponse)
def update_member(
    member_id: int,
    data: MemberUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
        
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(member, key, value)
        
    db.commit()
    db.refresh(member)
    return member

@router.delete("/{member_id}")
def delete_member(
    member_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    member = db.query(Member).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    db.commit()
    return {"message": "Member removed successfully"}

@router.post("/upload-photo")
def upload_photo(
    file: UploadFile = File(...),
    current_admin = Depends(get_current_admin)
):
    url = save_uploaded_file(file, subfolder="team")
    return {"url": url}
