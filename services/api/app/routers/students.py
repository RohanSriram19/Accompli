"""Students router - placeholder."""
from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/")
async def list_students() -> Dict[str, Any]:
    return {"message": "List students - to be implemented"}

@router.get("/{student_id}")
async def get_student(student_id: str) -> Dict[str, Any]:
    return {"message": f"Get student {student_id} - to be implemented"}
