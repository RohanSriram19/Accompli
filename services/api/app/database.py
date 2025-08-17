"""Database connection and session management."""

from sqlmodel import create_engine, Session, SQLModel
from app.core.config import settings

# Create engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",
    pool_pre_ping=True,
    pool_recycle=300,  # Recycle connections every 5 minutes
)


def get_session():
    """Dependency to get database session."""
    with Session(engine) as session:
        try:
            yield session
        finally:
            session.close()


def create_db_and_tables():
    """Create database tables."""
    # Import all models to ensure they're registered
    from app.models import (
        User, Organization, Student, IEP, IEPGoal,
        BehaviorEvent, LessonPlan, Evidence
    )
    
    SQLModel.metadata.create_all(engine)


def init_db():
    """Initialize database with tables."""
    create_db_and_tables()
    print("Database tables created successfully!")


if __name__ == "__main__":
    init_db()
