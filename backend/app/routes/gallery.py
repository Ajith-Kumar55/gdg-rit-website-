from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.gallery import GalleryImage
from app.schemas.gallery import GalleryImageCreate, GalleryImageUpdate, GalleryImageResponse
from app.routes.deps import get_current_admin
from app.utils.file_storage import save_uploaded_file

router = APIRouter(prefix="/gallery", tags=["Gallery"])

@router.get("/", response_model=List[GalleryImageResponse])
def list_gallery(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(GalleryImage)
    if category and category.upper() != "ALL":
        query = query.filter(GalleryImage.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (GalleryImage.title.ilike(f"%{search}%")) |
            (GalleryImage.description.ilike(f"%{search}%"))
        )
    return query.order_by(GalleryImage.id.desc()).all()

@router.post("/upload")
def upload_gallery_image(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    category: str = Form("COMMUNITY"),
    event_id: Optional[int] = Form(None),
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    image_url = save_uploaded_file(file, subfolder="gallery")
    
    new_image = GalleryImage(
        title=title,
        description=description,
        category=category,
        event_id=event_id,
        image_url=image_url
    )
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    return new_image

@router.post("/", response_model=GalleryImageResponse)
def create_gallery_record(
    data: GalleryImageCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    new_image = GalleryImage(**data.model_dump())
    db.add(new_image)
    db.commit()
    db.refresh(new_image)
    return new_image

@router.put("/{image_id}", response_model=GalleryImageResponse)
def update_gallery_image(
    image_id: int,
    data: GalleryImageUpdate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    image = db.query(GalleryImage).filter(GalleryImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
        
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(image, key, value)
        
    db.commit()
    db.refresh(image)
    return image

@router.delete("/{image_id}")
def delete_gallery_image(
    image_id: int,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    image = db.query(GalleryImage).filter(GalleryImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(image)
    db.commit()
    return {"message": "Image deleted successfully"}
