import json
import os
from typing import Annotated, Any
from dotenv import load_dotenv
from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode

_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_ROOT_DIR = os.path.dirname(_BACKEND_DIR)

# Load .env from backend/ first, then project root (without overriding already-set OS env vars)
load_dotenv(os.path.join(_BACKEND_DIR, ".env"), override=False)
load_dotenv(os.path.join(_ROOT_DIR, ".env"), override=False)

_DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://gdg-rit-website.vercel.app",
]

_ENV = os.getenv("ENVIRONMENT", "development").strip().lower()
_IS_DEV = _ENV != "production"

class Settings(BaseSettings):
    PROJECT_NAME: str = "GDG on Campus - RIT Hassan API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = _ENV

    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "gdg-rit-hassan-local-dev-secret-key-change-in-prod" if _IS_DEV else "",
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./gdg_rit.db")

    # Configurable Admin Seeding (no hardcoded default password in production)
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin" if _IS_DEV else "").strip()
    ADMIN_EMAIL: str = os.getenv(
        "ADMIN_EMAIL",
        "gdgoncampusgdgclubrit@gmail.com" if _IS_DEV else "",
    ).strip().lower()
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "Admin@GDGRIT2026!" if _IS_DEV else "")
    ADMIN_FULL_NAME: str = os.getenv("ADMIN_FULL_NAME", "GDG RIT Administrator").strip()
    RESET_ADMIN_ON_STARTUP: bool = os.getenv("RESET_ADMIN_ON_STARTUP", "false").strip().lower() == "true"

    # Base uploads folder
    BASE_DIR: str = _BACKEND_DIR
    UPLOAD_DIR: str = os.path.join(_BACKEND_DIR, "uploads")

    # Accepts comma-separated string OR JSON array from CORS_ORIGINS env var
    CORS_ORIGINS: Annotated[list[str], NoDecode] = _DEFAULT_CORS_ORIGINS

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> list[str]:
        if isinstance(v, list):
            return [str(o).strip() for o in v if str(o).strip()]
        if isinstance(v, str):
            raw = v.strip()
            if not raw:
                return list(_DEFAULT_CORS_ORIGINS)
            if raw.startswith("["):
                try:
                    parsed = json.loads(raw)
                    if isinstance(parsed, list):
                        return [str(o).strip() for o in parsed if str(o).strip()]
                except json.JSONDecodeError:
                    pass
            return [origin.strip() for origin in raw.split(",") if origin.strip()]
        return list(_DEFAULT_CORS_ORIGINS)

    class Config:
        case_sensitive = True

settings = Settings()

if settings.ENVIRONMENT == "production" and not settings.SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable must be set in production.")

# Ensure upload directories exist
for sub in ["posters", "gallery", "team", "certificates"]:
    os.makedirs(os.path.join(settings.UPLOAD_DIR, sub), exist_ok=True)
