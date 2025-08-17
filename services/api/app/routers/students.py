"""Students router with CRUD operations."""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.database import get_session
from app.models.student import Student, StudentCreate, StudentUpdate, StudentRead
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[StudentRead])
async def list_students(
    session: Session = Depends(get_session),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    organization_id: Optional[int] = Query(None, description="Filter by organization"),
    active_only: bool = Query(True, description="Only return active students")
):
    """List all students with optional filtering."""
    query = select(Student)
    
    if organization_id:
        query = query.where(Student.organization_id == organization_id)
    
    if active_only:
        query = query.where(Student.is_active == True)
    
    query = query.offset(skip).limit(limit)
    students = session.exec(query).all()
    return students


@router.get("/{student_id}", response_model=StudentRead)
async def get_student(
    student_id: int,
    session: Session = Depends(get_session)
):
    """Get a specific student by ID."""
    student = session.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.post("/", response_model=StudentRead)
async def create_student(
    student: StudentCreate,
    session: Session = Depends(get_session)
):
    """Create a new student."""
    db_student = Student.model_validate(student)
    session.add(db_student)
    session.commit()
    session.refresh(db_student)
    return db_student


@router.put("/{student_id}", response_model=StudentRead)
async def update_student(
    student_id: int,
    student_update: StudentUpdate,
    session: Session = Depends(get_session)
):
    """Update an existing student."""
    db_student = session.get(Student, student_id)
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student_data = student_update.model_dump(exclude_unset=True)
    for key, value in student_data.items():
        setattr(db_student, key, value)
    
    session.add(db_student)
    session.commit()
    session.refresh(db_student)
    return db_student


@router.delete("/{student_id}")
async def delete_student(
    student_id: int,
    session: Session = Depends(get_session)
):
    """Delete a student (soft delete by setting is_active=False)."""
    db_student = session.get(Student, student_id)
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db_student.is_active = False
    session.add(db_student)
    session.commit()
    return {"message": "Student deactivated successfully"}


@router.get("/{student_id}/iep")
async def get_student_iep(
    student_id: int,
    session: Session = Depends(get_session)
):
    """Get the current IEP for a student."""
    # Import here to avoid circular imports
    from app.models.iep import IEP
    
    student = session.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get the most recent active IEP
    query = select(IEP).where(
        IEP.student_id == student_id,
        IEP.status == "active"
    ).order_by(IEP.created_at.desc())
    
    iep = session.exec(query).first()
    if not iep:
        raise HTTPException(status_code=404, detail="No active IEP found for student")
    
    return iep


@router.get("/{student_id}/behavior-events")
async def get_student_behavior_events(
    student_id: int,
    session: Session = Depends(get_session),
    limit: int = Query(50, ge=1, le=500)
):
    """Get recent behavior events for a student."""
    from app.models.behavior_event import BehaviorEvent
    
    student = session.get(Student, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    query = select(BehaviorEvent).where(
        BehaviorEvent.student_id == student_id
    ).order_by(BehaviorEvent.created_at.desc()).limit(limit)
    
    events = session.exec(query).all()
    return events
