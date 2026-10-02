from __future__ import annotations
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.question_bank import QuestionBank
from app.models.user import User
from app.schemas.question_bank import QuestionBankCreate, QuestionBankResponse, QuestionBankUpdate

router = APIRouter(prefix="/question-bank", tags=["question_bank"])


@router.post("", response_model=QuestionBankResponse, status_code=status.HTTP_201_CREATED)
def create_question(
    question_in: QuestionBankCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    question = QuestionBank(owner_id=current_user.id, **question_in.model_dump())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@router.get("", response_model=list[QuestionBankResponse])
def read_questions(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    query = select(QuestionBank).where(QuestionBank.owner_id == current_user.id)
    if category:
        query = query.where(QuestionBank.category == category)
    result = db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()


@router.get("/{question_id}", response_model=QuestionBankResponse)
def read_question(
    question_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    question = db.get(QuestionBank, question_id)
    if not question or question.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


@router.patch("/{question_id}", response_model=QuestionBankResponse)
def update_question(
    question_id: uuid.UUID,
    question_in: QuestionBankUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    question = db.get(QuestionBank, question_id)
    if not question or question.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Question not found")
        
    update_data = question_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(question, field, value)
        
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    question = db.get(QuestionBank, question_id)
    if not question or question.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(question)
    db.commit()
