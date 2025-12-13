from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
import uuid

from models.challenge import (
    PersonalizedChallengeRequest, Challenge, Quest,
    ChallengeCompletion, SkillCategory, DifficultyLevel
)
from services.personalized_challenge_service import personalized_challenge_service

router = APIRouter(prefix="/api/challenges", tags=["personalized_challenges"])


@router.post("/generate", response_model=List[Challenge])
async def generate_personalized_challenges(request: PersonalizedChallengeRequest):
    """
    Generate completely unique challenges tailored to the user.
    No two users will get the same challenges!
    """
    challenges = await personalized_challenge_service.generate_daily_challenges(
        request=request,
        count=8
    )
    
    return challenges


@router.post("/quest/generate", response_model=Quest)
async def generate_quest(
    user_id: str,
    age: int,
    interests: List[str],
    duration_days: int = 7
):
    """
    Generate a multi-day story-based quest.
    Each day builds on the previous with an engaging narrative.
    """
    quest = await personalized_challenge_service.generate_quest(
        user_id=user_id,
        age=age,
        interests=interests,
        duration_days=duration_days
    )
    
    return quest


# In-memory storage for completed challenges (replace with DB in production)
completed_challenges_db = {}

@router.post("/complete")
async def complete_challenge(completion: ChallengeCompletion):
    """
    Mark a challenge as complete with optional proof and reflection.
    """
    if completion.user_id not in completed_challenges_db:
        completed_challenges_db[completion.user_id] = []
    
    # Check if already completed
    if completion.challenge_id not in completed_challenges_db[completion.user_id]:
        completed_challenges_db[completion.user_id].append(completion.challenge_id)
    
    return {
        "success": True,
        "points_earned": 10,
        "message": "Amazing work! Challenge completed!",
        "next_unlock": "2 more challenges to unlock epic badge!"
    }


@router.get("/completed/{user_id}")
async def get_completed_challenges(user_id: str):
    """
    Get list of completed challenge IDs for a user.
    """
    return completed_challenges_db.get(user_id, [])


@router.get("/surprise/{user_id}")
async def get_surprise_challenge(user_id: str, interests: List[str] = []):
    """
    Get a completely random, unique surprise challenge.
    These are one-time, never-repeating challenges.
    """
    # Generate a single unique challenge
    request = PersonalizedChallengeRequest(
        user_id=user_id,
        age=15,  # TODO: Get from user profile
        interests=interests or ["music", "sports"],
        skill_category=SkillCategory.SOFT_SKILLS,
        difficulty=DifficultyLevel.INTERMEDIATE
    )
    
    challenges = await personalized_challenge_service.generate_daily_challenges(
        request=request,
        count=1
    )
    
    return challenges[0] if challenges else None
