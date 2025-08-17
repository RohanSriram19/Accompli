"""Behavior event tracking models."""

from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlmodel import SQLModel, Field, Relationship, JSON, Column
from .base import BaseModel


class BehaviorType(str, Enum):
    """Types of behaviors."""
    AGGRESSIVE = "Aggressive"
    DISRUPTIVE = "Disruptive"
    NON_COMPLIANCE = "Non-Compliance"
    SELF_INJURY = "Self-Injury"
    PROPERTY_DESTRUCTION = "Property Destruction"
    VERBAL_OUTBURST = "Verbal Outburst"
    WITHDRAWAL = "Withdrawal"
    POSITIVE = "Positive"
    OTHER = "Other"


class Intensity(str, Enum):
    """Behavior intensity levels."""
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    EXTREME = "Extreme"


class InterventionType(str, Enum):
    """Types of interventions."""
    REDIRECT = "Redirect"
    BREAK = "Break"
    REMOVE_FROM_SITUATION = "Remove from Situation"
    CALM_DOWN_STRATEGIES = "Calm Down Strategies"
    CHOICE_GIVEN = "Choice Given"
    PREFERRED_ACTIVITY = "Preferred Activity"
    IGNORE = "Ignore"
    OTHER = "Other"


class BehaviorEvent(BaseModel, table=True):
    """Behavior event tracking model."""
    __tablename__ = "behavior_events"
    
    # Basic info
    student_id: int = Field(foreign_key="students.id")
    date_time: datetime
    duration_minutes: Optional[int] = None
    
    # ABC Data (Antecedent-Behavior-Consequence)
    antecedent: str  # What happened before the behavior
    behavior_description: str  # Description of the behavior
    consequence: str  # What happened after the behavior
    
    # Classification
    behavior_type: BehaviorType
    intensity: Intensity
    
    # Context
    location: Optional[str] = None
    activity: Optional[str] = None
    staff_involved: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    
    # Intervention
    intervention_used: Optional[InterventionType] = None
    intervention_description: Optional[str] = None
    intervention_effective: Optional[bool] = None
    
    # Additional data
    notes: Optional[str] = None
    follow_up_needed: bool = Field(default=False)
    follow_up_notes: Optional[str] = None
    
    # Data collection
    data_collector_id: int = Field(foreign_key="users.id")
    
    # Relationships
    student: "Student" = Relationship(back_populates="behavior_events")
    data_collector: "User" = Relationship()


class BehaviorEventCreate(SQLModel):
    """Behavior event creation schema."""
    student_id: int
    date_time: datetime
    antecedent: str
    behavior_description: str
    consequence: str
    behavior_type: BehaviorType
    intensity: Intensity
    duration_minutes: Optional[int] = None
    location: Optional[str] = None
    activity: Optional[str] = None
    staff_involved: Optional[List[str]] = None
    intervention_used: Optional[InterventionType] = None
    intervention_description: Optional[str] = None
    intervention_effective: Optional[bool] = None
    notes: Optional[str] = None


class BehaviorEventUpdate(SQLModel):
    """Behavior event update schema."""
    antecedent: Optional[str] = None
    behavior_description: Optional[str] = None
    consequence: Optional[str] = None
    behavior_type: Optional[BehaviorType] = None
    intensity: Optional[Intensity] = None
    duration_minutes: Optional[int] = None
    location: Optional[str] = None
    activity: Optional[str] = None
    staff_involved: Optional[List[str]] = None
    intervention_used: Optional[InterventionType] = None
    intervention_description: Optional[str] = None
    intervention_effective: Optional[bool] = None
    notes: Optional[str] = None
    follow_up_needed: Optional[bool] = None
    follow_up_notes: Optional[str] = None


class BehaviorEventRead(SQLModel):
    """Behavior event read schema."""
    id: int
    student_id: int
    date_time: datetime
    duration_minutes: Optional[int] = None
    antecedent: str
    behavior_description: str
    consequence: str
    behavior_type: BehaviorType
    intensity: Intensity
    location: Optional[str] = None
    activity: Optional[str] = None
    staff_involved: Optional[List[str]] = None
    intervention_used: Optional[InterventionType] = None
    intervention_description: Optional[str] = None
    intervention_effective: Optional[bool] = None
    notes: Optional[str] = None
    follow_up_needed: bool
    follow_up_notes: Optional[str] = None
    data_collector_id: int
