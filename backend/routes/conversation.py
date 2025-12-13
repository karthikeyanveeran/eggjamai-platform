from fastapi import APIRouter, HTTPException
from typing import Dict
import uuid
from datetime import datetime

from models.conversation import (
    ConversationRequest, ConversationResponse, Message, 
    MessageRole, SessionHistory
)
from services.ai_service import ai_service

router = APIRouter(prefix="/api/conversation", tags=["conversation"])

# In-memory session storage (replace with Redis in production)
sessions: Dict[str, SessionHistory] = {}


@router.post("/chat", response_model=ConversationResponse)
async def chat(request: ConversationRequest):
    """
    Send a message and get AI response.
    """
    # Get or create session
    session_id = request.session_id or str(uuid.uuid4())
    
    if session_id not in sessions:
        sessions[session_id] = SessionHistory(
            session_id=session_id,
            user_id=request.user_id,
            messages=[],
            risk_level="none",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    
    session = sessions[session_id]
    
    # Add user message to history
    user_msg = Message(
        role=MessageRole.USER,
        content=request.message,
        timestamp=datetime.now()
    )
    session.messages.append(user_msg)
    
    # Get AI response with risk assessment
    ai_response, risk_level = await ai_service.get_response(
        user_message=request.message,
        conversation_history=session.messages,
        age_group="13-18",  # TODO: Get from user profile
        language=request.language
    )
    
    # Add AI response to history
    ai_msg = Message(
        role=MessageRole.ASSISTANT,
        content=ai_response,
        timestamp=datetime.now(),
        risk_level=risk_level
    )
    session.messages.append(ai_msg)
    
    # Update session risk level (take highest)
    if risk_level.value > session.risk_level:
        session.risk_level = risk_level
    
    session.updated_at = datetime.now()
    
    # Get crisis resources if needed
    resources = ai_service.get_crisis_resources(risk_level) if risk_level.value != "none" else None
    needs_attention = risk_level.value in ["high", "critical"]
    
    return ConversationResponse(
        message=ai_response,
        session_id=session_id,
        risk_level=risk_level,
        suggested_resources=resources,
        needs_counselor_attention=needs_attention
    )


@router.get("/history/{session_id}", response_model=SessionHistory)
async def get_history(session_id: str):
    """Get conversation history for a session."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return sessions[session_id]


@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a conversation session."""
    if session_id in sessions:
        del sessions[session_id]
        return {"message": "Session deleted successfully"}
    
    raise HTTPException(status_code=404, detail="Session not found")
