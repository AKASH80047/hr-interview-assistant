from __future__ import annotations
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.report import Report
from app.models.interview import Interview
from app.models.user import User
from app.schemas.report import ReportCreate, ReportResponse, ReportUpdate

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    report_in: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    interview = db.get(Interview, report_in.interview_id)
    if not interview or interview.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Interview not found")
        
    report = Report(**report_in.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/interview/{interview_id}", response_model=ReportResponse)
def read_report_by_interview(
    interview_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    interview = db.get(Interview, interview_id)
    if not interview or interview.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Interview not found")
        
    result = db.execute(select(Report).where(Report.interview_id == interview_id))
    report = result.scalars().first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.get("/{report_id}", response_model=ReportResponse)
def read_report(
    report_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    report = db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    interview = db.get(Interview, report.interview_id)
    if not interview or interview.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Report not found")
        
    return report


@router.patch("/{report_id}", response_model=ReportResponse)
def update_report(
    report_id: uuid.UUID,
    report_in: ReportUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    report = db.get(Report, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    interview = db.get(Interview, report.interview_id)
    if not interview or interview.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Report not found")
        
    update_data = report_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(report, field, value)
        
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
