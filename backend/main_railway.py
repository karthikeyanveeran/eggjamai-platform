from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Create FastAPI app
app = FastAPI(
    title="EggJam.ai API",
    version="2.0.0",
    description="AI-powered mental health & character building platform for students"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {
        "message": "Welcome to EggJam.ai API",
        "version": "2.0.0",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    import datetime
    return {
        "status": "healthy",
        "service": "eggjamai-backend",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)