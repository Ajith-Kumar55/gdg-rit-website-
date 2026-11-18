import time
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.admin import Admin
from app.schemas.auth import LoginRequest, TokenResponse, ChangePasswordRequest, AdminResponse
from app.core.security import verify_password, hash_password, create_access_token
from app.routes.deps import get_current_admin

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Lightweight in-memory login rate limiter (max 10 failed attempts per 60s per IP)
_failed_attempts: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_WINDOW = 60
MAX_FAILED_ATTEMPTS = 10

def _check_rate_limit(client_ip: str):
    now = time.time()
    recent = [ts for ts in _failed_attempts[client_ip] if now - ts < RATE_LIMIT_WINDOW]
    _failed_attempts[client_ip] = recent
    if len(recent) >= MAX_FAILED_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 60 seconds before trying again."
        )

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, request: Request, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    _check_rate_limit(client_ip)

    identifier = login_data.identifier.lower()
    if not identifier or not login_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please enter both your admin username/email and password."
        )

    admin = db.query(Admin).filter(
        (func.lower(Admin.username) == identifier) | (func.lower(Admin.email) == identifier)
    ).first()

    if not admin or not verify_password(login_data.password, admin.hashed_password):
        _failed_attempts[client_ip].append(time.time())
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password. Please verify your admin credentials."
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This administrator account is currently disabled."
        )

    # Clear failed attempts on successful login
    _failed_attempts.pop(client_ip, None)

    token = create_access_token(data={"sub": admin.username, "id": admin.id, "role": admin.role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "admin": {
            "id": admin.id,
            "username": admin.username,
            "email": admin.email,
            "full_name": admin.full_name,
            "role": admin.role
        }
    }

@router.post("/logout")
def logout(current_admin: Admin = Depends(get_current_admin)):
    return {"message": f"Admin {current_admin.username} logged out successfully"}

@router.get("/me", response_model=AdminResponse)
def get_me(current_admin: Admin = Depends(get_current_admin)):
    return current_admin

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if not verify_password(data.current_password, current_admin.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters long.")

    current_admin.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
