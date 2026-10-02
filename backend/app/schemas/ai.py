from __future__ import annotations
from typing import Optional
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AIGenerationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    kind: str
    status: str
    content: Optional[dict]
    error_message: Optional[str]
    model_name: Optional[str]
    created_at: datetime


class CandidateSummaryContent(BaseModel):
    overview: str
    technical_skills: list[dict] = []
    relevant_experience: list[dict] = []
    projects: list[dict] = []
    skills: list[str] = []
    experience_years: Optional[float] = None
    education: list[str] = []
    relevant_technologies: list[str] = []
    strengths: list[dict | str] = []
    suggested_interview_areas: list[str] = []
    interview_focus_areas: list[str] = []
    missing_information: list[str] = []


class GeneratedQuestion(BaseModel):
    question_text: str
    category: str = "technical"
    rationale: str


class QuestionsContent(BaseModel):
    questions: list[GeneratedQuestion]


class QuestionGenerationRequest(BaseModel):
    target_job_role: Optional[str] = Field(default=None, min_length=1, max_length=150)


class QuestionSaveItem(BaseModel):
    question_text: str = Field(min_length=1, max_length=2000)
    category: str = Field(default="technical", min_length=1, max_length=30)
    rationale: Optional[str] = Field(default=None, max_length=2000)


class PostInterviewSummaryContent(BaseModel):
    overview: str = Field(min_length=1, max_length=10000)
    skills_discussed: list[str] = Field(default_factory=list, max_length=50)
    candidate_responses_observations: list[str] = Field(default_factory=list, max_length=50)
    strengths: list[str] = Field(default_factory=list, max_length=50)
    areas_for_further_assessment: list[str] = Field(default_factory=list, max_length=50)
    suggested_follow_up_topics: list[str] = Field(default_factory=list, max_length=50)
