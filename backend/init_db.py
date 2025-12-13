"""
Database Initialization Script
Run this to create all database tables
"""

from database import engine, Base
from models.db_models import *
from models.platform_config import *

def init_db():
    """Create all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    
    # Print all tables created
    print("\nTables created:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")

if __name__ == "__main__":
    init_db()
