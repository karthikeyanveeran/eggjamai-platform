# Domain Setup: eggjam.ai

## Domain Configuration

### Railway Backend: api.eggjam.ai
1. Railway → Networking → Custom Domain: `api.eggjam.ai`
2. DNS: Add CNAME `api` → `your-railway-domain.up.railway.app`

### Vercel Frontend: eggjam.ai
1. Vercel → Project Settings → Domains → Add: `eggjam.ai`
2. DNS: Add A record `@` → Vercel IP (provided by Vercel)

### Environment Variables Update
**Vercel**:
```
VITE_API_URL=https://api.eggjam.ai
```

**Railway CORS**:
```
CORS_ORIGINS=https://eggjam.ai,https://www.eggjam.ai
```

## DNS Records Summary
```
Type    Name    Value
A       @       76.76.19.61 (Vercel IP)
CNAME   www     eggjam.ai
CNAME   api     your-railway-domain.up.railway.app
```