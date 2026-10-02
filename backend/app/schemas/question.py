from __future__ import annotations
from typing import Optional
import uuid

from pydantic import BaseModel, ConfigDict, Field


class QuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    interview_id: uuid.UUID
    question_text: str
    category: str
    rationale: Optional[str]
    order_index: int
    candidate_answer: Optional[str] = None
    score: Optional[int] = None
    feedback: Optional[str] = None


class QuestionUpdate(BaseModel):
    candidate_answer: Optional[str] = None
    score: Optional[int] = None
    feedback: Optional[str] = None


class QuestionCreate(BaseModel):
    question_text: str = Field(min_length=1, max_length=2000)
    category: str = Field(default="technical", min_length=1, max_length=30)
    rationale: Optional[str] = Field(default=None, max_length=2000)
