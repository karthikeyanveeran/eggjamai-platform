# Railway Deployment Fix

## 1. Add Root Directory
In Railway Settings → Source:
- **Root Directory**: `backend`

## 2. Add Environment Variables
In Railway → Variables tab, add:
```
DATABASE_URL=postgresql://neondb_owner:npg_Z45uzoXjnWgA@ep-hidden-smoke-a1vlwlrq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
OPENAI_API_KEY=sk-your-openai-key
SECRET_KEY=railway-production-secret-key-12345
DEBUG=False
PORT=8000
```

## 3. Healthcheck Path
In Railway Settings → Deploy:
- **Healthcheck Path**: `/health`

## 4. Custom Domain Setup
In Railway Settings → Networking:
- Click **"Generate Domain"** (for Railway URL)
- Add **Custom Domain**: `api.eggjam.ai`

### DNS Configuration:
In your domain registrar (where you bought eggjam.ai):
- Add CNAME record: `api` → `your-railway-domain.up.railway.app`
- Add CNAME record: `www` → `eggjam.ai` (for Vercel)
- Add A record: `@` → Vercel IP (for root domain)

## 5. Redeploy
Click **"Deploy"** button to trigger new deployment