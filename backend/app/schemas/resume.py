from __future__ import annotations
import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

ParseStatus = Literal["not_started", "processing", "completed", "failed"]


class ResumeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    candidate_id: uuid.UUID
    original_filename: str
    file_size_bytes: Optional[int]
    parse_status: ParseStatus
    parse_error: Optional[str]
    extracted_text: Optional[str]
    parsed_data: Optional[dict]
    created_at: datetime
