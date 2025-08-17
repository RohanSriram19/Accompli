"""Lesson plans router for managing educational content and planning."""
from datetime import datetime, date
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select, col

from ..models.lesson_plan import LessonPlan, LessonPlanCreate, LessonPlanUpdate, LessonPlanRead
from ..models.student import Student
from ..core.auth import get_current_user
from ..database import get_session

router = APIRouter(prefix="/lesson-plans", tags=["lesson-plans"])

@router.get("/", response_model=List[LessonPlanRead])
async def list_lesson_plans(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    student_id: Optional[UUID] = Query(None, description="Filter by student ID"),
    subject: Optional[str] = Query(None, description="Filter by subject"),
    status: Optional[str] = Query(None, description="Filter by status"),
    from_date: Optional[date] = Query(None, description="Filter from this date"),
    to_date: Optional[date] = Query(None, description="Filter to this date"),
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
):
    """Retrieve lesson plans with filtering options."""
    query = select(LessonPlan)
    
    # Apply filters
    if student_id:
        query = query.where(LessonPlan.student_id == student_id)
    if subject:
        query = query.where(LessonPlan.subject == subject)
    if status:
        query = query.where(LessonPlan.status == status)
    if from_date:
        query = query.where(col(LessonPlan.date).cast(date) >= from_date)
    if to_date:
        query = query.where(col(LessonPlan.date).cast(date) <= to_date)
    
    # Add pagination and ordering
    query = query.order_by(LessonPlan.date.desc()).offset(offset).limit(limit)
    
    lesson_plans = session.exec(query).all()
    return lesson_plans

@router.post("/", response_model=LessonPlanRead)
async def create_lesson_plan(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    lesson_plan: LessonPlanCreate,
):
    """Create a new lesson plan."""
    # Verify student exists if student_id is provided
    if lesson_plan.student_id:
        student = session.get(Student, lesson_plan.student_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
    
    db_lesson_plan = LessonPlan.model_validate(lesson_plan)
    session.add(db_lesson_plan)
    session.commit()
    session.refresh(db_lesson_plan)
    return db_lesson_plan

@router.get("/templates", response_model=List[LessonPlanRead])
async def list_lesson_plan_templates(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    subject: Optional[str] = Query(None, description="Filter by subject"),
):
    """Retrieve lesson plan templates (those not assigned to specific students)."""
    query = select(LessonPlan).where(LessonPlan.student_id.is_(None))
    
    if subject:
        query = query.where(LessonPlan.subject == subject)
    
    templates = session.exec(query).all()
    return templates

@router.get("/{lesson_plan_id}", response_model=LessonPlanRead)
async def get_lesson_plan(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    lesson_plan_id: UUID,
):
    """Get a specific lesson plan by ID."""
    lesson_plan = session.get(LessonPlan, lesson_plan_id)
    if not lesson_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson plan not found"
        )
    return lesson_plan

@router.patch("/{lesson_plan_id}", response_model=LessonPlanRead)
async def update_lesson_plan(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    lesson_plan_id: UUID,
    lesson_plan_update: LessonPlanUpdate,
):
    """Update a lesson plan."""
    lesson_plan = session.get(LessonPlan, lesson_plan_id)
    if not lesson_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson plan not found"
        )
    
    lesson_plan_data = lesson_plan_update.model_dump(exclude_unset=True)
    for field, value in lesson_plan_data.items():
        setattr(lesson_plan, field, value)
    
    session.add(lesson_plan)
    session.commit()
    session.refresh(lesson_plan)
    return lesson_plan

@router.delete("/{lesson_plan_id}")
async def delete_lesson_plan(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    lesson_plan_id: UUID,
):
    """Delete a lesson plan."""
    lesson_plan = session.get(LessonPlan, lesson_plan_id)
    if not lesson_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson plan not found"
        )
    
    session.delete(lesson_plan)
    session.commit()
    return {"message": "Lesson plan deleted successfully"}
