from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    """Message role in conversation."""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class RiskLevel(str, Enum):
    """Mental health risk levels."""
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Message(BaseModel):
    """Chat message model."""
    role: MessageRole
    content: str
    timestamp: Optional[datetime] = None
    risk_level: Optional[RiskLevel] = None


class ConversationRequest(BaseModel):
    """Request for a conversation turn."""
    message: str
    user_id: str
    session_id: Optional[str] = None
    language: str = "en"


class ConversationResponse(BaseModel):
    """Response from AI conversation."""
    message: str
    session_id: str
    risk_level: RiskLevel
    suggested_resources: Optional[List[str]] = None
    needs_counselor_attention: bool = False


class SessionHistory(BaseModel):
    """Conversation session history."""
    session_id: str
    user_id: str
    messages: List[Message]
    risk_level: RiskLevel
    created_at: datetime
    updated_at: datetime
