from typing import Dict, List, Optional
from datetime import datetime

class ExamAnxietyService:
    def __init__(self):
        # In-memory storage for demo purposes
        self.user_progress: Dict[str, Dict] = {}
        self.exposure_history: Dict[str, List] = {}
        
        self.levels = [
            {
                "level": 1,
                "name": "Beginner: No Pressure",
                "description": "Short quiz with no time limit. Just get comfortable with the format.",
                "duration": None,
                "questions": 5,
                "stakes": "Practice only - no scoring"
            },
            {
                "level": 2,
                "name": "Gentle Timer",
                "description": "Same quiz, but now with a generous 20-minute timer.",
                "duration": 1200,
                "questions": 5,
                "stakes": "Low pressure - plenty of time"
            },
            {
                "level": 3,
                "name": "Moderate Challenge",
                "description": "10 questions in 15 minutes. Building stamina.",
                "duration": 900,
                "questions": 10,
                "stakes": "Medium challenge"
            },
            {
                "level": 4,
                "name": "Real Exam Simulation",
                "description": "Full 20-question test in 20 minutes. Exam-like conditions.",
                "duration": 1200,
                "questions": 20,
                "stakes": "Simulated exam pressure"
            },
            {
                "level": 5,
                "name": "Master Level",
                "description": "Toughest questions, time pressure. You're ready!",
                "duration": 900,
                "questions": 15,
                "stakes": "High pressure - confidence building"
            }
        ]

    def get_levels(self) -> List[Dict]:
        return self.levels

    def get_user_progress(self, user_id: str) -> Dict:
        if user_id not in self.user_progress:
            self.user_progress[user_id] = {
                "completed_levels": [],
                "current_level": 1,
                "highest_anxiety": 0,
                "lowest_anxiety": 0
            }
        return self.user_progress[user_id]

    def start_exposure_session(self, user_id: str, level: int) -> Dict:
        # Generate mock questions for the session
        questions = []
        for i in range(1, 6):  # Just 5 questions for demo
            questions.append({
                "id": f"q{i}",
                "text": f"Sample Question {i} for Level {level}",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": "Option A"
            })
            
        return {
            "session_id": f"sess_{int(datetime.now().timestamp())}",
            "level": level,
            "questions": questions,
            "started_at": datetime.now().isoformat()
        }

    def submit_exposure_results(self, user_id: str, session_data: Dict) -> Dict:
        if user_id not in self.exposure_history:
            self.exposure_history[user_id] = []
            
        # Record history
        history_entry = {
            "timestamp": datetime.now().isoformat(),
            "level": session_data.get("level"),
            "pre_anxiety": session_data.get("pre_anxiety"),
            "post_anxiety": session_data.get("post_anxiety"),
            "duration": session_data.get("duration_seconds")
        }
        self.exposure_history[user_id].append(history_entry)
        
        # Update progress
        progress = self.get_user_progress(user_id)
        if session_data.get("level") not in progress["completed_levels"]:
            progress["completed_levels"].append(session_data.get("level"))
            
        # Unlock next level logic could go here
        
        return {
            "success": True,
            "message": "Session recorded",
            "progress": progress,
            "improvement": session_data.get("pre_anxiety", 0) - session_data.get("post_anxiety", 0)
        }

exam_anxiety_service = ExamAnxietyService()
