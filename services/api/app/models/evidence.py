"""Evidence and documentation models."""

from enum import Enum
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from .base import BaseModel


class EvidenceType(str, Enum):
    """Types of evidence."""
    PHOTO = "Photo"
    VIDEO = "Video"
    AUDIO = "Audio"
    DOCUMENT = "Document"
    WORK_SAMPLE = "Work Sample"
    DATA_SHEET = "Data Sheet"
    OBSERVATION = "Observation"
    OTHER = "Other"


class Evidence(BaseModel, table=True):
    """Evidence/documentation model."""
    __tablename__ = "evidence"
    
    # Basic info
    title: str
    description: Optional[str] = None
    evidence_type: EvidenceType
    
    # File info
    file_path: Optional[str] = None  # S3 path or local path
    file_name: Optional[str] = None
    file_size: Optional[int] = None  # in bytes
    mime_type: Optional[str] = None
    
    # Associations
    student_id: Optional[int] = Field(foreign_key="students.id")
    iep_goal_id: Optional[int] = Field(foreign_key="iep_goals.id")
    behavior_event_id: Optional[int] = Field(foreign_key="behavior_events.id")
    lesson_plan_id: Optional[int] = Field(foreign_key="lesson_plans.id")
    
    # Collection info
    collected_date: datetime
    collected_by_id: int = Field(foreign_key="users.id")
    
    # Privacy and sharing
    is_confidential: bool = Field(default=True)
    shared_with_parents: bool = Field(default=False)
    
    # Tags for organization
    tags: Optional[str] = None  # comma-separated tags


class EvidenceCreate(SQLModel):
    """Evidence creation schema."""
    title: str
    description: Optional[str] = None
    evidence_type: EvidenceType
    file_name: Optional[str] = None
    mime_type: Optional[str] = None
    student_id: Optional[int] = None
    iep_goal_id: Optional[int] = None
    behavior_event_id: Optional[int] = None
    lesson_plan_id: Optional[int] = None
    collected_date: datetime
    is_confidential: bool = True
    shared_with_parents: bool = False
    tags: Optional[str] = None


class EvidenceUpdate(SQLModel):
    """Evidence update schema."""
    title: Optional[str] = None
    description: Optional[str] = None
    evidence_type: Optional[EvidenceType] = None
    is_confidential: Optional[bool] = None
    shared_with_parents: Optional[bool] = None
    tags: Optional[str] = None


class EvidenceRead(SQLModel):
    """Evidence read schema."""
    id: int
    title: str
    description: Optional[str] = None
    evidence_type: EvidenceType
    file_path: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    student_id: Optional[int] = None
    iep_goal_id: Optional[int] = None
    behavior_event_id: Optional[int] = None
    lesson_plan_id: Optional[int] = None
    collected_date: datetime
    collected_by_id: int
    is_confidential: bool
    shared_with_parents: bool
    tags: Optional[str] = None
