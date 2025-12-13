from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


class ChallengeType(str, Enum):
    """Types of challenges."""
    DAILY = "daily"
    QUEST = "quest"  # Multi-day story-based
    SOCIAL = "social"  # Involves others
    PROOF = "proof"  # Requires photo/video
    SURPRISE = "surprise"  # Random unique
    COMMUNITY = "community"  # Bigger impact


class SkillCategory(str, Enum):
    """Life skill categories."""
    CIVIC_SENSE = "civic_sense"
    ROAD_MANNERS = "road_manners"
    SOFT_SKILLS = "soft_skills"
    DINING_MANNERS = "dining_manners"
    COMMUNICATION = "communication"
    VISION = "vision"
    GOAL_SETTING = "goal_setting"
    CONFLICT_RESOLUTION = "conflict_resolution"


class DifficultyLevel(str, Enum):
    """Challenge difficulty."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class PersonalizedChallengeRequest(BaseModel):
    """Request for AI-generated personalized challenges."""
    user_id: str
    age: int
    interests: List[str]
    current_struggles: Optional[List[str]] = []
    personality_traits: Optional[List[str]] = []
    skill_category: SkillCategory
    difficulty: DifficultyLevel
    previous_challenges: Optional[List[str]] = []
    conversation_context: Optional[str] = None
    goals: Optional[List[str]] = []


class Challenge(BaseModel):
    """A personalized challenge."""
    id: str
    title: str
    description: str
    category: SkillCategory
    challenge_type: ChallengeType
    difficulty: DifficultyLevel
    points: int
    estimated_time: int  # minutes
    requires_proof: bool
    proof_type: Optional[str] = None  # photo, video, text
    hints: List[str]
    why_this_matters: str
    success_criteria: str
    related_to_user: str  # Why this is personalized for them
    expires_at: Optional[datetime] = None


class Quest(BaseModel):
    """Multi-day story-based challenge quest."""
    id: str
    title: str
    story: str
    total_days: int
    current_day: int
    chapters: List[dict]  # Each day's challenge
    rewards: dict
    unlocked: bool = False


class ChallengeCompletion(BaseModel):
    """Challenge completion submission."""
    user_id: str
    challenge_id: str
    completed_at: datetime
    proof_url: Optional[str] = None
    reflection: Optional[str] = None
    difficulty_rating: Optional[int] = None  # 1-5
    enjoyment_rating: Optional[int] = None  # 1-5


class PersonalGrowthPlan(BaseModel):
    """AI-generated personal development plan."""
    user_id: str
    focus_areas: List[SkillCategory]
    week_1_challenges: List[Challenge]
    week_2_challenges: List[Challenge]
    week_3_challenges: List[Challenge]
    week_4_challenges: List[Challenge]
    monthly_goal: str
    why_this_plan: str
    expected_outcomes: List[str]
