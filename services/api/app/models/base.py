"""Base database model and configuration."""

from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, create_engine, Session
from app.core.config import settings


class BaseModel(SQLModel):
    """Base model with common fields."""
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# Database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",
    pool_pre_ping=True,
)


def get_session():
    """Get database session."""
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    """Create database and tables."""
    SQLModel.metadata.create_all(engine)
