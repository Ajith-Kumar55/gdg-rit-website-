import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.database.seed import seed_database
from app.routes import (
    auth,
    events,
    registrations,
    members,
    gallery,
    certificates,
    activities,
    membership,
    contact,
    stats,
    settings as settings_router
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Official API for Google Developer Groups on Campus – Rajeev Institute of Technology, Hassan"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files for Uploads
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(events.router, prefix=settings.API_V1_STR)
app.include_router(registrations.router, prefix=settings.API_V1_STR)
app.include_router(members.router, prefix=settings.API_V1_STR)
app.include_router(gallery.router, prefix=settings.API_V1_STR)
app.include_router(certificates.router, prefix=settings.API_V1_STR)
app.include_router(activities.router, prefix=settings.API_V1_STR)
app.include_router(membership.router, prefix=settings.API_V1_STR)
app.include_router(contact.router, prefix=settings.API_V1_STR)
app.include_router(stats.router, prefix=settings.API_V1_STR)
app.include_router(settings_router.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def on_startup():
    print("[*] Initializing Database and Seeding Authentic GDG RIT Data...")
    seed_database()
    print("[OK] GDG on Campus RIT Hassan API is ready!")

@app.get("/")
def root():
    return {
        "status": "online",
        "club": "GDG on Campus – RIT Hassan",
        "institution": "Rajeev Institute of Technology, Hassan",
        "tagline": "Learn. Build. Connect. Innovate.",
        "api_docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
