"""Behavior events router - placeholder."""
from fastapi import APIRouter
router = APIRouter()

@router.get("/")
async def placeholder():
    return {"message": "Behavior events endpoints - to be implemented"}
