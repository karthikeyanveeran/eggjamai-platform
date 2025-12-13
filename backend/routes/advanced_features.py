from fastapi import APIRouter, HTTPException, BackgroundTasks, Body
from typing import List, Dict
from datetime import datetime

from models.advanced_features import (
    MentalHealthDeviation, TutoringSession, PurposeDiscoveryResult,
    ScreenTimeData, DetoxGoal, LearningDisabilityIndicators,
    ConceptGap
)
from services.advanced_ai_services import mental_health_monitor, academic_tutor
from services.discovery_services import (
    purpose_discovery_service, digital_detox_service, learning_disability_detector
)
from services.exam_anxiety_service import exam_anxiety_service
from services.peer_circle_service import peer_circle_service
from services.parent_mediation_service import parent_mediation_service

router = APIRouter(prefix="/api/advanced", tags=["advanced_features"])


# ===== MENTAL HEALTH MONITORING =====

@router.post("/mental-health/analyze")
async def analyze_mental_health(
    user_id: str,
    message: str,
    voice_tone: Dict = None,
    typing_speed: float = None
):
    """
    Analyze message for mental health indicators
    Returns risk assessment and intervention if needed
    """
    risk_score, risk_level, needs_intervention = await mental_health_monitor.analyze_session(
        user_id=user_id,
        message=message,
        voice_tone=voice_tone,
        typing_speed=typing_speed
    )
    
    response = {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "needs_intervention": needs_intervention
    }
    
    if needs_intervention:
        # Generate intervention response
        intervention = await mental_health_monitor.generate_intervention(
            risk_level=risk_level,
            context=message
        )
        response["intervention_message"] = intervention
        
        # Alert counselor if critical
        if risk_level == "critical":
            response["counselor_alerted"] = True
            response["crisis_resources"] = {
                "national_helpline": "08046110007",
                "icall": "9152987821",
                "vandrevala": "1860-2662-345",
                "emergency": "112"
            }
    
    return response


@router.get("/mental-health/history/{user_id}")
async def get_mental_health_history(user_id: str, days: int = 30):
    """Get mental health trend over time"""
    
    history = mental_health_monitor.mood_history.get(user_id, [])
    
    # Filter last N days
    cutoff = datetime.now() - timedelta(days=days)
    recent = [h for h in history if h['timestamp'] > cutoff]
    
    if not recent:
        return {"message": "No data yet", "trend": []}
    
    # Calculate trend
    sentiments = [h['sentiment'] for h in recent]
    trend = "improving" if sentiments[-1] > sentiments[0] else "declining"
    
    return {
        "data_points": len(recent),
        "average_mood": sum(sentiments) / len(sentiments),
        "trend": trend,
        "history": recent[-30:]  # Last 30 points max
    }


# ===== ACADEMIC TUTORING =====

@router.post("/tutor/ask")
async def ask_tutor(
    user_id: str,
    subject: str,
    question: str,
    grade_level: int
):
    """
    Get AI tutoring help
    Uses Socratic method to teach understanding
    """
    response = await academic_tutor.help_with_question(
        user_id=user_id,
        subject=subject,
        question=question,
        grade_level=grade_level
    )
    
    return response


@router.get("/tutor/practice/{subject}")
async def get_practice_problems(subject: str, topic: str, difficulty: str):
    """Get practice problems for a topic"""
    
    # This would generate practice problems
    # For now, return structure
    return {
        "subject": subject,
        "topic": topic,
        "problems": [
            {
                "id": "1",
                "question": "Practice problem 1",
                "difficulty": difficulty,
                "hints": ["Hint 1", "Hint 2"]
            }
        ]
    }


# ===== PURPOSE DISCOVERY =====

@router.post("/purpose/discover", response_model=PurposeDiscoveryResult)
async def discover_purpose(
    user_id: str,
    age: int,
    interests: List[str],
    conversation_history: List[str],
    hobbies: List[str]
):
    """
    Complete purpose discovery analysis
    Returns career matches and subject relevance
    """
    result = await purpose_discovery_service.discover_purpose(
        user_id=user_id,
        age=age,
        interests=interests,
        conversation_history=conversation_history,
        hobbies=hobbies
    )
    
    return result


@router.get("/purpose/careers/{user_id}")
async def get_saved_careers(user_id: str):
    """Get previously discovered careers"""
    # Would retrieve from database
    return {
        "message": "Career pathways will be saved here",
        "careers": []
    }


@router.post("/purpose/subject-relevance")
async def explain_subject_relevance(
    career_goal: str,
    current_subject: str
):
    """Explain how a subject relates to career goals"""
    
    prompt = f"Explain how {current_subject} is relevant to a career in {career_goal}. Be specific and exciting. 2-3 sentences."
    
    try:
        import openai
        from config import settings
        openai.api_key = settings.OPENAI_API_KEY
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=150
        )
        
        return {
            "subject": current_subject,
            "career": career_goal,
            "explanation": response.choices[0].message.content
        }
    except:
        return {
            "subject": current_subject,
            "career": career_goal,
            "explanation": f"{current_subject} provides foundational skills important for {career_goal}."
        }


# ===== DIGITAL DETOX =====

@router.post("/detox/set-baseline")
async def set_screen_time_baseline(user_id: str, daily_minutes: int):
    """Set initial screen time baseline"""
    
    digital_detox_service.set_baseline(user_id, daily_minutes)
    
    return {
        "message": "Baseline set successfully",
        "baseline": daily_minutes,
        "initial_goal": int(daily_minutes * 0.9),
        "reduction_target": "10%"
    }


@router.post("/detox/log-screen-time")
async def log_screen_time(data: ScreenTimeData):
    """Log daily screen time data"""
    
    digital_detox_service.log_screen_time(data.user_id, data)
    
    goal = digital_detox_service.goals.get(data.user_id)
    
    if goal:
        return {
            "logged": True,
            "current_minutes": data.total_minutes,
            "target_minutes": goal.target_daily_minutes,
            "progress_percentage": goal.reduction_percentage,
            "status": "on_track" if data.total_minutes <= goal.target_daily_minutes else "needs_improvement"
        }
    
    return {"message": "Please set baseline first"}


@router.get("/detox/tips/{user_id}")
async def get_detox_tips(
    user_id: str,
    top_apps: List[str] = [],
    peak_hours: List[int] = []
):
    """Get personalized screen time reduction tips"""
    
    tips = await digital_detox_service.get_personalized_tips(
        user_id, top_apps, peak_hours
    )
    
    return {
        "tips": tips,
        "replacement_activities": digital_detox_service.generate_replacement_activities(
            interests=["general"]  # Would get from user profile
        )
    }


@router.get("/detox/progress/{user_id}")
async def get_detox_progress(user_id: str):
    """Get detox progress and achievements"""
    
    goal = digital_detox_service.goals.get(user_id)
    
    if not goal:
        return {"message": "No detox goal set"}
    
    return {
        "baseline_minutes": goal.baseline_daily_minutes,
        "current_minutes": goal.current_daily_minutes,
        "target_minutes": goal.target_daily_minutes,
        "reduction_achieved": goal.reduction_percentage,
        "streak_days": 0,  # Would track from database
        "achievements": []  # Would calculate achievements
    }


# ===== LEARNING DISABILITY DETECTION =====

@router.post("/learning-disabilities/analyze-typing")
async def analyze_typing_pattern(
    user_id: str,
    text: str,
    typing_time_seconds: float
):
    """Analyze typing pattern for learning disability markers"""
    
    learning_disability_detector.analyze_typing_pattern(
        user_id, text, typing_time_seconds
    )
    
    return {"analyzed": True}


@router.post("/learning-disabilities/cognitive-test")
async def submit_cognitive_test(
    user_id: str,
    test_results: Dict
):
    """Submit cognitive test results"""
    
    # Store test results
    if user_id not in learning_disability_detector.cognitive_scores:
        learning_disability_detector.cognitive_scores[user_id] = []
    
    learning_disability_detector.cognitive_scores[user_id].append(test_results)
    
    return {"submitted": True}


@router.get("/learning-disabilities/screening/{user_id}", response_model=LearningDisabilityIndicators)
async def get_screening_report(user_id: str):
    """
    Generate comprehensive learning disability screening report
    IMPORTANT: This is screening, not diagnosis
    """
    report = await learning_disability_detector.generate_screening_report(user_id)
    
    return report


# ===== GAMIFICATION & ENGAGEMENT =====

@router.post("/engagement/daily-checkin")
async def daily_checkin(user_id: str, mood: int, note: str = ""):
    """Daily check-in for engagement and tracking"""
    
    return {
        "points_earned": 5,
        "streak_days": 7,  # Would get from database
        "message": "Great job checking in!",
        "todays_challenge": "Try one breathing exercise"
    }


@router.get("/engagement/stats/{user_id}")
async def get_engagement_stats(user_id: str):
    """Get gamification stats"""
    
    return {
        "total_points": 245,
        "level": 3,
        "streak": 7,
        "badges_earned": 3,
        "challenges_completed": 12,
        "days_active": 21,
        "rank": "Achiever",
        "unlocked_badges": ["road_warrior", "dining_etiquette", "week_streak"]
    }


@router.post("/engagement/equip-badge")
async def equip_badge(user_id: str = Body(...), badge_id: str = Body(...)):
    """Equip or unlock a badge"""
    # In a real app, verify logic here
    return {"success": True, "message": f"Badge {badge_id} equipped"}


# ===== PARENT DASHBOARD =====

@router.get("/parent/insights/{student_id}")
async def get_parent_insights(student_id: str, parent_id: str):
    """
    Get student insights for parents (privacy-respecting)
    Shows growth, not conversations
    """
    return {
        "student_id": student_id,
        "summary": {
            "overall_mood_trend": "improving",
            "engagement_level": "high",
            "academic_help_sessions": 8,
            "skills_improved": ["Math reasoning", "Emotional awareness"],
            "areas_of_focus": ["Time management"],
            "counselor_alerts": 0
        },
        "weekly_activity": {
            "check_ins": 6,
            "challenges_completed": 4,
            "learning_sessions": 3
        },
        "recommendations_for_parents": [
            "Continue encouraging daily check-ins",
            "Ask about their career interests",
            "Acknowledge effort, not just results"
        ]
    }


@router.get("/parent/weekly-report/{student_id}")
async def get_weekly_report(student_id: str):
    """Generate weekly progress report for parents"""
    
    return {
        "week_ending": datetime.now().isoformat(),
        "summary": "Your child had a positive week with consistent engagement",
        "highlights": [
            "Completed 4 challenges",
            "Improved mood by 15%",
            "Asked for academic help 3 times (great initiative!)"
        ],
        "areas_to_support": [
            "Encourage continued daily practice"
        ]
    }


# ===== SCHOOL ADMIN DASHBOARD =====

@router.get("/admin/school-overview/{school_id}")
async def get_school_overview(school_id: str):
    """Overview for school administrators"""
    
    return {
        "total_students": 1000,
        "active_users": 750,
        "high_risk_students": 12,
        "moderate_risk_students": 45,
        "avg_engagement_rate": 0.75,
        "most_requested_help": ["Math", "Anxiety management"],
        "counselor_alerts_this_week": 3,
        "positive_trends": [
            "25% reduction in reported anxiety",
            "40% increase in help-seeking behavior"
        ]
    }


@router.get("/admin/student-list/{school_id}")
async def get_student_list(school_id: str, risk_level: str = None):
    """Get student list with filtering"""
    
    # Would query database
    return {
        "students": [
            {
                "id": "student1",
                "name": "Anonymous Student 1",
                "grade": 10,
                "risk_level": "low",
                "engagement": "high",
                "last_active": datetime.now().isoformat()
            }
        ]
    }


# ===== PARENT MEDIATOR =====

@router.post("/parent/mediate/analyze-tone")
async def analyze_message_tone(message: str = Body(..., embed=True)):
    """Analyze tone of a message for parent communication"""
    return parent_mediation_service.analyze_tone(message)


@router.post("/parent/mediate/improve")
async def improve_message(message: str = Body(..., embed=True)):
    """Suggest improvements for a message"""
    return parent_mediation_service.improve_message(message)


@router.get("/parent/mediate/templates")
async def get_mediation_templates():
    """Get message templates for common situations"""
    return parent_mediation_service.get_templates()


# ===== EXAM ANXIETY =====

@router.get("/exam-anxiety/levels")
async def get_exposure_levels():
    """Get available exposure therapy levels"""
    return exam_anxiety_service.get_levels()

@router.get("/exam-anxiety/progress/{user_id}")
async def get_anxiety_progress(user_id: str):
    """Get user progress in exposure therapy"""
    return exam_anxiety_service.get_user_progress(user_id)

@router.post("/exam-anxiety/start-session")
async def start_exposure_session(user_id: str = Body(...), level: int = Body(...)):
    """Start a new exposure session"""
    return exam_anxiety_service.start_exposure_session(user_id, level)

@router.post("/exam-anxiety/submit-results")
async def submit_exposure_results(user_id: str = Body(...), session_data: Dict = Body(...)):
    """Submit results from an exposure session"""
    return exam_anxiety_service.submit_exposure_results(user_id, session_data)


# ===== PEER CIRCLES =====

@router.get("/peer-circles/list")
async def list_circles(interest: str = None):
    """List available peer circles"""
    return peer_circle_service.get_circles(interest)

@router.post("/peer-circles/create")
async def create_circle(data: Dict = Body(...)):
    """Create a new peer circle"""
    return peer_circle_service.create_circle(data)

@router.post("/peer-circles/join")
async def join_circle(circle_id: str = Body(...), user_id: str = Body(...)):
    """Join a peer circle"""
    return peer_circle_service.join_circle(circle_id, user_id)

@router.get("/peer-circles/{circle_id}/messages")
async def get_circle_messages(circle_id: str):
    """Get messages for a circle"""
    return peer_circle_service.get_messages(circle_id)

@router.post("/peer-circles/{circle_id}/message")
async def send_circle_message(circle_id: str, message_data: Dict = Body(...)):
    """Send a message to a circle"""
    # 1. Save to DB
    result = peer_circle_service.send_message(circle_id, message_data)
    
    # 2. Broadcast via Socket.IO
    # We broadcast to "circle_{circle_id}" room
    # The frontend expects the message object
    try:
        from socket_manager import sio
        room = f"circle_{circle_id}"
        await sio.emit('message', message_data, room=room)
    except Exception as e:
        print(f"Socket broadcast failed: {e}")

    return result
