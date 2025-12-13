# 🥚 EggJam.ai - Demo Environment Guide

This repository contains the full source code for EggJam.ai, a mental health and holistic growth platform for students.
This guide explains how to run the application in **Demo Mode**, which uses local fallbacks for AI and Video services so you can test without paid API keys.

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- Git

### 1. Backend Setup (FastAPI + Socket.IO)

The backend handles API requests, real-time chat (Socket.IO), and database interactions (SQLite).

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
# This starts FastAPI on port 8000
python main.py
```

**Note:** The backend is configured to use `sqlite:///./eggjamai.db` by default. It will automatically create this file.

### 2. Frontend Setup (React + Vite)

The frontend is a modern React application.

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🧪 Demo Mode Features

This environment is configured to run robustly even without external API keys (OpenAI, Agora).

| Feature                     | Production Status | Demo Mode Behavior                                                                             |
| --------------------------- | ----------------- | ---------------------------------------------------------------------------------------------- |
| **AI Chat**                 | Uses OpenAI GPT-4 | Returns "Fallback" AI responses if no API key is present.                                      |
| **Personalized Challenges** | Uses OpenAI       | Generates high-quality pre-set challenges based on user interest.                              |
| **Academic Tutor**          | Uses Socratic AI  | Simulates a Socratic dialogue with mock responses.                                             |
| **Video/Voice Chat**        | Uses Agora RTC    | Connects to Agora if keys exist; otherwise, shows UI and handles connection errors gracefully. |
| **Real-Time Chat**          | Socket.IO (Redis) | Uses in-memory Python Socket.IO (fully functional for local demos).                            |
| **Database**                | PostgreSQL        | Uses SQLite (local file) for zero-config persistence.                                          |

## 🔑 Login Credentials

The database comes empty, but you can register a new user or use these defaults if you seeded the DB:

- **Email:** `demo@eggjam.ai`
- **Password:** `password123`
  _(If these don't work, just click "Sign Up" and create a new account - it works locally!)_

## 🛠 Troubleshooting

- **Socket Connection Failed:** Ensure the backend is running on `localhost:8000`. The frontend expects the socket at this address.
- **"Network Error":** Check CORS settings in `backend/config.py` if running on a different port.
- **Dependencies Missing:** Run `pip install -r requirements.txt` again to ensure `python-socketio` and `agora-token-builder` are installed.

## 📝 Architecture

- **Frontend:** React, Vite, Framer Motion, Socket.io-client
- **Backend:** FastAPI, SQLAlchemy, Python-SocketIO
- **Real-Time:** WebSockets (Socket.IO) for chat & presence
- **Video:** Agora RTC (Client-side integration)

Enjoy testing EggJam.ai!
