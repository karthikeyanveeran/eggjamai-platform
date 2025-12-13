from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum


# Enums
class UserRole(str, enum.Enum):
    STUDENT = "student"
    PARENT = "parent"
    COUNSELOR = "counselor"
    TEACHER = "teacher"
    ADMIN = "admin"
    SCHOOL_ADMIN = "school_admin"
    PLATFORM_ADMIN = "platform_admin"


class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    PREMIUM = "premium"
    SCHOOL = "school"
    ENTERPRISE = "enterprise"


class RiskLevel(str, enum.Enum):
    NONE = "none"
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"


# User Model
class User(Base):
    __tablename__ = "users"
    
    id = Column(String(255), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    full_name = Column(String(255))
    role = Column(Enum(UserRole), default=UserRole.STUDENT)
    age = Column(Integer)
    grade_level = Column(Integer)
    school_id = Column(Integer, ForeignKey('schools.id'), nullable=True)
    
    # Profile
    interests = Column(JSON, default=list)
    personality_traits = Column(JSON, default=list)
    goals = Column(JSON, default=list)
    struggles = Column(JSON, default=list)
    
    # Subscription
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    subscription_expires_at = Column(DateTime, nullable=True)
    
    # Gamification
    total_points = Column(Integer, default=0)
    level = Column(Integer, default=1)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    
    # Metadata
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime)
    
    # Relationships
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    mood_entries = relationship("MoodEntry", back_populates="user", cascade="all, delete-orphan")
    assessments = relationship("AssessmentResult", back_populates="user", cascade="all, delete-orphan")
    challenges = relationship("ChallengeCompletion", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    mental_health_baselines = relationship("MentalHealthBaseline", back_populates="user", cascade="all, delete-orphan")
    screen_time_logs = relationship("ScreenTimeLog", back_populates="user", cascade="all, delete-orphan")
    
    # Parent-child relationship
    parent_links = relationship("ParentStudentLink", foreign_keys="[ParentStudentLink.student_id]", back_populates="student")


# School Model
class School(Base):
    __tablename__ = "schools"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    city = Column(String(100))
    state = Column(String(100))
    license_key = Column(String(255), unique=True)
    subscription_tier = Column(Enum(SubscriptionTier), default=SubscriptionTier.SCHOOL)
    max_students = Column(Integer, default=1000)
    license_expires_at = Column(DateTime)
    contact_email = Column(String(255))
    contact_phone = Column(String(20))
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    students = relationship("User", backref="school")
    counselors = relationship("Counselor", back_populates="school")


# Conversation Model
class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    session_id = Column(String(255), unique=True, index=True)
    title = Column(String(255))
    started_at = Column(DateTime, server_default=func.now())
    ended_at = Column(DateTime, nullable=True)
    
    # Risk tracking
    max_risk_level = Column(Enum(RiskLevel), default=RiskLevel.NONE)
    counselor_alerted = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


# Message Model
class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey('conversations.id'), nullable=False)
    role = Column(String(20))  # user, assistant, system
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, server_default=func.now())
    
    # Risk assessment
    risk_score = Column(Float, default=0.0)
    risk_level = Column(Enum(RiskLevel), default=RiskLevel.NONE)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")


# Mood Entry Model
class MoodEntry(Base):
    __tablename__ = "mood_entries"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    mood_score = Column(Integer, nullable=False)  # 1-10
    mood_emoji = Column(String(10))
    emotions = Column(JSON, default=list)  # Tags like 'happy', 'anxious'
    note = Column(Text, nullable=True)
    date = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="mood_entries")


# Assessment Result Model
class AssessmentResult(Base):
    __tablename__ = "assessment_results"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    assessment_type = Column(String(20))  # phq9, gad7
    score = Column(Integer, nullable=False)
    severity = Column(String(50))
    answers = Column(JSON, nullable=False)
    taken_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="assessments")


# Challenge Completion Model
class ChallengeCompletion(Base):
    __tablename__ = "challenge_completions"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    challenge_id = Column(String(255), nullable=False)
    challenge_title = Column(String(255))
    challenge_category = Column(String(50))
    points_earned = Column(Integer, default=10)
    completed_at = Column(DateTime, server_default=func.now())
    proof_url = Column(String(500), nullable=True)
    reflection = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="challenges")


# Achievement/Badge Model
class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True)
    code = Column(String(50), unique=True, nullable=False)  # civic_champion, etc.
    name = Column(String(255), nullable=False)
    description = Column(Text)
    icon = Column(String(10))
    tier = Column(String(20))  # bronze, silver, gold, platinum
    requirement = Column(Integer, default=10)
    category = Column(String(50))


# User Achievement Link
class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    achievement_id = Column(Integer, ForeignKey('achievements.id'), nullable=False)
    progress = Column(Integer, default=0)
    unlocked = Column(Boolean, default=False)
    unlocked_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")


# Mental Health Baseline
class MentalHealthBaseline(Base):
    __tablename__ = "mental_health_baselines"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    baseline_mood = Column(Float, nullable=False)
    typical_typing_speed = Column(Float)
    typical_session_frequency = Column(Float)
    established_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="mental_health_baselines")


# Screen Time Log
class ScreenTimeLog(Base):
    __tablename__ = "screen_time_logs"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    date = Column(DateTime, nullable=False)
    total_minutes = Column(Integer, nullable=False)
    by_app = Column(JSON, default=dict)
    offline_achievements = Column(JSON, default=list)
    
    # Relationships
    user = relationship("User", back_populates="screen_time_logs")


# Parent-Student Link
class ParentStudentLink(Base):
    __tablename__ = "parent_student_links"
    
    id = Column(Integer, primary_key=True)
    parent_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    student_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    parent = relationship("User", foreign_keys=[parent_id])
    student = relationship("User", foreign_keys=[student_id], back_populates="parent_links")


# Counselor Model
class Counselor(Base):
    __tablename__ = "counselors"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    school_id = Column(Integer, ForeignKey('schools.id'), nullable=True)
    license_number = Column(String(100))
    specialization = Column(String(255))
    max_students = Column(Integer, default=50)
    
    # Relationships
    school = relationship("School", back_populates="counselors")
    user = relationship("User")


# Peer Circle Model
class PeerCircle(Base):
    __tablename__ = "peer_circles"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    interest_focus = Column(String(100))
    max_members = Column(Integer, default=10)
    is_anonymous = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    members = relationship("CircleMembership", back_populates="circle")
    messages = relationship("CircleMessage", back_populates="circle")


# Circle Membership
class CircleMembership(Base):
    __tablename__ = "circle_memberships"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    circle_id = Column(Integer, ForeignKey('peer_circles.id'), nullable=False)
    joined_at = Column(DateTime, server_default=func.now())
    is_moderator = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User")
    circle = relationship("PeerCircle", back_populates="members")


# Circle Message
class CircleMessage(Base):
    __tablename__ = "circle_messages"
    
    id = Column(Integer, primary_key=True)
    circle_id = Column(Integer, ForeignKey('peer_circles.id'), nullable=False)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=False)
    content = Column(Text, nullable=False)
    is_anonymous = Column(Boolean, default=False)
    flagged = Column(Boolean, default=False)
    timestamp = Column(DateTime, server_default=func.now())
    
    # Relationships
    circle = relationship("PeerCircle", back_populates="messages")
    user = relationship("User")


# Payment/Subscription Model
class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), ForeignKey('users.id'), nullable=True)
    school_id = Column(Integer, ForeignKey('schools.id'), nullable=True)
    tier = Column(Enum(SubscriptionTier), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    payment_provider = Column(String(50))  # razorpay, stripe
    payment_id = Column(String(255))
    status = Column(String(20))  # active, cancelled, expired
    starts_at = Column(DateTime, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
