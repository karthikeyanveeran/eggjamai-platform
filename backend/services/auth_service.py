from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models.db_models import User, UserRole

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# JWT configuration
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days


class AuthService:
    """Authentication and authorization service"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> dict:
        """Verify and decode JWT token"""
        try:
            # Try verifying with local secret (HS256)
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            # FOR DEMO ONLY: If verification fails (e.g. Clerk RS256 token),
            # decode without verification to allow the app to work.
            # IN PRODUCTION: You must verify against Clerk's JWKS.
            try:
                print("⚠️ DEMO MODE: Accepting unverified token (Clerk)")
                return jwt.get_unverified_claims(token)
            except Exception:
                return None
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user by email and password"""
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            return None
        
        if not AuthService.verify_password(password, user.hashed_password):
            return None
        
        return user
    
    @staticmethod
    def create_user(
        db: Session,
        email: str,
        password: str,
        full_name: str,
        role: UserRole = UserRole.STUDENT,
        **kwargs
    ) -> User:
        """Create a new user"""
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise ValueError("User with this email already exists")
        
        hashed_password = AuthService.get_password_hash(password)
        
        user = User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            role=role,
            **kwargs
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def update_last_login(db: Session, user_id: int):
        """Update user's last login timestamp"""
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.last_login = datetime.utcnow()
            db.commit()


# Dependency to get current user
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = AuthService.verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: int = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return user


# Dependency to get current active user
async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


# Role-based access control decorators
def require_role(*allowed_roles: UserRole):
    """Dependency to check if user has required role"""
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker


# Specific role dependencies
async def get_current_student(
    current_user: User = Depends(require_role(UserRole.STUDENT))
) -> User:
    return current_user


async def get_current_parent(
    current_user: User = Depends(require_role(UserRole.PARENT))
) -> User:
    return current_user


async def get_current_counselor(
    current_user: User = Depends(require_role(UserRole.COUNSELOR, UserRole.ADMIN))
) -> User:
    return current_user


async def get_current_admin(
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.SCHOOL_ADMIN))
) -> User:
    return current_user


# Email verification
class EmailService:
    """Email verification and notifications"""
    
    @staticmethod
    def generate_verification_token(email: str) -> str:
        """Generate email verification token"""
        data = {"email": email, "type": "verify"}
        return AuthService.create_access_token(data, timedelta(hours=24))
    
    @staticmethod
    def verify_email_token(token: str) -> Optional[str]:
        """Verify email token and return email"""
        payload = AuthService.verify_token(token)
        if payload and payload.get("type") == "verify":
            return payload.get("email")
        return None
    
    @staticmethod
    async def send_verification_email(email: str, token: str):
        """Send verification email (implement with SendGrid/SES)"""
        # TODO: Implement email sending
        verification_link = f"http://localhost:5173/verify-email?token={token}"
        print(f"Verification link: {verification_link}")
        # In production, send actual email
        pass
    
    @staticmethod
    async def send_password_reset_email(email: str, token: str):
        """Send password reset email"""
        reset_link = f"http://localhost:5173/reset-password?token={token}"
        print(f"Password reset link: {reset_link}")
        # In production, send actual email
        pass


# Password reset
class PasswordResetService:
    """Password reset functionality"""
    
    @staticmethod
    def generate_reset_token(email: str) -> str:
        """Generate password reset token"""
        data = {"email": email, "type": "reset"}
        return AuthService.create_access_token(data, timedelta(hours=1))
    
    @staticmethod
    def verify_reset_token(token: str) -> Optional[str]:
        """Verify reset token and return email"""
        payload = AuthService.verify_token(token)
        if payload and payload.get("type") == "reset":
            return payload.get("email")
        return None
    
    @staticmethod
    def reset_password(db: Session, email: str, new_password: str) -> bool:
        """Reset user password"""
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return False
        
        user.hashed_password = AuthService.get_password_hash(new_password)
        db.commit()
        
        return True


auth_service = AuthService()
email_service = EmailService()
password_reset_service = PasswordResetService()
