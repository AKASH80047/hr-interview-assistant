from __future__ import annotations
import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Recommendation = Literal["pending", "selected", "rejected", "hold"]


class NoteCreate(BaseModel):
    content: str = Field(min_length=1)
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    recommendation: Optional[Recommendation] = None


class NoteUpdate(BaseModel):
    content: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    recommendation: Optional[Recommendation] = None


class NoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    interview_id: uuid.UUID
    content: str
    rating: Optional[int]
    recommendation: Optional[Recommendation]
    created_at: datetime
    updated_at: datetime
