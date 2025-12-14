#!/usr/bin/env python3
"""
Quick database connection test
"""
import os
from sqlalchemy import create_engine, text

def test_database():
    """Test database connection"""
    try:
        db_url = "postgresql://neondb_owner:npg_Z45uzoXjnWgA@ep-hidden-smoke-a1vlwlrq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
        
        engine = create_engine(db_url)
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as test"))
            print("SUCCESS: Database connection successful!")
            print(f"SUCCESS: Test query result: {result.fetchone()}")
            
            # Check if tables exist
            result = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
            tables = result.fetchall()
            print(f"SUCCESS: Found {len(tables)} tables in database")
            for table in tables:
                print(f"   - {table[0]}")
                
    except Exception as e:
        print(f"ERROR: Database connection failed: {e}")

if __name__ == "__main__":
    test_database()