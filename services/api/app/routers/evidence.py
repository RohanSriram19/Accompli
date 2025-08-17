"""Evidence router for managing goal progress documentation and evidence files."""
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from sqlmodel import Session, select

from ..models.evidence import Evidence, EvidenceCreate, EvidenceUpdate, EvidenceRead
from ..models.iep import IEPGoal
from ..core.auth import get_current_user
from ..database import get_session

router = APIRouter(prefix="/evidence", tags=["evidence"])

@router.get("/", response_model=List[EvidenceRead])
async def list_evidence(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    goal_id: Optional[UUID] = Query(None, description="Filter by IEP goal ID"),
    evidence_type: Optional[str] = Query(None, description="Filter by evidence type"),
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
):
    """Retrieve evidence records with filtering options."""
    query = select(Evidence)
    
    # Apply filters
    if goal_id:
        query = query.where(Evidence.goal_id == goal_id)
    if evidence_type:
        query = query.where(Evidence.evidence_type == evidence_type)
    
    # Add pagination and ordering
    query = query.order_by(Evidence.date_collected.desc()).offset(offset).limit(limit)
    
    evidence_records = session.exec(query).all()
    return evidence_records

@router.post("/", response_model=EvidenceRead)
async def create_evidence(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    evidence: EvidenceCreate,
):
    """Create a new evidence record."""
    # Verify goal exists
    goal = session.get(IEPGoal, evidence.goal_id)
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="IEP goal not found"
        )
    
    db_evidence = Evidence.model_validate(evidence)
    session.add(db_evidence)
    session.commit()
    session.refresh(db_evidence)
    return db_evidence

@router.post("/upload", response_model=EvidenceRead)
async def upload_evidence_file(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    goal_id: UUID,
    evidence_type: str,
    description: str,
    file: UploadFile = File(...),
):
    """Upload an evidence file (photo, video, document, etc.)."""
    # Verify goal exists
    goal = session.get(IEPGoal, goal_id)
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="IEP goal not found"
        )
    
    # TODO: Implement file storage (S3, local storage, etc.)
    # For now, we'll just store metadata
    file_path = f"evidence/{goal_id}/{file.filename}"
    
    evidence_data = EvidenceCreate(
        goal_id=goal_id,
        evidence_type=evidence_type,
        description=description,
        file_path=file_path,
        file_type=file.content_type
    )
    
    db_evidence = Evidence.model_validate(evidence_data)
    session.add(db_evidence)
    session.commit()
    session.refresh(db_evidence)
    
    return db_evidence

@router.get("/goal/{goal_id}", response_model=List[EvidenceRead])
async def get_evidence_for_goal(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    goal_id: UUID,
):
    """Get all evidence records for a specific IEP goal."""
    # Verify goal exists
    goal = session.get(IEPGoal, goal_id)
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="IEP goal not found"
        )
    
    query = select(Evidence).where(Evidence.goal_id == goal_id).order_by(Evidence.date_collected.desc())
    evidence_records = session.exec(query).all()
    return evidence_records

@router.get("/{evidence_id}", response_model=EvidenceRead)
async def get_evidence(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    evidence_id: UUID,
):
    """Get a specific evidence record by ID."""
    evidence = session.get(Evidence, evidence_id)
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence record not found"
        )
    return evidence

@router.patch("/{evidence_id}", response_model=EvidenceRead)
async def update_evidence(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    evidence_id: UUID,
    evidence_update: EvidenceUpdate,
):
    """Update an evidence record."""
    evidence = session.get(Evidence, evidence_id)
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence record not found"
        )
    
    evidence_data = evidence_update.model_dump(exclude_unset=True)
    for field, value in evidence_data.items():
        setattr(evidence, field, value)
    
    session.add(evidence)
    session.commit()
    session.refresh(evidence)
    return evidence

@router.delete("/{evidence_id}")
async def delete_evidence(
    *,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
    evidence_id: UUID,
):
    """Delete an evidence record."""
    evidence = session.get(Evidence, evidence_id)
    if not evidence:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence record not found"
        )
    
    # TODO: Also delete the associated file from storage
    
    session.delete(evidence)
    session.commit()
    return {"message": "Evidence record deleted successfully"}
