from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from models.db_models import MoodEntry
from database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/mood", tags=["mood"])

@router.post("/log")
async def log_mood(
    user_id: int = Body(...),
    mood_score: int = Body(...),
    emotions: List[str] = Body(default=[]),
    note: str = Body(default=""),
    db: Session = Depends(get_db)
):
    """Log a user's mood."""
    new_entry = MoodEntry(
        user_id=user_id,
        mood_score=mood_score,
        emotions=emotions,
        note=note,
        date=datetime.now()
    )
    
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    return {
        "message": "Mood logged successfully",
        "entry": {
            "id": new_entry.id,
            "mood_score": new_entry.mood_score,
            "emotions": new_entry.emotions,
            "date": new_entry.date
        }
    }

@router.get("/history/{user_id}")
async def get_mood_history(
    user_id: int,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Get mood history for a user."""
    cutoff_date = datetime.now() - timedelta(days=days)
    
    entries = db.query(MoodEntry).filter(
        MoodEntry.user_id == user_id,
        MoodEntry.date >= cutoff_date
    ).order_by(MoodEntry.date.asc()).all()
    
    return [
        {
            "id": e.id,
            "mood_score": e.mood_score,
            "emotions": e.emotions,
            "note": e.note,
            "date": e.date
        }
        for e in entries
    ]
