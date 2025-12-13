from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


class AssessmentType(str, Enum):
    """Types of mental health assessments."""
    PHQ9 = "phq9"  # Depression
    GAD7 = "gad7"  # Anxiety
    MOOD = "mood"  # Daily mood check


class SeverityLevel(str, Enum):
    """Severity levels for assessments."""
    MINIMAL = "minimal"
    MILD = "mild"
    MODERATE = "moderate"
    MODERATELY_SEVERE = "moderately_severe"
    SEVERE = "severe"


class AssessmentQuestion(BaseModel):
    """Assessment question model."""
    id: int
    question: str
    options: List[str]


class AssessmentAnswer(BaseModel):
    """User's answer to a question."""
    question_id: int
    score: int  # 0-3 for PHQ-9/GAD-7


class AssessmentSubmission(BaseModel):
    """Complete assessment submission."""
    user_id: str
    assessment_type: AssessmentType
    answers: List[AssessmentAnswer]
    language: str = "en"


class AssessmentResult(BaseModel):
    """Assessment result with interpretation."""
    id: str
    user_id: str
    assessment_type: AssessmentType
    total_score: int
    severity_level: SeverityLevel
    interpretation: str
    recommendations: List[str]
    needs_professional_help: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class MoodEntry(BaseModel):
    """Daily mood tracking entry."""
    user_id: str
    mood_level: int  # 1-10 scale
    emotions: List[str]
    notes: Optional[str] = None
    timestamp: datetime
