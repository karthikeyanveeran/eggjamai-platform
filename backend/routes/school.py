from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
import io
import uuid
from datetime import datetime, timedelta

from database import get_db
from models.db_models import School, User, UserRole, SubscriptionTier
from services.auth_service import get_current_user

router = APIRouter(prefix="/api/school", tags=["school"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_school(
    name: str,
    city: str,
    state: str,
    contact_email: str,
    contact_phone: str,
    db: Session = Depends(get_db)
):
    """
    Register a new school and generate a license key.
    """
    # Check if school already exists
    existing_school = db.query(School).filter(School.name == name).first()
    if existing_school:
        raise HTTPException(status_code=400, detail="School already registered")

    # Generate license key
    license_key = f"SCH-{uuid.uuid4().hex[:8].upper()}"
    
    new_school = School(
        name=name,
        city=city,
        state=state,
        contact_email=contact_email,
        contact_phone=contact_phone,
        license_key=license_key,
        subscription_tier=SubscriptionTier.SCHOOL,
        license_expires_at=datetime.now() + timedelta(days=365) # 1 year trial
    )
    
    db.add(new_school)
    db.commit()
    db.refresh(new_school)
    
    return {
        "message": "School registered successfully",
        "school_id": new_school.id,
        "license_key": license_key,
        "expires_at": new_school.license_expires_at
    }

@router.post("/import-students/{school_id}")
async def import_students(
    school_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Bulk import students from CSV file.
    CSV Format: email, full_name, grade_level
    """
    # Verify permissions (must be school admin or platform admin)
    if current_user.role not in [UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if current_user.role == UserRole.SCHOOL_ADMIN and current_user.school_id != school_id:
        raise HTTPException(status_code=403, detail="Not authorized for this school")

    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    content = await file.read()
    decoded_content = content.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(decoded_content))
    
    imported_count = 0
    errors = []
    
    for row in csv_reader:
        try:
            email = row.get('email')
            full_name = row.get('full_name')
            grade_level = row.get('grade_level')
            
            if not email:
                continue
                
            # Check if user exists
            if db.query(User).filter(User.email == email).first():
                errors.append(f"User {email} already exists")
                continue
                
            # Create student
            # Note: In production, generate a temp password and email it
            temp_password = "ChangeMe123!" 
            hashed_pw = "hashed_placeholder" # You would use auth_service.get_password_hash(temp_password)
            
            new_student = User(
                email=email,
                full_name=full_name,
                hashed_password=hashed_pw,
                role=UserRole.STUDENT,
                school_id=school_id,
                grade_level=int(grade_level) if grade_level else None,
                is_active=True
            )
            
            db.add(new_student)
            imported_count += 1
            
        except Exception as e:
            errors.append(f"Error importing row {row}: {str(e)}")
            
    db.commit()
    
    return {
        "message": f"Import completed. {imported_count} students added.",
        "errors": errors
    }

@router.get("/dashboard/{school_id}")
async def get_school_dashboard(
    school_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get school dashboard statistics.
    """
    # Verify permissions
    if current_user.role not in [UserRole.SCHOOL_ADMIN, UserRole.PLATFORM_ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if current_user.role == UserRole.SCHOOL_ADMIN and current_user.school_id != school_id:
        raise HTTPException(status_code=403, detail="Not authorized for this school")

    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
        
    student_count = db.query(User).filter(User.school_id == school_id, User.role == UserRole.STUDENT).count()
    counselor_count = db.query(User).filter(User.school_id == school_id, User.role == UserRole.COUNSELOR).count()
    
    # Mock stats for demo (replace with real aggregations)
    avg_engagement = 85
    risk_distribution = {"low": 70, "moderate": 20, "high": 10}
    
    return {
        "school_name": school.name,
        "license_status": "Active" if school.license_expires_at > datetime.now() else "Expired",
        "stats": {
            "total_students": student_count,
            "total_counselors": counselor_count,
            "avg_engagement": avg_engagement,
            "risk_distribution": risk_distribution
        }
    }
