from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class QuestionBankBase(BaseModel):
    question: str
    category: str
    difficulty: str
    expected_answer: Optional[str] = None
    evaluation_criteria: Optional[str] = None
    skills: Optional[str] = None
    job_role: Optional[str] = None


class QuestionBankCreate(QuestionBankBase):
    pass


class QuestionBankUpdate(BaseModel):
    question: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[str] = None
    expected_answer: Optional[str] = None
    evaluation_criteria: Optional[str] = None
    skills: Optional[str] = None
    job_role: Optional[str] = None


class QuestionBankResponse(QuestionBankBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
