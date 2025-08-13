"""
FastAPI main application for Accompli API service.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.core.logging import setup_logging
from app.routers import (
    auth,
    students,
    iep,
    goals,
    behavior_events,
    lesson_plans,
    evidence,
    reports,
    analytics,
)

# Setup logging
setup_logging()

app = FastAPI(
    title="Accompli API",
    description="Special education platform API for IEP management and behavior tracking",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
)

# Security middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["auth"])
app.include_router(students.router, prefix=f"{settings.API_V1_PREFIX}/students", tags=["students"])
app.include_router(iep.router, prefix=f"{settings.API_V1_PREFIX}/iep", tags=["iep"])
app.include_router(goals.router, prefix=f"{settings.API_V1_PREFIX}/goals", tags=["goals"])
app.include_router(behavior_events.router, prefix=f"{settings.API_V1_PREFIX}/behavior-events", tags=["behavior"])
app.include_router(lesson_plans.router, prefix=f"{settings.API_V1_PREFIX}/lesson-plans", tags=["lessons"])
app.include_router(evidence.router, prefix=f"{settings.API_V1_PREFIX}/evidence", tags=["evidence"])
app.include_router(reports.router, prefix=f"{settings.API_V1_PREFIX}/reports", tags=["reports"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_PREFIX}/analytics", tags=["analytics"])


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "accompli-api"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Accompli API",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health",
    }
