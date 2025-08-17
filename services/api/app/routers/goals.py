"""
IEP Goals router with CRUD operations.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.core.auth import get_current_active_user
from app.models.user import User
from app.models.iep import IEP, IEPGoal, IEPGoalCreate, IEPGoalUpdate, IEPGoalRead

router = APIRouter()


@router.get("/", response_model=List[IEPGoalRead])
async def list_goals(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user),
    student_id: Optional[int] = Query(None, description="Filter by student"),
    iep_id: Optional[int] = Query(None, description="Filter by IEP"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):
    """List IEP goals with optional filtering."""
    query = select(IEPGoal)
    
    if student_id:
        query = query.where(IEPGoal.student_id == student_id)
    
    if iep_id:
        query = query.where(IEPGoal.iep_id == iep_id)
    
    # Filter by organization for non-admin users
    if current_user.role != "ADMIN":
        query = query.join(IEP).where(IEP.organization_id == current_user.organization_id)
    
    query = query.offset(skip).limit(limit)
    goals = session.exec(query).all()
    return goals


@router.get("/{goal_id}", response_model=IEPGoalRead)
async def get_goal(
    goal_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific IEP goal."""
    goal = session.get(IEPGoal, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Check organization access
    if current_user.role != "ADMIN" and goal.iep.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return goal


@router.post("/", response_model=IEPGoalRead)
async def create_goal(
    goal: IEPGoalCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new IEP goal."""
    # Verify IEP exists and user has access
    iep = session.get(IEP, goal.iep_id)
    if not iep:
        raise HTTPException(status_code=404, detail="IEP not found")
    
    if current_user.role != "ADMIN" and iep.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    db_goal = IEPGoal.model_validate(goal)
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal


@router.put("/{goal_id}", response_model=IEPGoalRead)
async def update_goal(
    goal_id: int,
    goal_update: IEPGoalUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Update an IEP goal."""
    db_goal = session.get(IEPGoal, goal_id)
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Check organization access
    if current_user.role != "ADMIN" and db_goal.iep.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    goal_data = goal_update.model_dump(exclude_unset=True)
    for key, value in goal_data.items():
        setattr(db_goal, key, value)
    
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    return db_goal


@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Delete an IEP goal."""
    db_goal = session.get(IEPGoal, goal_id)
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Check organization access
    if current_user.role != "ADMIN" and db_goal.iep.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    session.delete(db_goal)
    session.commit()
    return {"message": "Goal deleted successfully"}


@router.post("/{goal_id}/progress")
async def update_goal_progress(
    goal_id: int,
    progress_data: dict,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_active_user)
):
    """Update progress on an IEP goal."""
    db_goal = session.get(IEPGoal, goal_id)
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Check organization access
    if current_user.role != "ADMIN" and db_goal.iep.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Update progress fields
    if "progress_percentage" in progress_data:
        db_goal.progress_percentage = progress_data["progress_percentage"]
    
    if "notes" in progress_data:
        db_goal.progress_notes = progress_data["notes"]
    
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)
    
    return {"message": "Progress updated successfully", "goal": db_goal}
