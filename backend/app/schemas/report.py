from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ReportBase(BaseModel):
    overall_score: Optional[int] = None
    technical_score: Optional[int] = None
    communication_score: Optional[int] = None
    problem_solving_score: Optional[int] = None
    role_fit_score: Optional[int] = None
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    recommended_follow_up: Optional[str] = None
    final_hr_notes: Optional[str] = None
    status: str = "pending"


class ReportCreate(ReportBase):
    interview_id: uuid.UUID


class ReportUpdate(BaseModel):
    overall_score: Optional[int] = None
    technical_score: Optional[int] = None
    communication_score: Optional[int] = None
    problem_solving_score: Optional[int] = None
    role_fit_score: Optional[int] = None
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    recommended_follow_up: Optional[str] = None
    final_hr_notes: Optional[str] = None
    status: Optional[str] = None


class ReportResponse(ReportBase):
    id: uuid.UUID
    interview_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
