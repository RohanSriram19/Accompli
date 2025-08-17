#!/usr/bin/env python3
"""
Database initialization script for the Accompli API.

This script creates all database tables based on SQLModel definitions
and optionally loads sample data for development and testing.
"""
import asyncio
from datetime import datetime, date
from uuid import uuid4

from sqlmodel import SQLModel, create_engine, Session

from app.core.config import settings
from app.database import engine
from app.models.user import User
from app.models.organization import Organization  
from app.models.student import Student
from app.models.iep import IEP, IEPGoal
from app.models.behavior_event import BehaviorEvent
from app.models.lesson_plan import LessonPlan
from app.models.evidence import Evidence


def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    print("✅ Database tables created successfully!")


def create_sample_data():
    """Create sample data for development and testing."""
    print("Creating sample data...")
    
    with Session(engine) as session:
        # Create sample organization
        org = Organization(
            id=uuid4(),
            name="Springfield Elementary School District",
            type="school_district",
            settings={
                "grading_scale": "A-F",
                "school_year": "2024-2025"
            }
        )
        session.add(org)
        
        # Create sample users
        admin_user = User(
            id=uuid4(),
            email="admin@springfield.edu",
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            first_name="Jane",
            last_name="Admin",
            role="admin",
            organization_id=org.id,
            is_active=True
        )
        
        teacher_user = User(
            id=uuid4(),
            email="teacher@springfield.edu", 
            hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
            first_name="John",
            last_name="Teacher",
            role="teacher",
            organization_id=org.id,
            is_active=True
        )
        
        session.add_all([admin_user, teacher_user])
        
        # Create sample students
        student1 = Student(
            id=uuid4(),
            first_name="Alex",
            last_name="Johnson",
            date_of_birth=date(2010, 5, 15),
            grade_level="5th",
            iep_status="active",
            primary_disability="Autism Spectrum Disorder",
            organization_id=org.id,
            additional_info={
                "allergies": ["peanuts"],
                "emergency_contact": "555-0123"
            }
        )
        
        student2 = Student(
            id=uuid4(),
            first_name="Sarah",
            last_name="Williams", 
            date_of_birth=date(2011, 8, 22),
            grade_level="4th",
            iep_status="active",
            primary_disability="Learning Disability",
            organization_id=org.id,
            additional_info={
                "preferred_name": "Sara",
                "emergency_contact": "555-0456"
            }
        )
        
        session.add_all([student1, student2])
        session.commit()  # Commit to get student IDs
        
        # Create sample IEPs
        iep1 = IEP(
            id=uuid4(),
            student_id=student1.id,
            start_date=date(2024, 9, 1),
            end_date=date(2025, 8, 31),
            case_manager=teacher_user.first_name + " " + teacher_user.last_name,
            status="active",
            accommodations={
                "testing": ["extended time", "quiet environment"],
                "classroom": ["preferential seating", "visual schedules"]
            },
            services={
                "speech_therapy": "2x weekly, 30 min",
                "occupational_therapy": "1x weekly, 45 min"
            }
        )
        
        iep2 = IEP(
            id=uuid4(),
            student_id=student2.id,
            start_date=date(2024, 9, 1),
            end_date=date(2025, 8, 31),
            case_manager=teacher_user.first_name + " " + teacher_user.last_name,
            status="active",
            accommodations={
                "testing": ["extended time", "oral instructions"],
                "classroom": ["frequent breaks", "assistive technology"]
            },
            services={
                "resource_room": "daily, 60 min"
            }
        )
        
        session.add_all([iep1, iep2])
        session.commit()  # Commit to get IEP IDs
        
        # Create sample IEP goals
        goals = [
            IEPGoal(
                id=uuid4(),
                iep_id=iep1.id,
                domain="Communication",
                goal_text="Alex will initiate conversation with peers using appropriate social greetings in 4 out of 5 opportunities.",
                target_date=date(2025, 6, 30),
                progress=65.0,
                status="in_progress"
            ),
            IEPGoal(
                id=uuid4(),
                iep_id=iep1.id,
                domain="Academic - Math",
                goal_text="Alex will solve single-step word problems involving addition and subtraction with 80% accuracy.",
                target_date=date(2025, 6, 30),
                progress=45.0,
                status="in_progress"
            ),
            IEPGoal(
                id=uuid4(),
                iep_id=iep2.id,
                domain="Academic - Reading",
                goal_text="Sarah will read grade-level text with 90% accuracy and answer comprehension questions.",
                target_date=date(2025, 6, 30),
                progress=78.0,
                status="in_progress"
            ),
            IEPGoal(
                id=uuid4(),
                iep_id=iep2.id,
                domain="Academic - Writing",
                goal_text="Sarah will write a paragraph with topic sentence and 3 supporting details.",
                target_date=date(2025, 6, 30),
                progress=90.0,
                status="in_progress"
            )
        ]
        
        session.add_all(goals)
        
        # Create sample behavior events
        behavior_events = [
            BehaviorEvent(
                id=uuid4(),
                student_id=student1.id,
                date=datetime(2024, 12, 1, 10, 30),
                incident_type="disruption",
                severity="minor",
                description="Called out without raising hand during math lesson",
                antecedent="Difficult math problem presented",
                consequence="Reminder of classroom rules",
                location="Classroom 5B",
                staff_involved=[teacher_user.first_name + " " + teacher_user.last_name]
            ),
            BehaviorEvent(
                id=uuid4(),
                student_id=student1.id,
                date=datetime(2024, 12, 3, 14, 15),
                incident_type="positive",
                severity="minor",
                description="Helped classmate with assignment without being asked",
                location="Classroom 5B",
                staff_involved=[teacher_user.first_name + " " + teacher_user.last_name]
            )
        ]
        
        session.add_all(behavior_events)
        
        # Create sample lesson plans
        lesson_plans = [
            LessonPlan(
                id=uuid4(),
                student_id=student1.id,
                title="Social Communication Practice",
                subject="Speech Therapy",
                date=datetime(2024, 12, 5, 9, 0),
                duration_minutes=30,
                objectives=["Practice greeting peers", "Use appropriate eye contact"],
                materials=["Social stories", "Visual cues", "Peer buddy"],
                activities={
                    "warm_up": "Review social greetings",
                    "main_activity": "Role play conversations",
                    "closing": "Reflect on practice session"
                },
                status="completed",
                notes="Great progress with eye contact today!"
            ),
            LessonPlan(
                id=uuid4(),
                student_id=student2.id,
                title="Reading Comprehension Strategies",
                subject="Reading",
                date=datetime(2024, 12, 6, 11, 0),
                duration_minutes=45,
                objectives=["Identify main idea", "Find supporting details"],
                materials=["Grade 4 text", "Graphic organizer", "Highlighters"],
                activities={
                    "warm_up": "Review previous lesson",
                    "guided_practice": "Read passage together",
                    "independent_work": "Complete graphic organizer"
                },
                status="planned"
            )
        ]
        
        session.add_all(lesson_plans)
        
        # Commit all sample data
        session.commit()
        
    print("✅ Sample data created successfully!")


def main():
    """Main function to initialize the database."""
    print("🚀 Initializing Accompli database...")
    print(f"Database URL: {settings.DATABASE_URL}")
    
    try:
        # Create tables
        create_tables()
        
        # Ask user if they want sample data
        response = input("Create sample data for development? (y/n): ").lower().strip()
        if response in ['y', 'yes']:
            create_sample_data()
            print("\n📊 Sample data includes:")
            print("  - Admin user: admin@springfield.edu (password: password)")
            print("  - Teacher user: teacher@springfield.edu (password: password)")
            print("  - 2 sample students with IEPs")
            print("  - 4 IEP goals with progress tracking")
            print("  - Sample behavior events and lesson plans")
        
        print("\n🎉 Database initialization complete!")
        print("\nNext steps:")
        print("1. Start the API server: uvicorn app.main:app --reload")
        print("2. View API docs: http://localhost:8000/docs")
        print("3. Test authentication with the sample users")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        raise


if __name__ == "__main__":
    main()
