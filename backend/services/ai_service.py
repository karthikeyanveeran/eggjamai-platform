import openai
from typing import List, Tuple
from datetime import datetime
import re

from config import settings
from models.conversation import Message, MessageRole, RiskLevel

# Initialize OpenAI client
openai.api_key = settings.OPENAI_API_KEY


class AIService:
    """Service for AI-powered mental health conversations."""
    
    # System prompts for different age groups
    SYSTEM_PROMPTS = {
        "3-12": """You are EggJam, a friendly and supportive AI companion for children. 
        Use simple language, be encouraging, and make mental wellness fun. 
        Help children identify their emotions and learn basic coping skills.
        Always be patient, kind, and age-appropriate.""",
        
        "13-18": """You are EggJam, an empathetic AI mental health companion for teenagers.
        Understand academic stress, peer pressure, identity issues, and family dynamics.
        Use evidence-based techniques like CBT and mindfulness.
        Be supportive, non-judgmental, and culturally sensitive to Indian contexts.""",
        
        "19-25": """You are EggJam, a professional AI mental health companion for young adults.
        Help with career anxiety, relationship issues, life transitions, and independence.
        Provide advanced therapeutic techniques, life skills guidance, and resource connections.
        Be mature, respectful, and culturally aware."""
    }
    
    # Crisis keywords for risk detection
    CRISIS_KEYWORDS = {
        "critical": ["suicide", "kill myself", "end my life", "want to die", "not worth living"],
        "high": ["self-harm", "hurt myself", "cutting", "harm", "hopeless"],
        "medium": ["depressed", "anxiety attack", "can't cope", "overwhelming", "can't go on"],
        "low": ["stressed", "worried", "sad", "anxious", "upset"]
    }
    
    def __init__(self):
        self.model = settings.OPENAI_MODEL
    
    async def get_response(
        self, 
        user_message: str, 
        conversation_history: List[Message],
        age_group: str = "13-18",
        language: str = "en"
    ) -> Tuple[str, RiskLevel]:
        """
        Get AI response to user message with risk assessment.
        
        Args:
            user_message: The user's message
            conversation_history: Previous messages in the conversation
            age_group: User's age group for appropriate tone
            language: Preferred language (future: multi-lingual support)
        
        Returns:
            Tuple of (AI response, risk level)
        """
        # Build messages for OpenAI
        messages = self._build_messages(user_message, conversation_history, age_group)
        
        # Get AI response
        try:
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            ai_response = response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI API Error: {e}")
            ai_response = "I'm here to listen. Could you tell me more about what you're experiencing?"
        
        # Assess risk level
        risk_level = self._assess_risk(user_message)
        
        return ai_response, risk_level
    
    def _build_messages(
        self, 
        user_message: str, 
        history: List[Message], 
        age_group: str
    ) -> List[dict]:
        """Build message list for OpenAI API."""
        messages = [
            {"role": "system", "content": self.SYSTEM_PROMPTS.get(age_group, self.SYSTEM_PROMPTS["13-18"])}
        ]
        
        # Add conversation history (last 10 messages)
        for msg in history[-10:]:
            messages.append({
                "role": msg.role.value if msg.role != MessageRole.SYSTEM else "system",
                "content": msg.content
            })
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        return messages
    
    def _assess_risk(self, message: str) -> RiskLevel:
        """
        Assess mental health risk level from user message.
        
        This is a basic keyword-based approach. In production, use ML models.
        """
        message_lower = message.lower()
        
        # Check for critical risk
        for keyword in self.CRISIS_KEYWORDS["critical"]:
            if keyword in message_lower:
                return RiskLevel.CRITICAL
        
        # Check for high risk
        for keyword in self.CRISIS_KEYWORDS["high"]:
            if keyword in message_lower:
                return RiskLevel.HIGH
        
        # Check for medium risk
        for keyword in self.CRISIS_KEYWORDS["medium"]:
            if keyword in message_lower:
                return RiskLevel.MEDIUM
        
        # Check for low risk
        for keyword in self.CRISIS_KEYWORDS["low"]:
            if keyword in message_lower:
                return RiskLevel.LOW
        
        return RiskLevel.NONE
    
    def get_crisis_resources(self, risk_level: RiskLevel) -> List[str]:
        """Get appropriate crisis resources based on risk level."""
        if risk_level == RiskLevel.CRITICAL:
            return [
                "National Suicide Prevention Helpline: 1-800-273-8255",
                "Crisis Text Line: Text HOME to 741741",
                "Emergency: 911 or go to nearest emergency room"
            ]
        elif risk_level == RiskLevel.HIGH:
            return [
                "Please consider talking to a counselor or mental health professional",
                "National Mental Health Helpline (India): 08046110007",
                "iCall Helpline: 9152987821"
            ]
        elif risk_level == RiskLevel.MEDIUM:
            return [
                "Consider scheduling a session with your school counselor",
                "Practice self-care and reach out to trusted friends/family"
            ]
        else:
            return []


# Global instance
ai_service = AIService()
