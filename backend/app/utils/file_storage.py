import os
import uuid
from fastapi import UploadFile, HTTPException
from app.core.config import settings

# Disallow .svg to prevent Stored XSS via inline <script>
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_DOC_EXTENSIONS = {".pdf"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def _has_valid_magic_bytes(content: bytes, ext: str) -> bool:
    """Validate file header magic bytes to prevent renamed malicious binaries."""
    if len(content) < 4:
        return False
    if ext in {".jpg", ".jpeg"}:
        return content.startswith(b"\xff\xd8\xff")
    if ext == ".png":
        return content.startswith(b"\x89PNG\r\n\x1a\n")
    if ext == ".gif":
        return content.startswith(b"GIF87a") or content.startswith(b"GIF89a")
    if ext == ".webp":
        return len(content) >= 12 and content[:4] == b"RIFF" and content[8:12] == b"WEBP"
    if ext == ".pdf":
        return content.startswith(b"%PDF")
    return False

def save_uploaded_file(file: UploadFile, subfolder: str = "gallery", allow_pdf: bool = False) -> str:
    """Validate extension, magic bytes, and size, then save safely with a UUID filename."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    ext = os.path.splitext(file.filename)[1].lower()
    allowed = set(ALLOWED_IMAGE_EXTENSIONS)
    if allow_pdf:
        allowed.update(ALLOWED_DOC_EXTENSIONS)

    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"File extension '{ext}' is not allowed. Allowed: {', '.join(sorted(allowed))}"
        )

    # Read at most MAX_FILE_SIZE + 1 bytes to prevent memory exhaustion on huge uploads
    content = file.file.read(MAX_FILE_SIZE + 1)
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds maximum 10MB limit")

    if not _has_valid_magic_bytes(content, ext):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or corrupted file signature for '{ext}'. Upload a genuine image file."
        )

    # Prevent path traversal in subfolder
    safe_subfolder = os.path.basename(subfolder)
    target_dir = os.path.join(settings.UPLOAD_DIR, safe_subfolder)
    os.makedirs(target_dir, exist_ok=True)

    unique_filename = f"{uuid.uuid4().hex}{ext}"
    target_path = os.path.join(target_dir, unique_filename)

    with open(target_path, "wb") as f:
        f.write(content)

    return f"/uploads/{safe_subfolder}/{unique_filename}"
