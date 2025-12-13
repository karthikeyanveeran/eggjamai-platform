import openai
from typing import List, Dict, Tuple
from datetime import datetime, timedelta
import numpy as np
from collections import defaultdict

from config import settings
from models.advanced_features import (
    MentalHealthBaseline, MentalHealthDeviation, 
    ConceptGap, TutoringSession, LearningDisabilityIndicators
)

openai.api_key = settings.OPENAI_API_KEY


class MentalHealthMonitor:
    """
    Early Warning System for Mental Health Issues
    Tracks baseline, detects deviations, triggers interventions
    """
    
    def __init__(self):
        self.baselines = {}  # user_id -> MentalHealthBaseline
        self.mood_history = defaultdict(list)
        
    async def analyze_session(
        self, 
        user_id: str,
        message: str,
        voice_tone: dict = None,
        typing_speed: float = None
    ) -> Tuple[float, str, bool]:
        """
        Analyze current session for mental health indicators
        Returns: (risk_score, risk_level, needs_intervention)
        """
        # Sentiment analysis
        sentiment = await self._analyze_sentiment(message)
        
        # Depression markers
        depression_score = self._check_depression_markers(message)
        
        # Anxiety markers
        anxiety_score = self._check_anxiety_markers(message)
        
        # Hopelessness/crisis language
        crisis_score = self._check_crisis_language(message)
        
        # Compare to baseline
        if user_id in self.baselines:
            deviation = self._calculate_deviation(
                user_id, sentiment, depression_score, anxiety_score
            )
        else:
            deviation = 0
        
        # Calculate overall risk
        risk_score = (depression_score * 0.4 + 
                     anxiety_score * 0.3 + 
                     crisis_score * 0.3)
        
        # Determine risk level
        if crisis_score > 0.8 or risk_score > 0.9:
            risk_level = "critical"
            needs_intervention = True
        elif risk_score > 0.7:
            risk_level = "high"
            needs_intervention = True
        elif risk_score > 0.5:
            risk_level = "moderate"
            needs_intervention = False
        else:
            risk_level = "low"
            needs_intervention = False
        
        # Store mood
        self.mood_history[user_id].append({
            'timestamp': datetime.now(),
            'sentiment': sentiment,
            'risk_score': risk_score
        })
        
        return risk_score, risk_level, needs_intervention
    
    async def _analyze_sentiment(self, text: str) -> float:
        """Use GPT to analyze sentiment deeply"""
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{
                    "role": "system",
                    "content": "Analyze the emotional tone. Return only a number 0-10 where 0=very negative, 5=neutral, 10=very positive."
                }, {
                    "role": "user",
                    "content": text
                }],
                temperature=0.3,
                max_tokens=10
            )
            
            sentiment = float(response.choices[0].message.content.strip())
            return min(max(sentiment, 0), 10) / 10  # Normalize to 0-1
            
        except:
            return 0.5  # Default neutral
    
    def _check_depression_markers(self, text: str) -> float:
        """Check for depression indicators"""
        markers = {
            'hopelessness': ['nothing matters', 'no point', 'give up', 'hopeless', 'pointless'],
            'anhedonia': ['don\'t care', 'not interested', 'boring', 'meh', 'whatever'],
            'fatigue': ['tired', 'exhausted', 'no energy', 'can\'t do', 'too much'],
            'worthlessness': ['useless', 'failure', 'stupid', 'worthless', 'hate myself'],
            'isolation': ['alone', 'no one', 'nobody cares', 'lonely']
        }
        
        text_lower = text.lower()
        score = 0
        
        for category, words in markers.items():
            if any(word in text_lower for word in words):
                score += 0.2
        
        return min(score, 1.0)
    
    def _check_anxiety_markers(self, text: str) -> float:
        """Check for anxiety indicators"""
        markers = {
            'worry': ['worried', 'anxious', 'scared', 'afraid', 'nervous'],
            'panic': ['panic', 'can\'t breathe', 'heart racing', 'overwhelming'],
            'catastrophizing': ['terrible', 'disaster', 'worst', 'always', 'never'],
            'avoidance': ['can\'t do it', 'too much', 'avoid', 'skip']
        }
        
        text_lower = text.lower()
        score = 0
        
        for category, words in markers.items():
            if any(word in text_lower for word in words):
                score += 0.25
        
        return min(score, 1.0)
    
    def _check_crisis_language(self, text: str) -> float:
        """Check for self-harm or suicidal ideation"""
        crisis_terms = [
            'kill myself', 'end it', 'suicide', 'self harm',
            'cut myself', 'die', 'not worth living', 'better off dead'
        ]
        
        text_lower = text.lower()
        
        if any(term in text_lower for term in crisis_terms):
            return 1.0
        
        return 0.0
    
    def _calculate_deviation(
        self, 
        user_id: str, 
        current_sentiment: float,
        depression_score: float,
        anxiety_score: float
    ) -> float:
        """Calculate deviation from baseline"""
        if user_id not in self.baselines:
            return 0
        
        baseline = self.baselines[user_id]
        
        # Get recent history (last 7 days)
        recent = [m for m in self.mood_history[user_id] 
                 if m['timestamp'] > datetime.now() - timedelta(days=7)]
        
        if not recent:
            return 0
        
        avg_recent_sentiment = np.mean([m['sentiment'] for m in recent])
        
        # Calculate mood drop from baseline
        mood_drop = baseline.baseline_mood - avg_recent_sentiment
        
        return max(mood_drop, 0)
    
    async def generate_intervention(
        self, 
        risk_level: str,
        context: str
    ) -> str:
        """Generate appropriate AI intervention response"""
        
        if risk_level == "critical":
            prompt = f"""You are a crisis counselor AI. A student is showing signs of severe distress or suicidal ideation.

Context: {context}

Respond with:
1. Immediate validation and support
2. Grounding technique or breathing exercise
3. Offer to connect them to immediate help
4. Provide crisis hotline numbers

Be warm, non-judgmental, and urgent about safety."""

        elif risk_level == "high":
            prompt = f"""A student is showing elevated signs of depression or anxiety.

Context: {context}

Respond with:
1. Empathetic acknowledgment
2. One small, achievable coping skill
3. Encourage them to talk about it
4. Suggest connecting with counselor

Be supportive and gentle."""

        else:
            prompt = f"""A student may be experiencing some stress.

Context: {context}

Respond with casual check-in and light support."""
        
        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are EggJam AI, a compassionate mental health support assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            # Fallback responses
            if risk_level == "critical":
                return """I'm really concerned about you right now. What you're feeling is real and important. 

Let's take a moment together - can you try taking 3 deep breaths with me?

I want to connect you with someone who can help immediately. The National Crisis Helpline is 08046110007. They're available 24/7.

You're not alone. I'm here. Will you talk to me about what's happening?"""
            
            return "I'm here to listen. How are you feeling right now?"


class AcademicTutor:
    """
    AI Tutor using Socratic Method
    Identifies concept gaps and teaches understanding
    """
    
    async def help_with_question(
        self,
        user_id: str,
        subject: str,
        question: str,
        grade_level: int
    ) -> Dict:
        """
        Main tutoring function
        Returns: teaching response, identified gaps, follow-up questions
        """
        
        # First, understand what they're asking
        understanding = await self._classify_question(question, subject)
        
        # Identify if there's a concept gap
        gaps = await self._identify_concept_gaps(question, subject, grade_level)
        
        # Generate Socratic teaching response
        teaching_response = await self._generate_teaching_response(
            question, subject, understanding, gaps, grade_level
        )
        
        return {
            'response': teaching_response,
            'identified_gaps': gaps,
            'suggested_practice': await self._suggest_practice(subject, gaps),
            'encouragement': self._generate_encouragement()
        }
    
    async def _classify_question(self, question: str, subject: str) -> Dict:
        """Understand what type of help they need"""
        prompt = f"""Classify this student question:

Subject: {subject}
Question: "{question}"

Return JSON:
{{
    "type": "concept_explanation|problem_solving|verification|general_confusion",
    "specific_topic": "the exact topic",
    "difficulty": "basic|intermediate|advanced"
}}"""

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            import json
            return json.loads(response.choices[0].message.content)
        except:
            return {"type": "general_confusion", "specific_topic": subject, "difficulty": "intermediate"}
    
    async def _identify_concept_gaps(
        self, 
        question: str, 
        subject: str,
        grade_level: int
    ) -> List[ConceptGap]:
        """Identify missing prerequisite knowledge"""
        
        prompt = f"""A grade {grade_level} student asks: "{question}"

What prerequisite concepts might they be missing? Return JSON array:
[
    {{
        "missing_concept": "name of concept",
        "severity": "critical|important|minor",
        "why_needed": "explanation"
    }}
]"""

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4
            )
            
            import json
            gaps_data = json.loads(response.choices[0].message.content)
            
            return [
                ConceptGap(
                    subject=subject,
                    topic=gap['missing_concept'],
                    missing_concept=gap['missing_concept'],
                    severity=gap['severity'],
                    student_error_pattern=question,
                    prerequisite_concepts=[]
                )
                for gap in gaps_data
            ]
        except:
            return []
    
    async def _generate_teaching_response(
        self,
        question: str,
        subject: str,
        understanding: Dict,
        gaps: List[ConceptGap],
        grade_level: int
    ) -> str:
        """Generate Socratic teaching response"""
        
        gap_context = "\n".join([f"- Missing: {g.missing_concept}" for g in gaps]) if gaps else "No major gaps detected"
        
        prompt = f"""You are an expert tutor. A grade {grade_level} student asks:

"{question}"

Question type: {understanding.get('type', 'general')}
Topic: {understanding.get('specific_topic', subject)}
Potential gaps: {gap_context}

Respond using the Socratic Method:
1. Don't give the answer directly
2. Ask a guiding question that helps them discover it
3. If there's a concept gap, explain it simply with an analogy
4. Be encouraging and age-appropriate
5. Make it conversational, not lecture-y

Keep response under 150 words."""

        try:
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a patient, Socratic tutor who helps students discover answers."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=300
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"Great question! Let's think about this together. What do you already know about {subject}? Let's start from there."
    
    async def _suggest_practice(self, subject: str, gaps: List[ConceptGap]) -> List[str]:
        """Suggest practice problems or resources"""
        if not gaps:
            return [
                f"Try 2-3 similar {subject} problems",
                "Explain the concept to a friend",
                "Create a visual mind map"
            ]
        
        suggestions = []
        for gap in gaps[:2]:  # Top 2 gaps
            suggestions.append(f"Review: {gap.missing_concept}")
            suggestions.append(f"Practice problems on: {gap.topic}")
        
        return suggestions
    
    def _generate_encouragement(self) -> str:
        """Random encouraging message"""
        messages = [
            "You're asking great questions - that's how real learning happens!",
            "I can see you're thinking deeply about this. That's awesome!",
            "Asking for help is a strength, not a weakness. Keep it up!",
            "Every expert was once a beginner. You're building your expertise!",
            "Struggling means you're growing. Your brain is strengthening!"
        ]
        
        import random
        return random.choice(messages)


# Singleton instances
mental_health_monitor = MentalHealthMonitor()
academic_tutor = AcademicTutor()
