"""Behavior events router for managing student behavior incidents and tracking."""
from datetime import datetime, date
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select, col

from ..models.behavior_event import BehaviorEvent, BehaviorEventCreate, BehaviorEventUpdate, BehaviorEventRead
from ..models.student import Student
from ..core.auth import get_current_user
from ..database import get_session

router = APIRouter(prefix="/behavior-events", tags=["behavior-events"])

@router.get("/", response_model=List[BehaviorEventRead])
async def list_behavior_events(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    student_id: Optional[UUID] = Query(None, description="Filter by student ID"),
    incident_type: Optional[str] = Query(None, description="Filter by incident type"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    from_date: Optional[date] = Query(None, description="Filter events from this date"),
    to_date: Optional[date] = Query(None, description="Filter events to this date"),
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
):
    """Retrieve behavior events with filtering options."""
    query = select(BehaviorEvent)
    
    # Apply filters
    if student_id:
        query = query.where(BehaviorEvent.student_id == student_id)
    if incident_type:
        query = query.where(BehaviorEvent.incident_type == incident_type)
    if severity:
        query = query.where(BehaviorEvent.severity == severity)
    if from_date:
        query = query.where(col(BehaviorEvent.date).cast(date) >= from_date)
    if to_date:
        query = query.where(col(BehaviorEvent.date).cast(date) <= to_date)
    
    # Add pagination
    query = query.offset(offset).limit(limit)
    
    behavior_events = session.exec(query).all()
    return behavior_events

@router.post("/", response_model=BehaviorEventRead)
async def create_behavior_event(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    behavior_event: BehaviorEventCreate,
):
    """Create a new behavior event."""
    # Verify student exists
    student = session.get(Student, behavior_event.student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    db_behavior_event = BehaviorEvent.model_validate(behavior_event)
    session.add(db_behavior_event)
    session.commit()
    session.refresh(db_behavior_event)
    return db_behavior_event

@router.get("/{behavior_event_id}", response_model=BehaviorEventRead)
async def get_behavior_event(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    behavior_event_id: UUID,
):
    """Get a specific behavior event by ID."""
    behavior_event = session.get(BehaviorEvent, behavior_event_id)
    if not behavior_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Behavior event not found"
        )
    return behavior_event

@router.patch("/{behavior_event_id}", response_model=BehaviorEventRead)
async def update_behavior_event(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    behavior_event_id: UUID,
    behavior_event_update: BehaviorEventUpdate,
):
    """Update a behavior event."""
    behavior_event = session.get(BehaviorEvent, behavior_event_id)
    if not behavior_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Behavior event not found"
        )
    
    behavior_event_data = behavior_event_update.model_dump(exclude_unset=True)
    for field, value in behavior_event_data.items():
        setattr(behavior_event, field, value)
    
    session.add(behavior_event)
    session.commit()
    session.refresh(behavior_event)
    return behavior_event

@router.delete("/{behavior_event_id}")
async def delete_behavior_event(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    behavior_event_id: UUID,
):
    """Delete a behavior event."""
    behavior_event = session.get(BehaviorEvent, behavior_event_id)
    if not behavior_event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Behavior event not found"
        )
    
    session.delete(behavior_event)
    session.commit()
    return {"message": "Behavior event deleted successfully"}
