
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from database import get_db
from models.db_models import User, UserRole
from models.platform_config import PlatformConfig, AuditLog
import json

router = APIRouter(prefix="/api/platform-admin", tags=["platform_admin"])

# Pydantic models
class ConfigCreate(BaseModel):
    key: str
    value: Any
    category: str
    description: Optional[str] = None
    is_encrypted: bool = False

class ConfigUpdate(BaseModel):
    value: Any
    updated_by: str

class ConfigResponse(BaseModel):
    key: str
    value: Any
    category: str
    description: Optional[str]
    updated_at: Any

# Default configurations to seed if missing
DEFAULT_CONFIGS = {
    "ai_model_config": {
        "value": {
            "provider": "openai",
            "model": "gpt-4",
            "temperature": 0.7,
            "max_tokens": 2000,
            "fallback_provider": "anthropic"
        },
        "category": "ai_gateway",
        "description": "Core AI model configuration"
    },
    "subscription_pricing": {
        "value": {
            "student_monthly": 199,
            "student_yearly": 1999,
            "school_license_base": 50000,
            "currency": "INR",
            "discount_enabled": True
        },
        "category": "billing",
        "description": "Global pricing configuration"
    },
    "feature_flags": {
        "value": {
            "video_chat": True,
            "parent_portal": True,
            "beta_features": False,
            "maintenance_mode": False
        },
        "category": "system",
        "description": "Global feature toggles"
    },
    "api_rate_limits": {
        "value": {
            "global_limit": 1000,
            "student_limit": 100,
            "school_limit": 5000
        },
        "category": "api",
        "description": "API Rate limiting configuration"
    },
    "roles_config": {
        "value": {
            "default_student_role": "student",
            "admin_can_delete_users": True,
            "teacher_can_view_analytics": True,
            "counselor_max_students": 50
        },
        "category": "roles",
        "description": "Role-based access control settings"
    },
    "partner_config": {
        "value": {
            "enable_resellers": False,
            "partner_api_access": True,
            "revenue_share_percentage": 20,
            "whitelabel_enabled": False
        },
        "category": "partner",
        "description": "Partner and reseller configurations"
    },
    "regional_config": {
        "value": {
            "default_language": "en",
            "supported_languages": ["en", "hi", "ta", "te"],
            "timezone": "Asia/Kolkata",
            "data_residency": "India"
        },
        "category": "regional",
        "description": "Regional and localization settings"
    },
    "marketing_config": {
        "value": {
            "enable_referral_program": True,
            "referral_bonus_credits": 100,
            "seo_meta_tags": {
                "title": "EggJam.ai - Student Mental Health",
                "description": "AI-powered mental health platform"
            },
            "email_campaign_enabled": True
        },
        "category": "marketing",
        "description": "Marketing and growth configurations"
    },
    "ad_config": {
        "value": {
            "enable_ads_free_tier": False,
            "ad_provider": "google_adsense",
            "ad_frequency_minutes": 30,
            "blocked_categories": ["gambling", "alcohol"]
        },
        "category": "advertisement",
        "description": "Advertisement settings for free tier"
    },
    "landing_page_config": {
        "value": {
            "hero_title": "Empowering Student Minds",
            "hero_subtitle": "AI-driven mental health support for the next generation",
            "show_testimonials": True,
            "show_pricing": True,
            "primary_color": "#4f46e5"
        },
        "category": "landing_page",
        "description": "Public landing page customization"
    },
    "account_config": {
        "value": {
            "password_min_length": 8,
            "require_email_verification": True,
            "session_timeout_minutes": 60,
            "max_login_attempts": 5
        },
        "category": "account",
        "description": "User account security policies"
    }
}

@router.on_event("startup")
async def seed_default_configs():
    """Seed default configurations on startup"""
    from database import SessionLocal
    db = SessionLocal()
    try:
        for key, data in DEFAULT_CONFIGS.items():
            exists = db.query(PlatformConfig).filter(PlatformConfig.key == key).first()
            if not exists:
                config = PlatformConfig(
                    key=key,
                    value=data["value"],
                    category=data["category"],
                    description=data["description"]
                )
                db.add(config)
        db.commit()
    except Exception as e:
        print(f"Error seeding configs: {e}")
    finally:
        db.close()

@router.get("/configs", response_model=List[ConfigResponse])
async def get_all_configs(category: str = None, db: Session = Depends(get_db)):
    """Get all system configurations"""
    query = db.query(PlatformConfig)
    if category:
        query = query.filter(PlatformConfig.category == category)
    return query.all()

@router.get("/configs/{key}", response_model=ConfigResponse)
async def get_config(key: str, db: Session = Depends(get_db)):
    """Get a specific configuration"""
    config = db.query(PlatformConfig).filter(PlatformConfig.key == key).first()
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return config

@router.post("/configs", response_model=ConfigResponse)
async def create_config(config: ConfigCreate, db: Session = Depends(get_db)):
    """Create a new configuration"""
    exists = db.query(PlatformConfig).filter(PlatformConfig.key == config.key).first()
    if exists:
        raise HTTPException(status_code=400, detail="Configuration key already exists")
    
    new_config = PlatformConfig(
        key=config.key,
        value=config.value,
        category=config.category,
        description=config.description,
        is_encrypted=config.is_encrypted,
        updated_by="admin" # In real app, get from auth context
    )
    db.add(new_config)
    db.commit()
    db.refresh(new_config)
    
    # Log audit
    log = AuditLog(
        user_id=1, # Mock admin ID
        action="create_config",
        resource=config.key,
        details={"value": str(config.value)}
    )
    db.add(log)
    db.commit()
    
    return new_config

@router.put("/configs/{key}", response_model=ConfigResponse)
async def update_config(key: str, update: ConfigUpdate, db: Session = Depends(get_db)):
    """Update an existing configuration"""
    config = db.query(PlatformConfig).filter(PlatformConfig.key == key).first()
    if not config:
        raise HTTPException(status_code=404, detail="Configuration not found")
    
    config.value = update.value
    config.updated_by = update.updated_by
    
    db.commit()
    db.refresh(config)
    
    # Log audit
    log = AuditLog(
        user_id=1, # Mock admin ID
        action="update_config",
        resource=key,
        details={"value": str(update.value)}
    )
    db.add(log)
    db.commit()
    
    return config

@router.get("/stats")
async def get_platform_stats(db: Session = Depends(get_db)):
    """Get high-level platform statistics"""
    total_users = db.query(User).count()
    total_schools = 12 # Mock for now as School model might be empty
    active_subs = 150
    api_calls_today = 45000
    
    return {
        "total_users": total_users,
        "total_schools": total_schools,
        "active_subscriptions": active_subs,
        "api_calls_today": api_calls_today,
        "system_health": "99.9%",
        "ai_token_usage": 1250000
    }
