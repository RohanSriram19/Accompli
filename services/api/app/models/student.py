"""Student model."""

from enum import Enum
from datetime import date
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from .base import BaseModel


class DisabilityCategory(str, Enum):
    """Disability categories."""
    AUTISM = "Autism"
    DEAF_BLINDNESS = "Deaf-Blindness"
    DEAFNESS = "Deafness"
    DEVELOPMENTAL_DELAY = "Developmental Delay"
    EMOTIONAL_DISTURBANCE = "Emotional Disturbance"
    HEARING_IMPAIRMENT = "Hearing Impairment"
    INTELLECTUAL_DISABILITY = "Intellectual Disability"
    MULTIPLE_DISABILITIES = "Multiple Disabilities"
    ORTHOPEDIC_IMPAIRMENT = "Orthopedic Impairment"
    OTHER_HEALTH_IMPAIRMENT = "Other Health Impairment"
    SPECIFIC_LEARNING_DISABILITY = "Specific Learning Disability"
    SPEECH_LANGUAGE_IMPAIRMENT = "Speech or Language Impairment"
    TRAUMATIC_BRAIN_INJURY = "Traumatic Brain Injury"
    VISUAL_IMPAIRMENT = "Visual Impairment"


class PlacementType(str, Enum):
    """Educational placement types."""
    GENERAL_EDUCATION = "General Education"
    RESOURCE_ROOM = "Resource Room"
    SEPARATE_CLASS = "Separate Class"
    SEPARATE_SCHOOL = "Separate School"
    RESIDENTIAL = "Residential"
    HOME_HOSPITAL = "Home/Hospital"


class IEPStatus(str, Enum):
    """IEP status."""
    ACTIVE = "active"
    REVIEW_NEEDED = "review_needed"
    EXPIRED = "expired"
    DRAFT = "draft"


class StudentParentLink(BaseModel, table=True):
    """Link table for student-parent relationships."""
    __tablename__ = "student_parent_links"
    
    student_id: int = Field(foreign_key="students.id", primary_key=True)
    parent_id: int = Field(foreign_key="users.id", primary_key=True)
    relationship_type: str = Field(default="parent")  # parent, guardian, etc.
    
    # Relationships
    student: "Student" = Relationship(back_populates="parent_relationships")
    parent: "User" = Relationship(back_populates="child_relationships")


class Student(BaseModel, table=True):
    """Student model."""
    __tablename__ = "students"
    
    # Basic Info
    first_name: str
    last_name: str
    date_of_birth: date
    student_id: str = Field(unique=True, index=True)
    grade: str
    
    # Disability Info
    disability_category: DisabilityCategory
    placement: PlacementType
    
    # IEP Info
    iep_status: IEPStatus = Field(default=IEPStatus.ACTIVE)
    iep_start_date: Optional[date] = None
    iep_end_date: Optional[date] = None
    next_review_date: Optional[date] = None
    
    # Academic Info
    reading_level: Optional[str] = None
    math_level: Optional[str] = None
    
    # Transition Info (for older students)
    transition_focus: Optional[str] = None
    
    # Plans
    behavior_plan: bool = Field(default=False)
    crisis_plan: bool = Field(default=False)
    
    # Progress tracking
    goals_progress: Optional[int] = Field(default=0, ge=0, le=100)
    recent_behaviors: Optional[int] = Field(default=0)
    
    # Organization/School
    organization_id: int = Field(foreign_key="organizations.id")
    organization: "Organization" = Relationship(back_populates="students")
    
    # Case Manager
    case_manager_id: Optional[int] = Field(foreign_key="users.id")
    case_manager: Optional["User"] = Relationship(back_populates="students")
    
    # Parent relationships
    parent_relationships: List[StudentParentLink] = Relationship(back_populates="student")
    
    # IEP relationship
    ieps: List["IEP"] = Relationship(back_populates="student")
    
    # Behavior events
    behavior_events: List["BehaviorEvent"] = Relationship(back_populates="student")
    
    @property
    def full_name(self) -> str:
        """Get full name."""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self) -> Optional[int]:
        """Calculate age."""
        if self.date_of_birth:
            from datetime import date
            today = date.today()
            return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return None


class StudentCreate(SQLModel):
    """Student creation schema."""
    first_name: str
    last_name: str
    date_of_birth: date
    student_id: str
    grade: str
    disability_category: DisabilityCategory
    placement: PlacementType
    organization_id: int
    case_manager_id: Optional[int] = None
    reading_level: Optional[str] = None
    math_level: Optional[str] = None
    transition_focus: Optional[str] = None


class StudentUpdate(SQLModel):
    """Student update schema."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    grade: Optional[str] = None
    disability_category: Optional[DisabilityCategory] = None
    placement: Optional[PlacementType] = None
    iep_status: Optional[IEPStatus] = None
    reading_level: Optional[str] = None
    math_level: Optional[str] = None
    transition_focus: Optional[str] = None
    behavior_plan: Optional[bool] = None
    crisis_plan: Optional[bool] = None
    case_manager_id: Optional[int] = None


class StudentRead(SQLModel):
    """Student read schema."""
    id: int
    first_name: str
    last_name: str
    date_of_birth: date
    student_id: str
    grade: str
    disability_category: DisabilityCategory
    placement: PlacementType
    iep_status: IEPStatus
    reading_level: Optional[str] = None
    math_level: Optional[str] = None
    transition_focus: Optional[str] = None
    behavior_plan: bool
    crisis_plan: bool
    goals_progress: Optional[int] = None
    recent_behaviors: Optional[int] = None
    organization_id: int
    case_manager_id: Optional[int] = None
