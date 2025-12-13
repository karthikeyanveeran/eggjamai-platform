# EggJam.ai Setup Guide

## Backend Setup

### 1. Install Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

The `.env` file has been created with default values. **IMPORTANT**: Update the following:

```env
# Add your OpenAI API key
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Change the secret key in production
SECRET_KEY=your-secure-secret-key-here
```

### 3. Run the Backend

```powershell
python main.py
```

The API will be available at `http://localhost:8000`

#### API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Frontend Setup

The frontend is already running at `http://localhost:5173`

If you need to restart it:

```powershell
cd frontend
npm run dev
```

## Features Implemented

### ✅ **AI Conversation System**

- Real-time chat with OpenAI GPT-4
- Age-appropriate responses (3-12, 13-18, 19-25)
- Crisis detection and risk assessment
- Session management
- Crisis alerts with resource suggestions

### ✅ **Mental Health Assessments**

- PHQ-9 (Depression Screening)
- GAD-7 (Anxiety Screening)
- Automatic scoring and interpretation
- Severity-based recommendations
- Beautiful result visualization

### ✅ **Premium UI/UX**

- Glassmorphism design
- Smooth animations and transitions
- Voice interface (UI ready, Pipecat integration pending)
- Responsive design
- Custom scrollbars

## Testing the Application

### Test Conversation Flow:

1. Open `http://localhost:5173`
2. Type a message in the chat
3. The AI will respond with empathetic support
4. Try crisis keywords like "depressed" or "anxious" to see risk detection

### Test Assessment:

1. Navigate to the Assessment page
2. Select PHQ-9 or GAD-7
3. Answer the questions
4. View your personalized results

## API Endpoints

### Conversation

- `POST /api/conversation/chat` - Send message, get AI response
- `GET /api/conversation/history/{session_id}` - Get conversation history
- `DELETE /api/conversation/session/{session_id}` - Delete session

### Assessment

- `GET /api/assessment/questions/{type}` - Get assessment questions
- `POST /api/assessment/submit` - Submit answers, get results
- `GET /api/assessment/results/{user_id}` - Get user's assessment history

## Next Steps

### Immediate:

1. Add your OpenAI API key to `.env`
2. Test the complete flow
3. Navigate between Chat and Assessment

### Future Implementation:

1. **Authentication** - User registration and login
2. **Voice Integration** - Pipecat.ai for real voice conversations
3. **Database** - PostgreSQL for persistent storage
4. **Counselor Dashboard** - For school counselors to monitor students
5. **Multi-language Support** - Implement 22 Indian languages
6. **Parent Portal** - Progress updates for parents

## Troubleshooting

### Backend won't start:

- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check if port 8000 is available
- Verify .env file exists and has correct values

### Frontend errors:

- Check if backend is running at `http://localhost:8000`
- Inspect browser console for errors
- Ensure all imports are correct

### CORS errors:

- Verify frontend URL is in `CORS_ORIGINS` in `.env`
- Restart backend after changing `.env`

## Development Notes

- **Data Storage**: Currently using in-memory storage. Replace with PostgreSQL + Redis for production.
- **Security**: Change SECRET_KEY before deploying
- **OpenAI Costs**: Monitor API usage to manage costs
- **Crisis Protocol**: Customize crisis resources for your region/school

---

**Built with ❤️ for student mental health**
