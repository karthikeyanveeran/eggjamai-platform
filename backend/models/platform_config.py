
from sqlalchemy import Column, Integer, String, Text, JSON, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

class PlatformConfig(Base):
    __tablename__ = "platform_configs"
    
    id = Column(Integer, primary_key=True)
    key = Column(String(255), unique=True, index=True, nullable=False)
    value = Column(JSON, nullable=False)
    category = Column(String(100), index=True)  # api, business, ai, etc.
    description = Column(Text)
    is_encrypted = Column(Boolean, default=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    updated_by = Column(String(255))  # User ID or email

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, index=True)
    action = Column(String(255), nullable=False)
    resource = Column(String(255))
    details = Column(JSON)
    ip_address = Column(String(50))
    timestamp = Column(DateTime, server_default=func.now())
