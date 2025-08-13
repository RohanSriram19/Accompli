"""Evidence router - placeholder."""
from fastapi import APIRouter
router = APIRouter()

@router.get("/")
async def placeholder():
    return {"message": "Evidence endpoints - to be implemented"}
