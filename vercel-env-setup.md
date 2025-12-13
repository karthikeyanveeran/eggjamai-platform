# Vercel Environment Variables Setup

## Database Configuration
- **Database**: eggjamai-production
- **Environments**: Production, Preview, Development
- **Custom Prefix**: `POSTGRES` (change from STORAGE to POSTGRES)

## Required Environment Variables in Vercel:

```
DATABASE_URL=postgresql://neondb_owner:npg_Z45uzoXjnWgA@ep-hidden-smoke-a1vlwlrq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
VITE_API_URL=https://your-railway-backend.railway.app
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
VITE_AGORA_APP_ID=your_agora_app_id
```

## Steps:
1. In Vercel Storage page, find "Custom Prefix" field
2. Delete "STORAGE" and type "POSTGRES"
3. Connect to all environments (Dev, Preview, Production)
4. Click "Create" - this auto-creates all POSTGRES_* variables
5. Add other environment variables manually in Vercel dashboard