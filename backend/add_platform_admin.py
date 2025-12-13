"""
Add Platform Admin Demo Account
Creates a platform admin user for system-wide management
"""

from database import SessionLocal
from models.db_models import User
import hashlib
from datetime import datetime

def hash_password(password: str) -> str:
    """Simple hash for demo purposes using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def add_platform_admin():
    """Create platform admin user"""
    db = SessionLocal()
    
    try:
        # Check if platform admin already exists
        existing_admin = db.query(User).filter(User.email == "platformadmin@demo.com").first()
        if existing_admin:
            print("⚠️  Platform admin already exists!")
            print(f"✅ Email: platformadmin@demo.com")
            print(f"✅ Password: demo123")
            return
        
        # Create platform admin
        platform_admin = {
            "email": "platformadmin@demo.com",
            "password": "demo123",
            "full_name": "Platform Administrator",
            "role": "platform_admin",
            "age": 35,
            "grade_level": None,
            "is_active": True
        }
        
        print("🌱 Creating Platform Admin account...")
        print("=" * 60)
        
        password = platform_admin.pop("password")
        hashed_password = hash_password(password)
        
        admin_user = User(
            **platform_admin,
            hashed_password=hashed_password,
            created_at=datetime.utcnow()
        )
        
        db.add(admin_user)
        db.commit()
        
        print(f"✅ Created: {platform_admin['email']:30} | Role: {platform_admin['role']}")
        print("=" * 60)
        print("✅ Platform Admin account created successfully!")
        print("\n📝 Login credentials:")
        print(f"   Email: platformadmin@demo.com")
        print(f"   Password: demo123")
        print("\n🔑 Platform Admin can:")
        print("   • Manage multiple schools")
        print("   • View system-wide analytics")
        print("   • Configure platform settings")
        print("   • Manage subscriptions")
        print("   • Access all features")
        
    except Exception as e:
        print(f"❌ Error creating platform admin: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("🎭 EggJam.ai - Platform Admin Creator")
    print("=" * 60 + "\n")
    add_platform_admin()
    print("\n" + "=" * 60)
    print("🚀 Platform admin setup complete!")
    print("=" * 60 + "\n")
