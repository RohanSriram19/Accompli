"""Organization model."""

from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from .base import BaseModel


class Organization(BaseModel, table=True):
    """Organization model."""
    __tablename__ = "organizations"
    
    name: str = Field(index=True)
    code: str = Field(unique=True, index=True)
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    
    # Settings
    is_active: bool = Field(default=True)
    max_users: int = Field(default=100)
    
    # Relationships
    users: List["User"] = Relationship(back_populates="organization")
    students: List["Student"] = Relationship(back_populates="organization")


class OrganizationCreate(SQLModel):
    """Organization creation schema."""
    name: str
    code: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    max_users: int = 100


class OrganizationUpdate(SQLModel):
    """Organization update schema."""
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None
    max_users: Optional[int] = None


class OrganizationRead(SQLModel):
    """Organization read schema."""
    id: int
    name: str
    code: str
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: bool
    max_users: int
