"""Lesson plan models."""

from enum import Enum
from datetime import date
from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field, JSON, Column
from .base import BaseModel


class SubjectArea(str, Enum):
    """Subject areas."""
    READING = "Reading"
    MATH = "Math"
    WRITING = "Writing"
    SCIENCE = "Science"
    SOCIAL_STUDIES = "Social Studies"
    LIFE_SKILLS = "Life Skills"
    COMMUNICATION = "Communication"
    BEHAVIOR = "Behavior"
    TRANSITION = "Transition"
    PHYSICAL_EDUCATION = "Physical Education"
    ART = "Art"
    MUSIC = "Music"
    VOCATIONAL = "Vocational"
    OTHER = "Other"


class LessonPlan(BaseModel, table=True):
    """Lesson plan model."""
    __tablename__ = "lesson_plans"
    
    # Basic info
    title: str
    subject_area: SubjectArea
    date: date
    duration_minutes: int
    
    # Standards and goals
    standards: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    iep_goals: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))  # IEP goal IDs or descriptions
    
    # Lesson content
    objective: str
    materials: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    introduction: Optional[str] = None
    instruction: Optional[str] = None
    guided_practice: Optional[str] = None
    independent_practice: Optional[str] = None
    closure: Optional[str] = None
    
    # Assessment
    assessment_method: Optional[str] = None
    assessment_criteria: Optional[str] = None
    
    # Accommodations and modifications
    accommodations: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    modifications: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    
    # Data collection
    data_collection: Optional[str] = None
    
    # Notes and reflection
    notes: Optional[str] = None
    reflection: Optional[str] = None
    
    # Created by
    created_by_id: int = Field(foreign_key="users.id")
    
    # Status
    is_template: bool = Field(default=False)
    is_published: bool = Field(default=False)


class LessonPlanCreate(SQLModel):
    """Lesson plan creation schema."""
    title: str
    subject_area: SubjectArea
    date: date
    duration_minutes: int
    objective: str
    standards: Optional[List[str]] = None
    iep_goals: Optional[List[str]] = None
    materials: Optional[List[str]] = None
    introduction: Optional[str] = None
    instruction: Optional[str] = None
    guided_practice: Optional[str] = None
    independent_practice: Optional[str] = None
    closure: Optional[str] = None
    assessment_method: Optional[str] = None
    assessment_criteria: Optional[str] = None
    accommodations: Optional[List[str]] = None
    modifications: Optional[List[str]] = None
    data_collection: Optional[str] = None
    notes: Optional[str] = None
    is_template: bool = False


class LessonPlanUpdate(SQLModel):
    """Lesson plan update schema."""
    title: Optional[str] = None
    subject_area: Optional[SubjectArea] = None
    lesson_date: Optional[date] = None
    duration_minutes: Optional[int] = None
    objective: Optional[str] = None
    standards: Optional[List[str]] = None
    iep_goals: Optional[List[str]] = None
    materials: Optional[List[str]] = None
    introduction: Optional[str] = None
    instruction: Optional[str] = None
    guided_practice: Optional[str] = None
    independent_practice: Optional[str] = None
    closure: Optional[str] = None
    assessment_method: Optional[str] = None
    assessment_criteria: Optional[str] = None
    accommodations: Optional[List[str]] = None
    modifications: Optional[List[str]] = None
    data_collection: Optional[str] = None
    notes: Optional[str] = None
    reflection: Optional[str] = None
    is_template: Optional[bool] = None
    is_published: Optional[bool] = None


class LessonPlanRead(SQLModel):
    """Lesson plan read schema."""
    id: int
    title: str
    subject_area: SubjectArea
    date: date
    duration_minutes: int
    objective: str
    standards: Optional[List[str]] = None
    iep_goals: Optional[List[str]] = None
    materials: Optional[List[str]] = None
    introduction: Optional[str] = None
    instruction: Optional[str] = None
    guided_practice: Optional[str] = None
    independent_practice: Optional[str] = None
    closure: Optional[str] = None
    assessment_method: Optional[str] = None
    assessment_criteria: Optional[str] = None
    accommodations: Optional[List[str]] = None
    modifications: Optional[List[str]] = None
    data_collection: Optional[str] = None
    notes: Optional[str] = None
    reflection: Optional[str] = None
    created_by_id: int
    is_template: bool
    is_published: bool
