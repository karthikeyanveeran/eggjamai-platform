# 🚀 Quick Start Guide - SQLite Version

This is a simplified setup guide using SQLite for quick testing without PostgreSQL installation.

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Setup Instructions

### 1. Backend Setup (SQLite)

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create a simple .env file for SQLite
echo "DATABASE_URL=sqlite:///./eggjamai.db
SECRET_KEY=demo-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=your-key-here
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
DEBUG=True" > .env

# Initialize database
python init_db.py

# Seed demo data
python seed_demo_data.py

# Start backend server
python main.py
```

Backend will run at: **http://localhost:8000**

### 2. Frontend Setup

```bash
cd ../frontend

# Install dependencies (if not done)
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000
VITE_ENV=development" > .env

# Start frontend
npm run dev
```

Frontend will run at: **http://localhost:5173**

## 🔐 Demo Login Credentials

**Password for all accounts:** `demo123`

### Quick Test Accounts

| Role          | Email               | Password |
| ------------- | ------------------- | -------- |
| Student       | student@demo.com    | demo123  |
| Parent        | parent@demo.com     | demo123  |
| School Admin  | admin@demo.com      | demo123  |
| LD Specialist | specialist@demo.com | demo123  |
| Counselor     | counselor@demo.com  | demo123  |

## 🎯 Quick Test Flow

1. Open http://localhost:5173
2. Login with `student@demo.com` / `demo123`
3. Explore the student dashboard
4. Try different features (Chat, Mood Tracker, etc.)
5. Logout and try other roles

## 📚 Full Documentation

See `DEMO_CREDENTIALS.md` for:

- Complete list of demo accounts
- Detailed testing workflows
- Feature testing checklist
- Troubleshooting guide

## ⚠️ Note

This SQLite setup is for **demo/testing only**. For production:

- Use PostgreSQL
- Set strong SECRET_KEY
- Configure proper CORS
- Add OpenAI API key
- Enable HTTPS
