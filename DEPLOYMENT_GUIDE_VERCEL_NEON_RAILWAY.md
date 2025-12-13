# 🚀 Deployment Guide: Vercel + Railway + Neon

This guide walks you through deploying EggJam.ai to a production-like environment using the "Rapid Stack": Vercel (Frontend), Railway (Backend), and Neon (Database).

## Prerequisites

- GitHub Account
- [Vercel Account](https://vercel.com/)
- [Railway Account](https://railway.app/)
- [Neon Account](https://neon.tech/)

---

## Part 1: Database Setup (Neon)

1. **Create a Project:**

   - Log in to Neon Console.
   - Click **"New Project"**.
   - Name it `eggjam-production`.
   - Choose a region close to you (e.g., US East, Frankfurt, Singapore).

2. **Get Connection String:**
   - Once created, go to the **"Dashboard"**.
   - Look for the **"Connection String"** panel.
   - Select **"Postgres"** from the dropdown (not Pooled for now, or Pooled is fine too).
   - Copy the string. It looks like: `postgres://user:pass@ep-xyz.region.neon.tech/neondb?sslmode=require`.

---

## Part 2: Backend Deployment (Railway)

1. **Push Code to GitHub:**

   - Ensure your latest code (including `Procfile` and `runtime.txt`) is pushed to your GitHub repository.

2. **Create New Project in Railway:**

   - Click **"New Project"** -> **"Deploy from GitHub repo"**.
   - Select your repository.
   - Click **"Add Variables"**.

3. **Configure Environment Variables:**

   - Add the following variables:
     - `DATABASE_URL`: Paste the Neon connection string here.
     - `SECRET_KEY`: Generate a strong random string (e.g., `openssl rand -hex 32`).
     - `CORS_ORIGINS`: `https://YOUR-VERCEL-URL.vercel.app` (You'll update this later after deploying frontend). For now, use `*`.
     - `OPENAI_API_KEY`: Your OpenAI Key.
     - `Port`: `8000` (Railway usually auto-detects, but good to be safe).

4. **Deploy:**
   - Railway will automatically detect the `Procfile` and start the deployment.
   - Once "Active", click on the project -> **"Settings"** -> **"Networking"** -> **"Generate Domain"**.
   - Copy this URL (e.g., `eggjam-backend-production.up.railway.app`).

---

## Part 3: Frontend Deployment (Vercel)

1. **Import Project:**

   - Log in to Vercel.
   - Click **"Add New..."** -> **"Project"**.
   - Select your GitHub repo.

2. **Configure Build:**

   - Framework Preset: **Vite** (Should be auto-detected).
   - Root Directory: Click "Edit" and select `frontend`.

3. **Environment Variables:**

   - Add the following variables:
     - `VITE_API_URL`: The **Railway Domain** you copied (e.g., `https://eggjam-backend-production.up.railway.app`). **Important:** No trailing slash.
     - `VITE_API_BASE_URL`: Same as above.
     - `VITE_WS_URL`: The Railway Domain, but with `wss://` instead of `https://` (actually `https://` often works for socket.io client too, but strictly `wss://` or `https://` are both fine as Socket.IO handles the upgrade. Use the https URL usually: `https://eggjam-backend-production.up.railway.app`).
     - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk Key.
     - `VITE_AGORA_APP_ID`: Your Agora App ID.

4. **Deploy:**
   - Click **"Deploy"**.

---

## Part 4: Final Configuration

1. **Update Backend CORS:**

   - Go back to **Railway**.
   - Update the `CORS_ORIGINS` variable.
   - Change `*` to your actual Vercel domain (e.g., `https://eggjam-frontend.vercel.app`).
   - Railway will auto-redeploy using the new variable.

2. **Verify Database:**
   - Since we are using Alembic (or assuming `base.metadata.create_all` runs on startup), the tables should be created automatically when the backend starts.
   - If using Alembic later, you would run `alembic upgrade head` in the Railway CLI or as a start command.
   - **Current State:** The app runs `User.metadata.create_all(bind=engine)` and similar commands in `models/db_models.py` or `main.py` (via imports). Verify that your models are imported in `main.py` so they are registered.

## Troubleshooting

- **"Internal Server Error" on Backend:** Check Railway Logs. It's often a database connection issue.
- **"Network Error" on Frontend:** Check the Browser Console. Ensure `VITE_API_URL` is correct and doesn't have a trailing slash if your code appends `/api/...`.
- **Socket.IO not connecting:** Ensure `CORS_ORIGINS` in Railway includes your Vercel domain exactly (no trailing slash usually).
