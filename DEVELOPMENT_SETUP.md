# EggJam.ai Development Setup

## Prerequisites
- Docker Desktop (for containerized development)
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)
- PostgreSQL 15+ (for local database)

## Quick Start with Docker (Recommended)

1. **Start Docker Desktop**
2. **Run development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

## Services Available:
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **Database**: localhost:5432
- **Redis**: localhost:6379

## Local Development (Alternative)

### Backend Setup:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

## Current Sprint Tasks

### Issue #6: ChatWindow API Integration
- **Status**: Ready to code
- **Branch**: feature/TASK-6-chatwindow-api-integration
- **Files to modify**:
  - `frontend/src/components/ChatWindow.jsx`
  - `backend/routes/conversation.py`

### Issue #7: PostgreSQL Database Setup
- **Status**: Ready to implement
- **Files to modify**:
  - `backend/database.py`
  - `backend/init_db.py`

## Development Workflow
1. Create feature branch: `git checkout -b feature/TASK-X-description`
2. Make changes
3. Test locally
4. Commit and push
5. Create pull request

## Environment Variables
Copy `.env.example` files and configure:
- `backend/.env`
- `frontend/.env`