from __future__ import annotations
import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

ReminderType = Literal["24_hour", "1_hour", "15_minute", "at_time"]
ReminderStatus = Literal["pending", "delivered", "acknowledged", "cancelled", "skipped"]


class ReminderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    interview_id: uuid.UUID
    reminder_type: ReminderType
    scheduled_for: datetime
    status: ReminderStatus
    delivered_at: Optional[datetime]
    acknowledged_at: Optional[datetime]

    candidate_name: str
    candidate_role: str
    interview_scheduled_at: datetime
    meeting_link: Optional[str]
