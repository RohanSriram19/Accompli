"""IEP (Individual Education Plan) models."""

from enum import Enum
from datetime import date
from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, Relationship, JSON, Column
from .base import BaseModel


class GoalArea(str, Enum):
    """IEP goal areas."""
    ACADEMIC_READING = "Academic - Reading"
    ACADEMIC_MATH = "Academic - Math"
    ACADEMIC_WRITING = "Academic - Writing"
    COMMUNICATION = "Communication"
    SOCIAL_EMOTIONAL = "Social/Emotional"
    BEHAVIOR = "Behavior" 
    FUNCTIONAL_LIFE_SKILLS = "Functional Life Skills"
    TRANSITION = "Transition"
    MOTOR_SKILLS = "Motor Skills"
    VOCATIONAL = "Vocational"


class GoalStatus(str, Enum):
    """Goal status."""
    IN_PROGRESS = "in_progress"
    MASTERED = "mastered"
    NOT_STARTED = "not_started"
    DISCONTINUED = "discontinued"


class IEP(BaseModel, table=True):
    """IEP model."""
    __tablename__ = "ieps"
    
    # Basic info
    student_id: int = Field(foreign_key="students.id")
    start_date: date
    end_date: date
    
    # IEP details
    present_levels: Optional[str] = None  # PLAAFP - Present Levels of Academic Achievement and Functional Performance
    annual_goals: Optional[str] = None
    special_education_services: Optional[str] = None
    related_services: Optional[str] = None
    accommodations: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    modifications: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    
    # Assessment info
    state_assessment_participation: Optional[str] = None
    alternative_assessment: Optional[str] = None
    
    # Transition (for 16+)
    transition_services: Optional[str] = None
    postsecondary_goals: Optional[str] = None
    
    # Meeting info
    annual_review_date: Optional[date] = None
    team_members: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    
    # Status
    is_active: bool = Field(default=True)
    
    # Relationships
    student: "Student" = Relationship(back_populates="ieps")
    goals: List["IEPGoal"] = Relationship(back_populates="iep")


class IEPGoal(BaseModel, table=True):
    """IEP Goal model."""
    __tablename__ = "iep_goals"
    
    # Goal info
    iep_id: int = Field(foreign_key="ieps.id")
    area: GoalArea
    description: str
    baseline: str
    target_criteria: str
    measurement_method: str
    
    # Progress tracking
    status: GoalStatus = Field(default=GoalStatus.NOT_STARTED)
    progress_percentage: int = Field(default=0, ge=0, le=100)
    notes: Optional[str] = None
    
    # Dates
    target_date: Optional[date] = None
    mastery_date: Optional[date] = None
    
    # Priority
    is_priority: bool = Field(default=False)
    
    # Accommodations specific to this goal
    accommodations: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    
    # Data collection
    data_collection_schedule: Optional[str] = None  # daily, weekly, monthly
    
    # Relationships
    iep: IEP = Relationship(back_populates="goals")


# Schemas
class IEPCreate(SQLModel):
    """IEP creation schema."""
    student_id: int
    start_date: date
    end_date: date
    present_levels: Optional[str] = None
    annual_goals: Optional[str] = None
    special_education_services: Optional[str] = None
    related_services: Optional[str] = None
    accommodations: Optional[Dict[str, Any]] = None
    modifications: Optional[Dict[str, Any]] = None
    transition_services: Optional[str] = None
    postsecondary_goals: Optional[str] = None


class IEPUpdate(SQLModel):
    """IEP update schema."""
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    present_levels: Optional[str] = None
    annual_goals: Optional[str] = None
    special_education_services: Optional[str] = None
    related_services: Optional[str] = None
    accommodations: Optional[Dict[str, Any]] = None
    modifications: Optional[Dict[str, Any]] = None
    transition_services: Optional[str] = None
    postsecondary_goals: Optional[str] = None
    annual_review_date: Optional[date] = None
    is_active: Optional[bool] = None


class IEPRead(SQLModel):
    """IEP read schema."""
    id: int
    student_id: int
    start_date: date
    end_date: date
    present_levels: Optional[str] = None
    annual_goals: Optional[str] = None
    special_education_services: Optional[str] = None
    related_services: Optional[str] = None
    accommodations: Optional[Dict[str, Any]] = None
    modifications: Optional[Dict[str, Any]] = None
    transition_services: Optional[str] = None
    postsecondary_goals: Optional[str] = None
    annual_review_date: Optional[date] = None
    is_active: bool


class IEPGoalCreate(SQLModel):
    """IEP Goal creation schema."""
    iep_id: int
    area: GoalArea
    description: str
    baseline: str
    target_criteria: str
    measurement_method: str
    target_date: Optional[date] = None
    is_priority: bool = False
    accommodations: Optional[List[str]] = None
    data_collection_schedule: Optional[str] = None


class IEPGoalUpdate(SQLModel):
    """IEP Goal update schema."""
    area: Optional[GoalArea] = None
    description: Optional[str] = None
    baseline: Optional[str] = None
    target_criteria: Optional[str] = None
    measurement_method: Optional[str] = None
    status: Optional[GoalStatus] = None
    progress_percentage: Optional[int] = None
    notes: Optional[str] = None
    target_date: Optional[date] = None
    mastery_date: Optional[date] = None
    is_priority: Optional[bool] = None
    accommodations: Optional[List[str]] = None
    data_collection_schedule: Optional[str] = None


class IEPGoalRead(SQLModel):
    """IEP Goal read schema."""
    id: int
    iep_id: int
    area: GoalArea
    description: str
    baseline: str
    target_criteria: str
    measurement_method: str
    status: GoalStatus
    progress_percentage: int
    notes: Optional[str] = None
    target_date: Optional[date] = None
    mastery_date: Optional[date] = None
    is_priority: bool
    accommodations: Optional[List[str]] = None
    data_collection_schedule: Optional[str] = None
