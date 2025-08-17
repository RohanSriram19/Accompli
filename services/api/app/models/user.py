"""User model."""

from enum import Enum
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from .base import BaseModel


class UserRole(str, Enum):
    """User roles."""
    PARENT = "PARENT"
    TEACHER = "TEACHER"
    ADMIN = "ADMIN"
    CASE_MANAGER = "CASE_MANAGER"


class User(BaseModel, table=True):
    """User model."""
    __tablename__ = "users"
    
    email: str = Field(index=True, unique=True)
    hashed_password: str
    first_name: str
    last_name: str
    role: UserRole = Field(default=UserRole.TEACHER)
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    
    # Organization relationship
    organization_id: Optional[int] = Field(default=None, foreign_key="organizations.id")
    organization: Optional["Organization"] = Relationship(back_populates="users")
    
    # Student relationships
    students: List["Student"] = Relationship(back_populates="case_manager")
    child_relationships: List["StudentParentLink"] = Relationship(back_populates="parent")
    
    @property
    def full_name(self) -> str:
        """Get full name."""
        return f"{self.first_name} {self.last_name}"


class UserCreate(SQLModel):
    """User creation schema."""
    email: str
    password: str
    first_name: str
    last_name: str
    role: UserRole = UserRole.TEACHER
    organization_id: Optional[int] = None


class UserUpdate(SQLModel):
    """User update schema."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


class UserRead(SQLModel):
    """User read schema."""
    id: int
    email: str
    first_name: str
    last_name: str
    role: UserRole
    is_active: bool
    is_verified: bool
    organization_id: Optional[int] = None


class UserPublic(UserRead):
    """Public user schema (alias for UserRead)."""
    pass


class UserLogin(SQLModel):
    """User login schema."""
    email: str
    password: str


class Token(SQLModel):
    """JWT token response schema."""
    access_token: str
    token_type: str = "bearer"
