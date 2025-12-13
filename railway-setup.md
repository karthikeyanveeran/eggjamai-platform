# Railway.app Backend Setup

## 1. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select your `eggjamai-platform` repository
4. Choose "Deploy from subdirectory" → `backend`

## 2. Environment Variables
Add these in Railway dashboard:

```
DATABASE_URL=postgresql://neondb_owner:npg_Z45uzoXjnWgA@ep-hidden-smoke-a1vlwlrq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
OPENAI_API_KEY=sk-your-openai-key
SECRET_KEY=your-production-secret-key-12345
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-certificate
DEBUG=False
```

## 3. Custom Start Command
In Railway settings → Deploy → Start Command:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 4. Get Railway URL
After deployment, copy your Railway URL (e.g., `https://backend-production-xxxx.up.railway.app`)

## 5. Update Vercel
Add to Vercel environment variables:
```
VITE_API_URL=https://your-railway-url.up.railway.app
```