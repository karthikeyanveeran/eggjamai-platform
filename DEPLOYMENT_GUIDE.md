# Deployment Guide

## Stack Configuration

### 1. Neon Database
```
DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/neondb
```

### 2. Railway Backend
- Deploy backend folder
- Set environment variables from `.env.production`
- Custom start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. Vercel Frontend
- Deploy frontend folder
- Set environment variables:
  - `VITE_API_URL=https://your-railway-app.railway.app`
  - `VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx`
  - `VITE_AGORA_APP_ID=xxx`

### 4. Clerk Authentication
- Configure allowed origins in Clerk dashboard
- Add Vercel domain to allowed origins

## Critical Fixes Applied

1. **CORS Configuration**: Fixed for production domains
2. **Health Check**: Added `/health` endpoint for Railway
3. **Environment Variables**: Separated dev/production configs
4. **Build Configuration**: Added `vercel.json` and `railway.json`

## Deployment Commands

```bash
# Push to GitHub
git add .
git commit -m "Fix deployment configuration"
git push origin main

# Railway will auto-deploy backend
# Vercel will auto-deploy frontend
```