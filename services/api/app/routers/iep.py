"""IEP router - placeholder."""
from fastapi import APIRouter
router = APIRouter()

@router.get("/")
async def placeholder():
    return {"message": "IEP endpoints - to be implemented"}
