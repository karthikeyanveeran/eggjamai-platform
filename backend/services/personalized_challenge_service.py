import openai
from typing import List, Dict
from datetime import datetime, timedelta
import json
import random

from config import settings
from models.challenge import (
    PersonalizedChallengeRequest, Challenge, Quest, ChallengeType,
    SkillCategory, DifficultyLevel, PersonalGrowthPlan
)

openai.api_key = settings.OPENAI_API_KEY


class PersonalizedChallengeService:
    """Generate truly unique, AI-powered personalized challenges."""
    
    def __init__(self):
        self.model = settings.OPENAI_MODEL
    
    async def generate_daily_challenges(
        self, 
        request: PersonalizedChallengeRequest,
        count: int = 8
    ) -> List[Challenge]:
        """
        Generate completely unique challenges based on user profile.
        Each challenge is tailored to their interests, age, struggles, and goals.
        """
        prompt = self._build_challenge_prompt(request, count)
        
        try:
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a creative challenge designer who creates unique, personalized growth challenges for students."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.9,  # High creativity
                max_tokens=2000
            )
            
            challenges_data = json.loads(response.choices[0].message.content)
            challenges = self._parse_challenges(challenges_data, request)
            
            return challenges
            
        except Exception as e:
            print(f"Error generating challenges: {e}")
            return self._get_fallback_challenges(request, count)
    
    def _build_challenge_prompt(self, request: PersonalizedChallengeRequest, count: int) -> str:
        """Build a detailed prompt for AI challenge generation."""
        return f"""
Create {count} COMPLETELY UNIQUE and PERSONALIZED challenges for this student:

USER PROFILE:
- Age: {request.age}
- Interests: {', '.join(request.interests)}
- Personality: {', '.join(request.personality_traits or ['friendly', 'curious'])}
- Current Struggles: {', '.join(request.current_struggles or ['none mentioned'])}
- Goals: {', '.join(request.goals or ['personal growth'])}
- Skill Focus: {request.skill_category.value}
- Difficulty Level: {request.difficulty.value}

PREVIOUS CHALLENGES (avoid repetition):
{', '.join(request.previous_challenges[-10:]) if request.previous_challenges else 'None yet'}

RECENT CONVERSATION CONTEXT:
{request.conversation_context or 'No recent conversations'}

REQUIREMENTS:
1. Each challenge must be SPECIFIC to their interests and age
2. Make it feel like a GAME or ADVENTURE, not a chore
3. Include WHY this challenge matters TO THEM personally
4. Add creative elements (storytelling, mystery, surprise)
5. Some challenges should involve their hobbies/interests
6. Vary the difficulty and types
7. Make some challenges fun and unexpected
8. Include clear success criteria
9. Add helpful hints
10. Estimate time needed (5-30 minutes)

CHALLENGE TYPES TO MIX:
- Daily quick wins
- Photo proof challenges  
- Social challenges (involve friends/family)
- Creative challenges
- Learning challenges
- Kindness missions
- Self-discovery tasks

Return a JSON array of challenges with this structure:
[
  {{
    "title": "Unique creative title",
    "description": "Detailed, personalized description",
    "category": "{request.skill_category.value}",
    "challenge_type": "daily|proof|social|surprise",
    "difficulty": "{request.difficulty.value}",
    "points": 10-50,
    "estimated_time": 5-30,
    "requires_proof": true/false,
    "proof_type": "photo|video|text|null",
    "hints": ["helpful hint 1", "hint 2"],
    "why_this_matters": "Why this is important for THEM specifically",
    "success_criteria": "Clear criteria for completion",
    "related_to_user": "How this connects to their interests/goals"
  }}
]

Make each challenge feel like a mini-adventure!
"""
    
    def _parse_challenges(self, data: List[Dict], request: PersonalizedChallengeRequest) -> List[Challenge]:
        """Parse AI response into Challenge objects."""
        challenges = []
        for idx, item in enumerate(data):
            challenge = Challenge(
                id=f"{request.user_id}-{datetime.now().timestamp()}-{idx}",
                title=item['title'],
                description=item['description'],
                category=SkillCategory(item['category']),
                challenge_type=ChallengeType(item['challenge_type']),
                difficulty=DifficultyLevel(item['difficulty']),
                points=item['points'],
                estimated_time=item['estimated_time'],
                requires_proof=item['requires_proof'],
                proof_type=item.get('proof_type'),
                hints=item['hints'],
                why_this_matters=item['why_this_matters'],
                success_criteria=item['success_criteria'],
                related_to_user=item['related_to_user'],
                expires_at=datetime.now() + timedelta(hours=24)
            )
            challenges.append(challenge)
        
        return challenges
    
    async def generate_quest(
        self,
        user_id: str,
        age: int,
        interests: List[str],
        duration_days: int = 7
    ) -> Quest:
        """
        Generate a multi-day story-based quest.
        Each day builds on the previous, creating an engaging narrative.
        """
        prompt = f"""
Create a {duration_days}-day STORY-BASED QUEST for a {age}-year-old student interested in: {', '.join(interests)}.

This should feel like a video game quest with:
- An engaging story/theme
- Each day builds on the previous
- Character development
- Increasing challenge
- Epic conclusion

Return JSON:
{{
  "title": "Epic quest title",
  "story": "Engaging backstory (2-3 sentences)",
  "total_days": {duration_days},
  "chapters": [
    {{
      "day": 1,
      "chapter_title": "The Beginning",
      "challenge": "Day 1 task",
      "story_progress": "What happens after completing this",
      "reward": "Unlocks or points"
    }},
    ... (for each day)
  ],
  "final_reward": "Epic completion reward"
}}

Make it EXCITING and AGE-APPROPRIATE!
"""
        
        try:
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a creative game designer creating engaging quests for students."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.95,
                max_tokens=1500
            )
            
            quest_data = json.loads(response.choices[0].message.content)
            
            return Quest(
                id=f"quest-{user_id}-{datetime.now().timestamp()}",
                title=quest_data['title'],
                story=quest_data['story'],
                total_days=duration_days,
                current_day=1,
                chapters=quest_data['chapters'],
                rewards={"final": quest_data['final_reward']},
                unlocked=True
            )
            
        except Exception as e:
            print(f"Error generating quest: {e}")
            return self._get_fallback_quest(user_id, duration_days)
    
    async def generate_growth_plan(
        self,
        request: PersonalizedChallengeRequest
    ) -> PersonalGrowthPlan:
        """
        Generate a complete 4-week personalized growth plan.
        Each week progressively builds skills.
        """
        # This would generate week-by-week challenges
        # For now, return structure
        pass
    
    def _get_fallback_challenges(
        self, 
        request: PersonalizedChallengeRequest, 
        count: int
    ) -> List[Challenge]:
        """Fallback challenges if AI fails (Demo Mode)."""
        
        fallback_data = [
            {
                "title": "🎮 The Gaming Leader",
                "description": "Organize a friendly gaming tournament with 3 friends. Explain rules clearly and handle disputes.",
                "category": SkillCategory.SOFT_SKILLS,
                "challenge_type": ChallengeType.SOCIAL,
                "difficulty": DifficultyLevel.INTERMEDIATE,
                "points": 25,
                "estimated_time": 45,
                "requires_proof": True,
                "proof_type": "photo",
                "hints": ["Write rules down", "Be the referee"],
                "why_this_matters": "Builds leadership skills through your passion.",
                "success_criteria": "Tournament completed successfully",
                "related_to_user": "Connects gaming with leadership"
            },
            {
                "title": "🎵 Focus Playlist",
                "description": "Create a focus playlist and study for 25 minutes without distraction.",
                "category": SkillCategory.GOAL_SETTING,
                "challenge_type": ChallengeType.DAILY,
                "difficulty": DifficultyLevel.BEGINNER,
                "points": 15,
                "estimated_time": 30,
                "requires_proof": False,
                "proof_type": None,
                "hints": ["Use instrumental music", "Hide your phone"],
                "why_this_matters": "Improves concentration habits.",
                "success_criteria": "25 mins of focused work",
                "related_to_user": "Uses music to help study"
            },
            {
                "title": "📸 Creative Angle",
                "description": "Take 3 photos of the same object from completely different angles.",
                "category": SkillCategory.CREATIVITY,
                "challenge_type": ChallengeType.PROOF,
                "difficulty": DifficultyLevel.BEGINNER,
                "points": 20,
                "estimated_time": 15,
                "requires_proof": True,
                "proof_type": "photo",
                "hints": ["Look up, down, and close", "Lighting matters"],
                "why_this_matters": "Trains your eye to see perspective.",
                "success_criteria": "3 distinct photos uploaded",
                "related_to_user": "Express creativity"
            },
             {
                "title": "🏃‍♂️ Speed Walk",
                "description": "Go for a 15-minute brisk walk and notice 5 green things.",
                "category": SkillCategory.PHYSICAL,
                "challenge_type": ChallengeType.DAILY,
                "difficulty": DifficultyLevel.BEGINNER,
                "points": 10,
                "estimated_time": 15,
                "requires_proof": False,
                "proof_type": None,
                "hints": ["Walk fast enough to raise heart rate"],
                "why_this_matters": "Physical movement boosts mood.",
                "success_criteria": "Walk completed",
                "related_to_user": "Health goal"
            }
        ]
        
        challenges = []
        for idx, item in enumerate(fallback_data):
            # Simple personalization filter
            # In a real fallback, we might filter by interest more strictly
            if len(challenges) >= count:
                break
                
            challenge = Challenge(
                id=f"{request.user_id}-fallback-{idx}",
                title=item['title'],
                description=item['description'],
                category=item['category'],
                challenge_type=item['challenge_type'],
                difficulty=item['difficulty'],
                points=item['points'],
                estimated_time=item['estimated_time'],
                requires_proof=item['requires_proof'],
                proof_type=item['proof_type'],
                hints=item['hints'],
                why_this_matters=item['why_this_matters'],
                success_criteria=item['success_criteria'],
                related_to_user=item['related_to_user'],
                expires_at=datetime.now() + timedelta(hours=24)
            )
            challenges.append(challenge)
            
        return challenges
    
    def _get_fallback_quest(self, user_id: str, days: int) -> Quest:
        """Fallback quest if AI fails."""
        return Quest(
            id=f"quest-{user_id}-fallback",
            title="The Kindness Journey",
            story="Embark on a week-long adventure to spread kindness.",
            total_days=days,
            current_day=1,
            chapters=[{"day": i+1, "challenge": f"Day {i+1} kindness mission"} for i in range(days)],
            rewards={"final": "Kindness Champion Badge"},
            unlocked=True
        )


# Singleton instance
personalized_challenge_service = PersonalizedChallengeService()
