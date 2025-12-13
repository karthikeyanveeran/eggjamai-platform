from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    """User roles in the system."""
    STUDENT = "student"
    COUNSELOR = "counselor"
    ADMIN = "admin"
    PARENT = "parent"


class AgeGroup(str, Enum):
    """Age groups for students."""
    CHILD = "3-12"  # Children
    TEEN = "13-18"  # Teenagers
    YOUNG_ADULT = "19-25"  # College students


class UserBase(BaseModel):
    """Base user model."""
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.STUDENT
    age_group: Optional[AgeGroup] = None
    preferred_language: str = "en"


class UserCreate(UserBase):
    """User creation model."""
    password: str


class UserLogin(BaseModel):
    """User login model."""
    email: EmailStr
    password: str


class User(UserBase):
    """User model with full details."""
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: User


class TokenData(BaseModel):
    """Token payload data."""
    email: Optional[str] = None
