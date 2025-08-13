"""Lesson plans router - placeholder."""
from fastapi import APIRouter
router = APIRouter()

@router.get("/")
async def placeholder():
    return {"message": "Lesson plans endpoints - to be implemented"}
