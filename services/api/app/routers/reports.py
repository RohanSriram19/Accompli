"""Reports router for generating student progress and analytics reports."""
from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select, func, and_, text

from ..models.student import Student
from ..models.iep import IEP, IEPGoal
from ..models.behavior_event import BehaviorEvent
from ..models.lesson_plan import LessonPlan
from ..core.auth import get_current_user
from ..database import get_session

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/student/{student_id}/progress")
async def get_student_progress_report(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    student_id: UUID,
    from_date: Optional[date] = Query(None, description="Start date for report"),
    to_date: Optional[date] = Query(None, description="End date for report"),
):
    """Generate a comprehensive progress report for a student."""
    # Verify student exists
    student = session.get(Student, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Set default date range if not provided
    if not to_date:
        to_date = date.today()
    if not from_date:
        from_date = to_date - timedelta(days=30)
    
    # Get IEP goals progress
    goals_query = select(IEPGoal).join(IEP).where(IEP.student_id == student_id)
    goals = session.exec(goals_query).all()
    
    # Get behavior events
    behavior_query = select(BehaviorEvent).where(
        and_(
            BehaviorEvent.student_id == student_id,
            func.date(BehaviorEvent.date) >= from_date,
            func.date(BehaviorEvent.date) <= to_date
        )
    )
    behavior_events = session.exec(behavior_query).all()
    
    # Get lesson plans
    lesson_query = select(LessonPlan).where(
        and_(
            LessonPlan.student_id == student_id,
            func.date(LessonPlan.date) >= from_date,
            func.date(LessonPlan.date) <= to_date
        )
    )
    lesson_plans = session.exec(lesson_query).all()
    
    # Calculate behavior trends
    behavior_by_type = {}
    for event in behavior_events:
        if event.incident_type not in behavior_by_type:
            behavior_by_type[event.incident_type] = 0
        behavior_by_type[event.incident_type] += 1
    
    # Calculate goal progress summary
    goal_progress = {
        "total_goals": len(goals),
        "goals_met": len([g for g in goals if g.progress >= 100]),
        "goals_in_progress": len([g for g in goals if 0 < g.progress < 100]),
        "goals_not_started": len([g for g in goals if g.progress == 0]),
        "average_progress": sum(g.progress for g in goals) / len(goals) if goals else 0
    }
    
    return {
        "student": student,
        "report_period": {
            "from_date": from_date,
            "to_date": to_date
        },
        "goal_progress": goal_progress,
        "goals": goals,
        "behavior_summary": {
            "total_incidents": len(behavior_events),
            "incidents_by_type": behavior_by_type
        },
        "behavior_events": behavior_events,
        "lesson_plans": {
            "total": len(lesson_plans),
            "completed": len([lp for lp in lesson_plans if lp.status == "completed"]),
            "in_progress": len([lp for lp in lesson_plans if lp.status == "in_progress"]),
            "planned": len([lp for lp in lesson_plans if lp.status == "planned"])
        }
    }

@router.get("/behavior/trends")
async def get_behavior_trends(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    student_id: Optional[UUID] = Query(None, description="Filter by student"),
    from_date: Optional[date] = Query(None, description="Start date"),
    to_date: Optional[date] = Query(None, description="End date"),
):
    """Get behavior trends analysis across students or for a specific student."""
    # Set default date range
    if not to_date:
        to_date = date.today()
    if not from_date:
        from_date = to_date - timedelta(days=90)
    
    query = select(BehaviorEvent).where(
        and_(
            func.date(BehaviorEvent.date) >= from_date,
            func.date(BehaviorEvent.date) <= to_date
        )
    )
    
    if student_id:
        query = query.where(BehaviorEvent.student_id == student_id)
    
    behavior_events = session.exec(query).all()
    
    # Analyze trends
    trends_by_week = {}
    for event in behavior_events:
        # Group by week
        week_start = event.date.date() - timedelta(days=event.date.weekday())
        week_key = week_start.isoformat()
        
        if week_key not in trends_by_week:
            trends_by_week[week_key] = {
                "total": 0,
                "by_type": {},
                "by_severity": {}
            }
        
        trends_by_week[week_key]["total"] += 1
        
        # By type
        if event.incident_type not in trends_by_week[week_key]["by_type"]:
            trends_by_week[week_key]["by_type"][event.incident_type] = 0
        trends_by_week[week_key]["by_type"][event.incident_type] += 1
        
        # By severity
        if event.severity not in trends_by_week[week_key]["by_severity"]:
            trends_by_week[week_key]["by_severity"][event.severity] = 0
        trends_by_week[week_key]["by_severity"][event.severity] += 1
    
    return {
        "period": {"from_date": from_date, "to_date": to_date},
        "total_incidents": len(behavior_events),
        "weekly_trends": trends_by_week
    }

@router.get("/goals/summary")
async def get_goals_summary(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    student_id: Optional[UUID] = Query(None, description="Filter by student"),
):
    """Get IEP goals summary and progress statistics."""
    query = select(IEPGoal).join(IEP)
    
    if student_id:
        query = query.where(IEP.student_id == student_id)
    
    goals = session.exec(query).all()
    
    # Calculate statistics
    if not goals:
        return {
            "total_goals": 0,
            "progress_distribution": {},
            "goals_by_domain": {},
            "average_progress": 0
        }
    
    progress_ranges = {
        "0%": len([g for g in goals if g.progress == 0]),
        "1-25%": len([g for g in goals if 1 <= g.progress <= 25]),
        "26-50%": len([g for g in goals if 26 <= g.progress <= 50]),
        "51-75%": len([g for g in goals if 51 <= g.progress <= 75]),
        "76-99%": len([g for g in goals if 76 <= g.progress <= 99]),
        "100%": len([g for g in goals if g.progress == 100])
    }
    
    goals_by_domain = {}
    for goal in goals:
        domain = goal.domain
        if domain not in goals_by_domain:
            goals_by_domain[domain] = {
                "count": 0,
                "average_progress": 0,
                "completed": 0
            }
        goals_by_domain[domain]["count"] += 1
        goals_by_domain[domain]["average_progress"] += goal.progress
        if goal.progress >= 100:
            goals_by_domain[domain]["completed"] += 1
    
    # Calculate averages for domains
    for domain_data in goals_by_domain.values():
        domain_data["average_progress"] = domain_data["average_progress"] / domain_data["count"]
    
    return {
        "total_goals": len(goals),
        "progress_distribution": progress_ranges,
        "goals_by_domain": goals_by_domain,
        "average_progress": sum(g.progress for g in goals) / len(goals)
    }
