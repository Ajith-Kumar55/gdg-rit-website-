"""
Safe development-only administrator credential reset / sync utility.

Usage (from backend/ directory):
    python -m app.database.reset_admin

Updates or creates the primary administrator account using ADMIN_USERNAME,
ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_FULL_NAME from environment variables
(.env) WITHOUT modifying or deleting any other website records.

Refuses to run when ENVIRONMENT=production.
"""
import sys
from sqlalchemy import func
from app.core.config import settings
from app.core.security import hash_password
from app.database.session import Base, engine, SessionLocal
from app.models.admin import Admin


def reset_dev_admin() -> None:
    if settings.ENVIRONMENT == "production":
        print("[!] Refused: reset_admin.py is strictly disabled when ENVIRONMENT=production.")
        sys.exit(1)

    if not settings.ADMIN_USERNAME or not settings.ADMIN_EMAIL or not settings.ADMIN_PASSWORD:
        print("[!] Missing ADMIN_USERNAME, ADMIN_EMAIL, or ADMIN_PASSWORD environment configuration.")
        sys.exit(1)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(
            (func.lower(Admin.username) == settings.ADMIN_USERNAME.lower()) |
            (func.lower(Admin.email) == settings.ADMIN_EMAIL.lower())
        ).first()

        if not admin:
            # Update the first existing primary admin if one exists, preventing duplicates
            admin = db.query(Admin).order_by(Admin.id.asc()).first()

        if admin:
            admin.username = settings.ADMIN_USERNAME
            admin.email = settings.ADMIN_EMAIL
            admin.full_name = settings.ADMIN_FULL_NAME
            admin.hashed_password = hash_password(settings.ADMIN_PASSWORD)
            admin.is_active = True
            db.commit()
            print(f"[OK] Updated existing admin account (username='{admin.username}', email='{admin.email}'). Other website data preserved.")
        else:
            new_admin = Admin(
                username=settings.ADMIN_USERNAME,
                email=settings.ADMIN_EMAIL,
                full_name=settings.ADMIN_FULL_NAME,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                role="SUPER_ADMIN",
                is_active=True,
            )
            db.add(new_admin)
            db.commit()
            print(f"[OK] Created new admin account (username='{new_admin.username}', email='{new_admin.email}').")
    finally:
        db.close()


if __name__ == "__main__":
    reset_dev_admin()
