from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import time
import os

router = APIRouter(prefix="/api/agora", tags=["agora"])

# Get credentials from environment
APP_ID = os.getenv("AGORA_APP_ID")
APP_CERTIFICATE = os.getenv("AGORA_APP_CERTIFICATE")

class TokenRequest(BaseModel):
    channelName: str
    uid: int = None
    role: str = "publisher"  # "publisher" or "subscriber"


@router.post("/token")
def generate_agora_token(request: TokenRequest):
    """
    Generate Agora RTC token for video/voice channels
    
    - **channelName**: Name of the channel to join
    - **uid**: User ID (0 for auto-assign)
    - **role**: "publisher" (can send/receive) or "subscriber" (receive only)
    """
    
    if not APP_ID:
        raise HTTPException(
            status_code=500,
            detail="Agora APP_ID not configured. Set AGORA_APP_ID environment variable."
        )
    
    # If no certificate, return basic response (development mode)
    if not APP_CERTIFICATE:
        return {
            "token": None,  # Can join without token in dev
            "app_id": APP_ID,
            "channel": request.channelName,
            "uid": request.uid or 0,
            "note": "Development mode - no token required"
        }
    
    try:
        from agora_token_builder import RtcTokenBuilder
        
        # Generate UID if not provided
        uid = request.uid if request.uid else 0
        
        # Token expiry (24 hours)
        expiration_time_in_seconds = 3600 * 24
        current_timestamp = int(time.time())
        privilege_expired_ts = current_timestamp + expiration_time_in_seconds
        
        # Role: 1 = publisher, 2 = subscriber
        role = 1 if request.role == "publisher" else 2
        
        # Build token
        token = RtcTokenBuilder.buildTokenWithUid(
            APP_ID,
            APP_CERTIFICATE,
            request.channelName,
            uid,
            role,
            privilege_expired_ts
        )
        
        return {
            "token": token,
            "app_id": APP_ID,
            "channel": request.channelName,
            "uid": uid,
            "expiry": privilege_expired_ts
        }
        
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="agora-token-builder not installed. Run: pip install agora-token-builder"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate token: {str(e)}"
        )


@router.get("/app-id")
def get_app_id():
    """Get Agora App ID (safe to expose)"""
    if not APP_ID:
        raise HTTPException(404, "Agora not configured")
    return {"app_id": APP_ID}
