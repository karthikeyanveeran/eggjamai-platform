"""
Demo Data Seeding Script
Creates demo users with various roles for testing the application
"""

from database import SessionLocal
from models.db_models import User
import hashlib
from datetime import datetime

def hash_password(password: str) -> str:
    """Simple hash for demo purposes using SHA-256"""
    # For demo purposes, using simple SHA-256
    # In production, the actual auth system uses bcrypt
    return hashlib.sha256(password.encode()).hexdigest()

def seed_demo_users():
    """Create demo users for testing"""
    db = SessionLocal()
    
    try:
        # Check if demo users already exist
        existing_user = db.query(User).filter(User.email == "student@demo.com").first()
        if existing_user:
            print("[WARNING] Demo users already exist. Skipping...")
            print("[OK] You can use existing demo accounts with password: demo123")
            return
        
        demo_users = [
            # Students
            {
                "email": "student@demo.com",
                "password": "demo123",
                "full_name": "Alex Student",
                "role": "student",
                "age": 16,
                "grade_level": 10,
                "is_active": True
            },
            {
                "email": "student2@demo.com",
                "password": "demo123",
                "full_name": "Sarah Johnson",
                "role": "student",
                "age": 15,
                "grade_level": 9,
                "is_active": True
            },
            {
                "email": "student3@demo.com",
                "password": "demo123",
                "full_name": "Michael Chen",
                "role": "student",
                "age": 17,
                "grade_level": 11,
                "is_active": True
            },
            
            # Parents
            {
                "email": "parent@demo.com",
                "password": "demo123",
                "full_name": "John Parent",
                "role": "parent",
                "age": 42,
                "grade_level": None,
                "is_active": True
            },
            {
                "email": "parent2@demo.com",
                "password": "demo123",
                "full_name": "Mary Williams",
                "role": "parent",
                "age": 38,
                "grade_level": None,
                "is_active": True
            },
            
            # School Admin
            {
                "email": "admin@demo.com",
                "password": "demo123",
                "full_name": "Dr. Principal Kumar",
                "role": "school_admin",
                "age": 45,
                "grade_level": None,
                "is_active": True
            },
            
            # LD Specialist
            {
                "email": "specialist@demo.com",
                "password": "demo123",
                "full_name": "Dr. Lisa Specialist",
                "role": "ld_specialist",
                "age": 35,
                "grade_level": None,
                "is_active": True
            },
            
            # Counselor
            {
                "email": "counselor@demo.com",
                "password": "demo123",
                "full_name": "Ms. Emma Counselor",
                "role": "counselor",
                "age": 32,
                "grade_level": None,
                "is_active": True
            },
            
            # Teacher
            {
                "email": "teacher@demo.com",
                "password": "demo123",
                "full_name": "Mr. David Teacher",
                "role": "teacher",
                "age": 40,
                "grade_level": None,
                "is_active": True
            }
        ]
        
        print("[*] Seeding demo users...")
        print("=" * 60)
        
        for user_data in demo_users:
            password = user_data.pop("password")
            hashed_password = hash_password(password)
            
            user = User(
                **user_data,
                hashed_password=hashed_password,
                created_at=datetime.utcnow()
            )
            
            db.add(user)
            print(f"[OK] Created: {user_data['email']:25} | Role: {user_data['role']:15} | Name: {user_data['full_name']}")
        
        db.commit()
        print("=" * 60)
        print(f"[OK] Successfully created {len(demo_users)} demo users!")
        print("\n[NOTE] All demo accounts use password: demo123")
        print("\n[WARNING] Note: Using SHA-256 for demo. Production should use bcrypt.")
        
    except Exception as e:
        print(f"[ERROR] Error seeding data: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("[*] EggJam.ai Demo Data Seeder")
    print("=" * 60 + "\n")
    seed_demo_users()
    print("\n" + "=" * 60)
    print("[DONE] Demo data seeding complete!")
    print("=" * 60 + "\n")
