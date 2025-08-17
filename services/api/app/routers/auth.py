"""
Authentication router with login, signup, and user management.
"""
from datetime import datetime, timedelta
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlmodel import Session, select

from app.database import get_session
from app.core.auth import (
    authenticate_user, create_access_token, get_current_active_user,
    get_password_hash
)
from app.models.user import User, UserCreate, UserLogin, Token, UserPublic, UserUpdate
from app.core.config import settings

router = APIRouter()
security = HTTPBearer()


@router.post("/login", response_model=Token)
async def login(
    user_credentials: UserLogin,
    session: Session = Depends(get_session)
):
    """Login endpoint."""
    user = authenticate_user(session, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    # Update last login
    user.last_login = datetime.utcnow()
    session.add(user)
    session.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup", response_model=UserPublic)
async def signup(
    user_data: UserCreate,
    session: Session = Depends(get_session)
):
    """User signup endpoint."""
    # Check if user already exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role=user_data.role,
        organization_id=user_data.organization_id
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    return db_user


@router.get("/me", response_model=UserPublic)
async def get_current_user(
    current_user: User = Depends(get_current_active_user)
):
    """Get current authenticated user."""
    return current_user


@router.put("/me", response_model=UserPublic)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Update current user profile."""
    user_data = user_update.model_dump(exclude_unset=True)
    for key, value in user_data.items():
        setattr(current_user, key, value)
    
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return current_user


@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_active_user),
    session: Session = Depends(get_session)
):
    """Change user password."""
    from app.core.auth import verify_password
    
    if not verify_password(current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
    
    current_user.hashed_password = get_password_hash(new_password)
    session.add(current_user)
    session.commit()
    
    return {"message": "Password updated successfully"}
