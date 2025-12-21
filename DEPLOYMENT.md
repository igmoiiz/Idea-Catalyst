# Vercel Deployment Guide - Idea Catalyst

## Prerequisites
- Vercel account (free tier works fine)
- GitHub repository with your code
- MongoDB Atlas database (already configured)
- Gemini API key

---

## Step 1: Prepare Your Code

### ✅ Already Done:
- [x] Created `vercel.json` in root
- [x] Created `.vercelignore`
- [x] Updated `axios.ts` to use environment variable
- [x] Updated backend to export for Vercel serverless
- [x] Added `start` script to `api/package.json`
- [x] Added health check endpoint
- [x] Updated CORS for production

---

## Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (keep as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

---

## Step 4: Set Environment Variables in Vercel

Go to **Project Settings** → **Environment Variables** and add:

### Backend Variables (Production)
```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=models/gemini-2.5-flash
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
FRONTEND_URL=https://your-project.vercel.app
PORT=5000
```

### Frontend Variables (Production)
```
VITE_API_URL=https://your-project.vercel.app/api
```

**Important:** Set these for **Production** environment!

---

## Step 5: Redeploy

After setting environment variables:
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (⋯)
4. Click "Redeploy"

---

## Step 6: Verify Deployment

### Test Backend Health
```
https://your-project.vercel.app/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### Test Frontend
```
https://your-project.vercel.app
```
Should load your React app

### Test Full Flow
1. Register/Login
2. Submit an idea
3. Generate persona analysis
4. Like/Share functionality

---

## Troubleshooting

### Issue: API calls failing

**Check:**
1. Environment variable `VITE_API_URL` is set correctly
2. CORS is configured (check `FRONTEND_URL` env var)
3. Backend logs in Vercel dashboard

### Issue: Gemini API not working

**Check:**
1. `GEMINI_API_KEY` is set in Vercel env vars
2. `GEMINI_MODEL` is set to `models/gemini-2.5-flash`
3. Check backend logs for API errors

### Issue: MongoDB connection failed

**Check:**
1. `MONGODB_URI` is correct
2. MongoDB Atlas allows connections from `0.0.0.0/0` (all IPs)
3. Network access settings in MongoDB Atlas

### View Logs
- Vercel Dashboard → Your Project → Functions → View logs
- Real-time logs: `vercel logs --follow`

---

## Post-Deployment Updates

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
git push
```
Vercel auto-deploys on push!

### Update Backend
Same as above - push to GitHub, Vercel auto-deploys

---

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Frontend API endpoint | `https://your-app.vercel.app/api` |
| `MONGODB_URI` | Database connection | MongoDB Atlas connection string |
| `JWT_SECRET` | Auth token secret | Any long random string |
| `GEMINI_API_KEY` | AI API key | From Google AI Studio |
| `FRONTEND_URL` | CORS allowed origin | `https://your-app.vercel.app` |

---

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` and `VITE_API_URL` to use custom domain

---

## Performance Tips

1. **Enable Caching**: Vercel automatically caches static assets
2. **Optimize Images**: Use Vercel's Image Optimization
3. **Monitor**: Check Analytics tab for performance metrics
4. **Serverless Functions**: Stay within free tier limits (100GB-hours/month)

---

## Local Development vs Production

### Local:
```bash
npm run dev          # Frontend on :5173
cd api && npm run dev  # Backend on :5000
```

### Production:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-project.vercel.app/api/*`

Both served from same domain (no CORS issues!)

---

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] All environment variables set
- [ ] Deployment successful (green checkmark)
- [ ] Health endpoint returns OK
- [ ] Frontend loads correctly
- [ ] Can register/login
- [ ] Can submit ideas
- [ ] AI analysis works
- [ ] Like/share functional

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Check deployment logs in Vercel dashboard
