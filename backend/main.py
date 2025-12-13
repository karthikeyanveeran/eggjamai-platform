from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
import os
from routes import conversation, assessment, challenges, advanced_features, platform_admin, auth, school, mood

# Create FastAPI app
app = FastAPI(
    title="EggJam.ai API",
    version="2.0.0",
    description="AI-powered mental health & character building platform for students"
)

# Configure CORS for production
allowed_origins = [
    "https://eggjam.ai",
    "https://www.eggjam.ai",
    "http://localhost:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(conversation.router)
app.include_router(assessment.router)
app.include_router(challenges.router)
app.include_router(advanced_features.router)
app.include_router(platform_admin.router)
app.include_router(school.router)
app.include_router(mood.router)


@app.get("/")
async def read_root():
    """Root endpoint."""
    return {
        "message": "Welcome to EggJam.ai API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    import datetime
    return {
        "status": "healthy",
        "service": "eggjamai-backend",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

# Mount Socket.IO to the FastAPI app
import socketio
from socket_manager import sio

# Create ASGI app that combines Socket.IO and FastAPI
# The socket_io app handles /socket.io/ requests, and passes others to FastAPI
app = socketio.ASGIApp(sio, app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )

