from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum


# ===== LEARNING DISABILITY DETECTION =====

class CognitiveTestType(str, Enum):
    WORKING_MEMORY = "working_memory"
    PROCESSING_SPEED = "processing_speed"
    ATTENTION = "attention"
    PATTERN_RECOGNITION = "pattern_recognition"


class CognitiveTestResult(BaseModel):
    test_type: CognitiveTestType
    score: float
    percentile: float
    reaction_time_ms: int
    error_count: int
    completed_at: datetime


class LearningDisabilityIndicators(BaseModel):
    user_id: str
    adhd_probability: float  # 0-1
    dyslexia_probability: float
    dyscalculia_probability: float
    processing_disorder_probability: float
    typing_pattern_anomalies: Dict
    speech_pattern_anomalies: Dict
    cognitive_test_results: List[CognitiveTestResult]
    recommendation: str
    requires_professional_screening: bool


# ===== ANXIETY & MENTAL HEALTH TRACKING =====

class MentalHealthBaseline(BaseModel):
    user_id: str
    baseline_mood: float  # 1-10
    typical_vocab: List[str]
    typical_typing_speed_wpm: float
    typical_session_frequency: float  # sessions per day
    typical_message_length: int
    established_at: datetime


class MentalHealthDeviation(BaseModel):
    user_id: str
    deviation_date: datetime
    mood_drop: float
    anxiety_increase: float
    depression_markers: List[str]
    risk_level: str  # low, moderate, high, critical
    intervention_triggered: bool
    counselor_notified: bool


# ===== PURPOSE DISCOVERY =====

class StrengthProfile(BaseModel):
    empathy_score: float
    analytical_thinking: float
    creativity: float
    leadership: float
    technical_aptitude: float
    social_skills: float
    resilience: float
    curiosity: float


class CareerPathway(BaseModel):
    career_name: str
    match_percentage: float
    why_good_fit: str
    required_skills: List[str]
    current_student_skills: List[str]
    skill_gaps: List[str]
    education_path: List[str]
    example_role_models: List[Dict]
    salary_range: str
    growth_outlook: str


class PurposeDiscoveryResult(BaseModel):
    user_id: str
    interests: List[str]
    strengths: StrengthProfile
    top_career_matches: List[CareerPathway]
    current_subject_relevance: Dict[str, str]  # subject -> why it matters
    next_exploration_steps: List[str]


# ===== DIGITAL DETOX =====

class ScreenTimeData(BaseModel):
    user_id: str
    date: datetime
    total_minutes: int
    by_app: Dict[str, int]
    peak_usage_hours: List[int]
    offline_achievements: List[str]


class DetoxGoal(BaseModel):
    user_id: str
    baseline_daily_minutes: int
    target_daily_minutes: int
    current_daily_minutes: int
    reduction_percentage: float
    alternative_activities: List[str]
    milestone_rewards: List[str]


# ===== PARENTAL MEDIATION =====

class ParentEducationContent(BaseModel):
    topic: str
    content: str
    research_citations: List[str]
    actionable_tips: List[str]
    sent_to_parent_id: str
    sent_at: datetime


class MediatedMessage(BaseModel):
    student_id: str
    parent_id: str
    original_student_draft: str
    ai_improved_version: str
    student_final_version: str
    tone_analysis: Dict
    sent: bool


# ===== PEER CIRCLES =====

class PeerCircle(BaseModel):
    circle_id: str
    name: str
    interest_focus: str
    member_ids: List[str]
    max_members: int
    is_anonymous: bool
    ai_moderator_active: bool
    challenges: List[str]
    created_at: datetime


class MessageModeration(BaseModel):
    message_id: str
    sender_id: str
    content: str
    toxicity_score: float
    flagged: bool
    flag_reason: Optional[str]
    suggested_alternative: Optional[str]


# ===== ACADEMIC SUPPORT =====

class ConceptGap(BaseModel):
    subject: str
    topic: str
    missing_concept: str
    severity: str  # critical, important, minor
    student_error_pattern: str
    prerequisite_concepts: List[str]


class TutoringSession(BaseModel):
    session_id: str
    user_id: str
    subject: str
    student_question: str
    identified_gaps: List[ConceptGap]
    teaching_approach: str  # socratic, direct, visual, etc.
    concepts_explained: List[str]
    student_understanding_score: float
    follow_up_needed: bool


# ===== EXAM ANXIETY PROGRAM =====

class AnxietyExposureLevel(BaseModel):
    level: int  # 1-10
    test_type: str
    stakes: str  # no stakes → exam stakes
    duration_minutes: int
    anxiety_triggers: List[str]


class CBTSession(BaseModel):
    session_id: str
    user_id: str
    anxiety_level_before: float
    anxiety_level_after: float
    technique_used: str  # breathing, cognitive restructuring, exposure
    biofeedback_data: Optional[Dict]
    progress_notes: str
