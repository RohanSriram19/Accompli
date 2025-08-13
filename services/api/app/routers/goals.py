"""Goals router - placeholder."""
from fastapi import APIRouter
router = APIRouter()

@router.get("/")
async def placeholder():
    return {"message": "Goals endpoints - to be implemented"}
