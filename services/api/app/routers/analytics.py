"""Analytics router - placeholder."""
from fastapi import APIRouter
router = APIRouter()

@router.get("/")
async def placeholder():
    return {"message": "Analytics endpoints - to be implemented"}
