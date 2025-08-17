"""Analytics router for advanced data analysis and insights."""
from datetime import datetime, date, timedelta
from typing import List, Optional, Dict, Any
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session, select, func, and_, text

from ..models.student import Student
from ..models.iep import IEP, IEPGoal
from ..models.behavior_event import BehaviorEvent
from ..models.lesson_plan import LessonPlan
from ..models.evidence import Evidence
from ..core.auth import get_current_user
from ..database import get_session

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
async def get_dashboard_analytics(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    """Get high-level analytics for the main dashboard."""
    # Total counts
    total_students = session.scalar(select(func.count(Student.id)))
    total_goals = session.scalar(select(func.count(IEPGoal.id)))
    total_behavior_events = session.scalar(select(func.count(BehaviorEvent.id)))
    total_lesson_plans = session.scalar(select(func.count(LessonPlan.id)))
    
    # Recent activity (last 30 days)
    thirty_days_ago = date.today() - timedelta(days=30)
    
    recent_behavior_events = session.scalar(
        select(func.count(BehaviorEvent.id))
        .where(func.date(BehaviorEvent.date) >= thirty_days_ago)
    )
    
    recent_lesson_plans = session.scalar(
        select(func.count(LessonPlan.id))
        .where(func.date(LessonPlan.date) >= thirty_days_ago)
    )
    
    # Goal progress statistics
    goals_completed = session.scalar(
        select(func.count(IEPGoal.id))
        .where(IEPGoal.progress >= 100)
    )
    
    average_goal_progress = session.scalar(
        select(func.avg(IEPGoal.progress))
    ) or 0
    
    return {
        "totals": {
            "students": total_students or 0,
            "goals": total_goals or 0,
            "behavior_events": total_behavior_events or 0,
            "lesson_plans": total_lesson_plans or 0
        },
        "recent_activity": {
            "behavior_events_30d": recent_behavior_events or 0,
            "lesson_plans_30d": recent_lesson_plans or 0
        },
        "goal_progress": {
            "completed_goals": goals_completed or 0,
            "average_progress": round(float(average_goal_progress), 2)
        }
    }

@router.get("/student-performance")
async def get_student_performance_analytics(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    from_date: Optional[date] = Query(None, description="Start date for analysis"),
    to_date: Optional[date] = Query(None, description="End date for analysis"),
):
    """Get performance analytics across all students."""
    # Set default date range
    if not to_date:
        to_date = date.today()
    if not from_date:
        from_date = to_date - timedelta(days=90)
    
    # Get students with their goal progress
    students_query = """
    SELECT 
        s.id,
        s.first_name,
        s.last_name,
        COUNT(g.id) as total_goals,
        AVG(g.progress) as avg_progress,
        COUNT(CASE WHEN g.progress >= 100 THEN 1 END) as completed_goals
    FROM student s
    LEFT JOIN iep i ON s.id = i.student_id
    LEFT JOIN iepgoal g ON i.id = g.iep_id
    GROUP BY s.id, s.first_name, s.last_name
    ORDER BY avg_progress DESC
    """
    
    result = session.exec(text(students_query))
    student_performance = [
        {
            "student_id": row[0],
            "name": f"{row[1]} {row[2]}",
            "total_goals": row[3] or 0,
            "average_progress": round(float(row[4] or 0), 2),
            "completed_goals": row[5] or 0
        }
        for row in result
    ]
    
    return {
        "period": {"from_date": from_date, "to_date": to_date},
        "student_performance": student_performance
    }

@router.get("/behavior-patterns")
async def get_behavior_pattern_analytics(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    from_date: Optional[date] = Query(None, description="Start date"),
    to_date: Optional[date] = Query(None, description="End date"),
):
    """Analyze behavior patterns and trends."""
    if not to_date:
        to_date = date.today()
    if not from_date:
        from_date = to_date - timedelta(days=90)
    
    # Behavior events in date range
    behavior_query = select(BehaviorEvent).where(
        and_(
            func.date(BehaviorEvent.date) >= from_date,
            func.date(BehaviorEvent.date) <= to_date
        )
    )
    behavior_events = session.exec(behavior_query).all()
    
    # Analyze patterns
    patterns = {
        "by_day_of_week": {},
        "by_time_of_day": {},
        "by_type": {},
        "by_severity": {},
        "by_student": {}
    }
    
    for event in behavior_events:
        # Day of week (0=Monday, 6=Sunday)
        day_name = event.date.strftime('%A')
        patterns["by_day_of_week"][day_name] = patterns["by_day_of_week"].get(day_name, 0) + 1
        
        # Time of day (hour)
        hour = event.date.hour
        time_period = "Morning" if 6 <= hour < 12 else "Afternoon" if 12 <= hour < 18 else "Evening"
        patterns["by_time_of_day"][time_period] = patterns["by_time_of_day"].get(time_period, 0) + 1
        
        # By type
        patterns["by_type"][event.incident_type] = patterns["by_type"].get(event.incident_type, 0) + 1
        
        # By severity
        patterns["by_severity"][event.severity] = patterns["by_severity"].get(event.severity, 0) + 1
        
        # By student (top 10)
        student_key = str(event.student_id)
        patterns["by_student"][student_key] = patterns["by_student"].get(student_key, 0) + 1
    
    # Sort student patterns and take top 10
    patterns["by_student"] = dict(
        sorted(patterns["by_student"].items(), key=lambda x: x[1], reverse=True)[:10]
    )
    
    return {
        "period": {"from_date": from_date, "to_date": to_date},
        "total_events": len(behavior_events),
        "patterns": patterns
    }

@router.get("/goal-effectiveness")
async def get_goal_effectiveness_analytics(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    domain: Optional[str] = Query(None, description="Filter by goal domain"),
):
    """Analyze the effectiveness of different types of IEP goals."""
    query = select(IEPGoal)
    if domain:
        query = query.where(IEPGoal.domain == domain)
    
    goals = session.exec(query).all()
    
    # Analyze by domain
    domain_analysis = {}
    for goal in goals:
        goal_domain = goal.domain
        if goal_domain not in domain_analysis:
            domain_analysis[goal_domain] = {
                "total_goals": 0,
                "completed": 0,
                "in_progress": 0,
                "not_started": 0,
                "average_progress": 0,
                "total_progress": 0
            }
        
        domain_stats = domain_analysis[goal_domain]
        domain_stats["total_goals"] += 1
        domain_stats["total_progress"] += goal.progress
        
        if goal.progress >= 100:
            domain_stats["completed"] += 1
        elif goal.progress > 0:
            domain_stats["in_progress"] += 1
        else:
            domain_stats["not_started"] += 1
    
    # Calculate averages
    for domain_stats in domain_analysis.values():
        if domain_stats["total_goals"] > 0:
            domain_stats["average_progress"] = round(
                domain_stats["total_progress"] / domain_stats["total_goals"], 2
            )
            domain_stats["completion_rate"] = round(
                (domain_stats["completed"] / domain_stats["total_goals"]) * 100, 2
            )
        domain_stats.pop("total_progress")  # Remove intermediate field
    
    return {
        "total_goals_analyzed": len(goals),
        "domain_analysis": domain_analysis,
        "overall_completion_rate": round(
            (len([g for g in goals if g.progress >= 100]) / len(goals) * 100) if goals else 0, 2
        ),
        "overall_average_progress": round(
            sum(g.progress for g in goals) / len(goals) if goals else 0, 2
        )
    }
