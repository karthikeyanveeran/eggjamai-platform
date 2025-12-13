from fastapi import APIRouter, HTTPException
from typing import List, Dict
import uuid
from datetime import datetime

from models.assessment import (
    AssessmentType, AssessmentQuestion, AssessmentSubmission,
    AssessmentResult
)
from services.assessment_service import assessment_service

router = APIRouter(prefix="/api/assessment", tags=["assessment"])

# In-memory storage (replace with database in production)
assessment_results: Dict[str, AssessmentResult] = {}


@router.get("/questions/{assessment_type}", response_model=List[AssessmentQuestion])
async def get_questions(assessment_type: AssessmentType):
    """Get questions for a specific assessment type."""
    questions = assessment_service.get_questions(assessment_type)
    
    if not questions:
        raise HTTPException(status_code=404, detail="Assessment type not found")
    
    return questions


@router.post("/submit", response_model=AssessmentResult)
async def submit_assessment(submission: AssessmentSubmission):
    """Submit assessment answers and get results."""
    # Calculate score and interpretation
    severity, interpretation, recommendations, needs_help = assessment_service.calculate_score(
        assessment_type=submission.assessment_type,
        answers=submission.answers
    )
    
    total_score = sum(answer.score for answer in submission.answers)
    
    # Create result
    result = AssessmentResult(
        id=str(uuid.uuid4()),
        user_id=submission.user_id,
        assessment_type=submission.assessment_type,
        total_score=total_score,
        severity_level=severity,
        interpretation=interpretation,
        recommendations=recommendations,
        needs_professional_help=needs_help,
        created_at=datetime.now()
    )
    
    # Store result
    assessment_results[result.id] = result
    
    return result


@router.get("/results/{user_id}", response_model=List[AssessmentResult])
async def get_user_results(user_id: str):
    """Get all assessment results for a user."""
    user_results = [
        result for result in assessment_results.values()
        if result.user_id == user_id
    ]
    
    return sorted(user_results, key=lambda x: x.created_at, reverse=True)


@router.get("/result/{result_id}", response_model=AssessmentResult)
async def get_result(result_id: str):
    """Get a specific assessment result."""
    if result_id not in assessment_results:
        raise HTTPException(status_code=404, detail="Result not found")
    
    return assessment_results[result_id]
