import openai
from typing import List, Dict, Optional
from datetime import datetime

from config import settings
from models.advanced_features import (
    StrengthProfile, CareerPathway, PurposeDiscoveryResult,
    ScreenTimeData, DetoxGoal, LearningDisabilityIndicators,
    CognitiveTestResult
)

openai.api_key = settings.OPENAI_API_KEY


class PurposeDiscoveryService:
    """Helps students find meaning and connect subjects to goals"""
    
    async def discover_purpose(
        self,
        user_id: str,
        age: int,
        interests: List[str],
        conversation_history: List[str],
        hobbies: List[str]
    ) -> PurposeDiscoveryResult:
        """Main purpose discovery flow"""
        
        # Analyze strengths from behavior
        strengths = await self._identify_strengths(conversation_history, interests)
        
        # Find matching careers
        careers = await self._match_careers(strengths, interests, age)
        
        # Connect current subjects to purpose
        subject_relevance = await self._explain_subject_relevance(careers[:3])
        
        return PurposeDiscoveryResult(
            user_id=user_id,
            interests=interests,
            strengths=strengths,
            top_career_matches=careers,
            current_subject_relevance=subject_relevance,
            next_exploration_steps=self._generate_next_steps(careers[:3])
        )
    
    async def _identify_strengths(
        self, 
        conversation_history: List[str],
        interests: List[str]
    ) -> StrengthProfile:
        """Analyze behavior patterns to identify strengths"""
        
        prompt = f"""Analyze this student's conversation patterns and interests to identify their natural strengths.

Conversation samples: {' '.join(conversation_history[-10:])}
Interests: {', '.join(interests)}

Rate each strength 0-10:
- Empathy (understanding others' feelings)
- Analytical thinking (logic, problem-solving)
- Creativity (original ideas, artistic)
- Leadership (inspiring, organizing)
- Technical aptitude (computers, mechanics)
- Social skills (communication, charisma)
- Resilience (handling setbacks)
- Curiosity (asking questions, exploring)

Return JSON with scores."""

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4
            )
            
            import json
            scores = json.loads(response.choices[0].message.content)
            
            return StrengthProfile(
                empathy_score=scores.get('empathy', 5) / 10,
                analytical_thinking=scores.get('analytical_thinking', 5) / 10,
                creativity=scores.get('creativity', 5) / 10,
                leadership=scores.get('leadership', 5) / 10,
                technical_aptitude=scores.get('technical_aptitude', 5) / 10,
                social_skills=scores.get('social_skills', 5) / 10,
                resilience=scores.get('resilience', 5) / 10,
                curiosity=scores.get('curiosity', 5) / 10
            )
        except:
            # Default balanced profile
            return StrengthProfile(
                empathy_score=0.5, analytical_thinking=0.5,
                creativity=0.5, leadership=0.5,
                technical_aptitude=0.5, social_skills=0.5,
                resilience=0.5, curiosity=0.5
            )
    
    async def _match_careers(
        self,
        strengths: StrengthProfile,
        interests: List[str],
        age: int
    ) -> List[CareerPathway]:
        """Match careers based on strengths and interests"""
        
        prompt = f"""Find 5 career pathways for a {age}-year-old with these traits:

Strengths:
- Empathy: {strengths.empathy_score * 10}/10
- Analytical: {strengths.analytical_thinking * 10}/10
- Creativity: {strengths.creativity * 10}/10
- Leadership: {strengths.leadership * 10}/10
- Technical: {strengths.technical_aptitude * 10}/10
- Social: {strengths.social_skills * 10}/10

Interests: {', '.join(interests)}

For each career, provide:
1. Career name
2. Why it's a good fit (specific to their profile)
3. Skills they already have
4. Skills they need to develop
5. Education pathway
6. Real role models from similar backgrounds
7. Salary range (Indian context)
8. Future outlook

Return as JSON array."""

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000
            )
            
            import json
            careers_data = json.loads(response.choices[0].message.content)
            
            careers = []
            for idx, career in enumerate(careers_data):
                match_score = self._calculate_match_score(career, strengths, interests)
                
                careers.append(CareerPathway(
                    career_name=career['career_name'],
                    match_percentage=match_score,
                    why_good_fit=career['why_good_fit'],
                    required_skills=career.get('required_skills', []),
                    current_student_skills=career.get('current_skills', []),
                    skill_gaps=career.get('skill_gaps', []),
                    education_path=career.get('education_path', []),
                    example_role_models=career.get('role_models', []),
                    salary_range=career.get('salary_range', 'Varies'),
                    growth_outlook=career.get('future_outlook', 'Growing')
                ))
            
            # Sort by match percentage
            careers.sort(key=lambda x: x.match_percentage, reverse=True)
            return careers
            
        except Exception as e:
            print(f"Error matching careers: {e}")
            return self._get_fallback_careers(interests)
    
    def _calculate_match_score(
        self,
        career: Dict,
        strengths: StrengthProfile,
        interests: List[str]
    ) -> float:
        """Calculate how well a career matches the student"""
        # Simple scoring based on mentioned interests
        score = 0.5  # Base score
        
        career_lower = career['career_name'].lower()
        for interest in interests:
            if interest.lower() in career_lower or interest.lower() in str(career.get('why_good_fit', '')).lower():
                score += 0.1
        
        return min(score * 100, 95)
    
    async def _explain_subject_relevance(
        self,
        top_careers: List[CareerPathway]
    ) -> Dict[str, str]:
        """Explain how school subjects relate to career goals"""
        
        subjects = ['Math', 'Science', 'English', 'History', 'Art', 'Physical Education']
        career_names = ', '.join([c.career_name for c in top_careers])
        
        prompt = f"""A student is interested in careers: {career_names}

Explain how each school subject is relevant to these careers:
{', '.join(subjects)}

For each subject, write 1-2 sentences showing SPECIFIC connections to their career interests.
Make it exciting and relevant, not generic.

Return as JSON: {{"subject": "explanation"}}"""

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=800
            )
            
            import json
            return json.loads(response.choices[0].message.content)
            
        except:
            return {subject: f"{subject} provides important foundational skills for your future career." for subject in subjects}
    
    def _generate_next_steps(self, careers: List[CareerPathway]) -> List[str]:
        """Generate actionable next steps"""
        steps = [
            f"Research more about: {careers[0].career_name}",
            f"Find a mentor or professional in {careers[0].career_name} to talk to",
            f"Take an online course or watch videos about {careers[0].career_name}",
            "Create a vision board with your career goals",
            "Set one small goal this week related to your interests"
        ]
        return steps
    
    def _get_fallback_careers(self, interests: List[str]) -> List[CareerPathway]:
        """Fallback careers if API fails"""
        return [
            CareerPathway(
                career_name="Choose based on your interests",
                match_percentage=70,
                why_good_fit="Your interests suggest you enjoy creative and analytical work",
                required_skills=["Communication", "Problem-solving"],
                current_student_skills=interests,
                skill_gaps=["Specific technical skills"],
                education_path=["High school", "Undergraduate degree", "Experience"],
                example_role_models=[{"name": "Various professionals"}],
                salary_range="₹3-10 LPA",
                growth_outlook="Varies by field"
            )
        ]


class DigitalDetoxService:
    """Helps students manage screen time and digital addiction"""
    
    def __init__(self):
        self.user_baselines = {}  # user_id -> baseline screen time
        self.goals = {}  # user_id -> DetoxGoal
    
    def set_baseline(self, user_id: str, daily_minutes: int):
        """Set initial baseline screen time"""
        self.user_baselines[user_id] = daily_minutes
        
        # Create initial goal (10% reduction)
        target = int(daily_minutes * 0.9)
        
        self.goals[user_id] = DetoxGoal(
            user_id=user_id,
            baseline_daily_minutes=daily_minutes,
            target_daily_minutes=target,
            current_daily_minutes=daily_minutes,
            reduction_percentage=0,
            alternative_activities=[],
            milestone_rewards=[]
        )
    
    def log_screen_time(self, user_id: str, data: ScreenTimeData):
        """Log daily screen time"""
        if user_id in self.goals:
            goal = self.goals[user_id]
            goal.current_daily_minutes = data.total_minutes
            goal.reduction_percentage = (
                (goal.baseline_daily_minutes - data.total_minutes) / 
                goal.baseline_daily_minutes * 100
            )
    
    async def get_personalized_tips(
        self,
        user_id: str,
        top_apps: List[str],
        peak_hours: List[int]
    ) -> List[str]:
        """Generate personalized screen time reduction tips"""
        
        prompt = f"""A student spends most time on: {', '.join(top_apps)}
Peak usage hours: {', '.join([f'{h}:00' for h in peak_hours])}

Give 5 specific, actionable tips to reduce screen time that:
1. Are realistic and gradual
2. Suggest replacement activities
3. Address their specific apps/patterns
4. Are non-judgmental and supportive

Return as JSON array of tip strings."""

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=500
            )
            
            import json
            return json.loads(response.choices[0].message.content)
            
        except:
            return [
                "Try setting a timer for 20 minutes before using your phone",
                "Replace 10 minutes of screen time with a quick walk",
                "Keep your phone in another room while studying",
                "Use app timers to limit usage",
                "Find one offline hobby to do for 15 minutes daily"
            ]
    
    def generate_replacement_activities(
        self,
        interests: List[str]
    ) -> List[str]:
        """Suggest offline activities based on interests"""
        activity_map = {
            'gaming': ['Play board games', 'Outdoor sports', 'Build something physical'],
            'music': ['Play an instrument', 'Sing', 'Attend live music'],
            'art': ['Draw/paint', 'Crafts', 'Visit museums'],
            'sports': ['Join a team', 'Exercise outdoors', 'Yoga'],
            'reading': ['Read physical books', 'Join book club', 'Library visits']
        }
        
        activities = []
        for interest in interests:
            if interest.lower() in activity_map:
                activities.extend(activity_map[interest.lower()])
        
        return activities[:5] if activities else [
            'Take a walk in nature',
            'Call a friend',
            'Cook something',
            'Exercise for 15 minutes',
            'Journal your thoughts'
        ]


class LearningDisabilityDetector:
    """Detects potential learning disabilities through interaction patterns"""
    
    def __init__(self):
        self.typing_patterns = {}
        self.cognitive_scores = {}
    
    def analyze_typing_pattern(
        self,
        user_id: str,
        text: str,
        typing_time_seconds: float
    ):
        """Analyze typing for dyslexia/dysgraphia markers"""
        
        if user_id not in self.typing_patterns:
            self.typing_patterns[user_id] = []
        
        # Calculate metrics
        words = text.split()
        wpm = len(words) / (typing_time_seconds / 60) if typing_time_seconds > 0 else 0
        
        # Check for common dyslexia markers
        letter_reversals = self._count_reversals(text)
        spelling_errors = self._count_spelling_errors(text)
        
        self.typing_patterns[user_id].append({
            'wpm': wpm,
            'reversals': letter_reversals,
            'spelling_errors': spelling_errors,
            'timestamp': datetime.now()
        })
    
    def _count_reversals(self, text: str) -> int:
        """Count common letter reversals (b/d, p/q, etc.)"""
        # This is simplified - real implementation would use ML
        reversals = 0
        text_lower = text.lower()
        
        # Common dyslexia patterns
        patterns = ['teh', 'taht', 'thier', 'freind']
        for pattern in patterns:
            reversals += text_lower.count(pattern)
        
        return reversals
    
    def _count_spelling_errors(self, text: str) -> int:
        """Estimate spelling errors"""
        # Simplified - real implementation would use spell checker
        return 0
    
    async def generate_screening_report(
        self,
        user_id: str
    ) -> LearningDisabilityIndicators:
        """Generate comprehensive screening report"""
        
        # Analyze collected data
        typing_data = self.typing_patterns.get(user_id, [])
        cognitive_data = self.cognitive_scores.get(user_id, [])
        
        # Calculate probabilities
        adhd_prob = self._calculate_adhd_probability(typing_data, cognitive_data)
        dyslexia_prob = self._calculate_dyslexia_probability(typing_data)
        dyscalculia_prob = 0.0  # Would need math test data
        
        recommendation = self._generate_recommendation(adhd_prob, dyslexia_prob)
        
        return LearningDisabilityIndicators(
            user_id=user_id,
            adhd_probability=adhd_prob,
            dyslexia_probability=dyslexia_prob,
            dyscalculia_probability=dyscalculia_prob,
            processing_disorder_probability=0.0,
            typing_pattern_anomalies={},
            speech_pattern_anomalies={},
            cognitive_test_results=cognitive_data,
            recommendation=recommendation,
            requires_professional_screening=adhd_prob > 0.6 or dyslexia_prob > 0.6
        )
    
    def _calculate_adhd_probability(
        self, 
        typing_data: List[Dict],
        cognitive_data: List[CognitiveTestResult]
    ) -> float:
        """Calculate ADHD probability from patterns"""
        # Simplified - real implementation would use ML model
        
        if not typing_data:
            return 0.0
        
        # Check for ADHD markers: inconsistent performance, attention lapses
        variation = 0.0
        if len(typing_data) > 5:
            wpms = [d['wpm'] for d in typing_data[-10:]]
            import statistics
            variation = statistics.stdev(wpms) if len(wpms) > 1 else 0
        
        # High variation suggests attention inconsistency
        if variation > 20:
            return 0.5
        return 0.2
    
    def _calculate_dyslexia_probability(self, typing_data: List[Dict]) -> float:
        """Calculate dyslexia probability"""
        if not typing_data:
            return 0.0
        
        recent = typing_data[-10:]
        avg_reversals = sum(d['reversals'] for d in recent) / len(recent)
        
        if avg_reversals > 3:
            return 0.7
        elif avg_reversals > 1:
            return 0.4
        return 0.1
    
    def _generate_recommendation(
        self,
        adhd_prob: float,
        dyslexia_prob: float
    ) -> str:
        """Generate recommendation text"""
        
        if adhd_prob > 0.6 or dyslexia_prob > 0.6:
            return f"""Based on interaction patterns, we recommend professional screening for potential learning differences. 

{'ADHD indicators detected. ' if adhd_prob > 0.6 else ''}{'Dyslexia markers observed. ' if dyslexia_prob > 0.6 else ''}

This is not a diagnosis - only a licensed professional can diagnose. However, early identification can provide helpful accommodations and support."""
        
        return "No significant learning disability markers detected at this time."


# Singleton instances
purpose_discovery_service = PurposeDiscoveryService()
digital_detox_service = DigitalDetoxService()
learning_disability_detector = LearningDisabilityDetector()
