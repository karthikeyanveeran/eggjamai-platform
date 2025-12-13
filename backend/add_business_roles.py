"""
Add Business Operations & Management Demo Accounts
Creates regional managers, state managers, account managers, and business ops roles
"""

from database import SessionLocal
from models.db_models import User
import hashlib
from datetime import datetime

def hash_password(password: str) -> str:
    """Simple hash for demo purposes using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def add_business_roles():
    """Create business operations and management users"""
    db = SessionLocal()
    
    try:
        # Check if any business role already exists
        existing = db.query(User).filter(User.email == "regional@demo.com").first()
        if existing:
            print("⚠️  Business roles already exist!")
            print("✅ You can use existing business accounts with password: demo123")
            return
        
        business_users = [
            # Regional Managers
            {
                "email": "regional@demo.com",
                "password": "demo123",
                "full_name": "Rajesh Regional Manager",
                "role": "regional_manager",
                "age": 38,
                "grade_level": None,
                "is_active": True
            },
            {
                "email": "regional.north@demo.com",
                "password": "demo123",
                "full_name": "Priya North Regional Manager",
                "role": "regional_manager",
                "age": 35,
                "grade_level": None,
                "is_active": True
            },
            {
                "email": "regional.south@demo.com",
                "password": "demo123",
                "full_name": "Amit South Regional Manager",
                "role": "regional_manager",
                "age": 40,
                "grade_level": None,
                "is_active": True
            },
            
            # State Managers
            {
                "email": "state@demo.com",
                "password": "demo123",
                "full_name": "Kavita State Manager",
                "role": "state_manager",
                "age": 42,
                "grade_level": None,
                "is_active": True
            },
            {
                "email": "state.maharashtra@demo.com",
                "password": "demo123",
                "full_name": "Suresh Maharashtra Manager",
                "role": "state_manager",
                "age": 45,
                "grade_level": None,
                "is_active": True
            },
            
            # Account Managers
            {
                "email": "accountmgr@demo.com",
                "password": "demo123",
                "full_name": "Neha Account Manager",
                "role": "account_manager",
                "age": 32,
                "grade_level": None,
                "is_active": True
            },
            {
                "email": "accountmgr.enterprise@demo.com",
                "password": "demo123",
                "full_name": "Vikram Enterprise Account Manager",
                "role": "account_manager",
                "age": 36,
                "grade_level": None,
                "is_active": True
            },
            
            # Business Operations
            {
                "email": "bizops@demo.com",
                "password": "demo123",
                "full_name": "Anjali Business Operations",
                "role": "business_operations",
                "age": 34,
                "grade_level": None,
                "is_active": True
            },
            {
                "email": "bizops.analytics@demo.com",
                "password": "demo123",
                "full_name": "Rahul Analytics Operations",
                "role": "business_operations",
                "age": 30,
                "grade_level": None,
                "is_active": True
            },
            
            # Partner Manager
            {
                "email": "partner@demo.com",
                "password": "demo123",
                "full_name": "Deepak Partner Manager",
                "role": "partner_manager",
                "age": 37,
                "grade_level": None,
                "is_active": True
            }
        ]
        
        print("🌱 Creating Business Operations & Management accounts...")
        print("=" * 70)
        
        for user_data in business_users:
            password = user_data.pop("password")
            hashed_password = hash_password(password)
            
            user = User(
                **user_data,
                hashed_password=hashed_password,
                created_at=datetime.utcnow()
            )
            
            db.add(user)
            print(f"✅ Created: {user_data['email']:35} | Role: {user_data['role']:20} | {user_data['full_name']}")
        
        db.commit()
        print("=" * 70)
        print(f"✅ Successfully created {len(business_users)} business role accounts!")
        print("\n📝 All accounts use password: demo123")
        
        print("\n🎯 Business Roles Created:")
        print("   • Regional Managers (3) - Oversee schools in regions")
        print("   • State Managers (2) - Manage state-level operations")
        print("   • Account Managers (2) - Handle client relationships")
        print("   • Business Operations (2) - Manage business processes")
        print("   • Partner Manager (1) - Manage partnerships")
        
    except Exception as e:
        print(f"❌ Error creating business roles: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🎭 EggJam.ai - Business Operations & Management Account Creator")
    print("=" * 70 + "\n")
    add_business_roles()
    print("\n" + "=" * 70)
    print("🚀 Business roles setup complete!")
    print("=" * 70 + "\n")
