# Vercel Deployment - Simple Approach

## Current Issue
White screen because routing config broke static file serving.

## Solution: Two Separate Vercel Projects

### Step 1: Delete Current Deployment
In Vercel dashboard, delete the `idea-catalyst` project completely.

### Step 2: Deploy Frontend Only

1. **Update `vercel.json` in root:**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. **Set Frontend Environment Variable:**
- `VITE_API_URL` = `https://idea-catalyst-api.vercel.app/api`

3. **Deploy Frontend:**
- Import your GitHub repo to Vercel
- Name it: `idea-catalyst-frontend`
- Framework: Vite
- Root directory: `./`
- Build command: `npm run build`
- Output directory: `dist`

### Step 3: Deploy Backend Separately

1. **Create new Vercel project**
2. **Import same GitHub repo**
3. **Name it**: `idea-catalyst-api`
4. **Root Directory**: Select `api`
5. **Framework Preset**: Other
6. **Build Command**: (leave empty)
7. **Output Directory**: (leave empty)

8. **Set Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=your_connection_string
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key
GEMINI_MODEL=models/gemini-2.5-flash
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
FRONTEND_URL=https://idea-catalyst-frontend.vercel.app
```

### Step 4: Update Frontend API URL
After backend deploys, update frontend environment variable:
- `VITE_API_URL` = `https://idea-catalyst-api.vercel.app/api`

### Step 5: Redeploy Frontend
Trigger a redeploy so it uses the correct API URL.

---

## OR: Quick Fix for Current Setup

1. Use this `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. Remove `api.js` from root (already done)

3. Push and let Vercel auto-deploy

4. For API, use Railway/Render instead of Vercel

This is simpler and will work immediately!
