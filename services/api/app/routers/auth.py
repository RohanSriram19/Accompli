"""
Authentication router.
"""
from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()


@router.post("/login")
async def login() -> Dict[str, Any]:
    """Login endpoint - placeholder."""
    return {"message": "Login endpoint - to be implemented"}


@router.get("/me")
async def get_current_user() -> Dict[str, Any]:
    """Get current user - placeholder."""
    return {"message": "Get current user - to be implemented"}
