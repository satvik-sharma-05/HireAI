# Backend Deployment Guide for Render

## Quick Setup

### 1. Render Configuration

**Service Settings:**
- **Name**: `hireai-backend`
- **Root Directory**: `backend`
- **Environment**: `Python 3`
- **Build Command**: `bash render-build.sh`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Instance Type**: Free

### 2. Environment Variables

Add these in Render dashboard:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hireai?retryWrites=true&w=majority
OPENROUTER_API_KEY=your_openrouter_api_key
SECRET_KEY=your_secret_key_here
FRONTEND_URL=https://your-vercel-url.vercel.app
```

### 3. Python Version

The `runtime.txt` file specifies Python 3.10.13 for optimal compatibility with pre-built wheels.

### 4. Build Time

Expected build time: **2-4 minutes**

## Optimizations Applied

1. **Python 3.10.13** - Best compatibility with spaCy pre-built wheels
2. **Direct wheel installation** - spaCy model installed via URL (no compilation)
3. **Minimal dependencies** - Only essential packages included
4. **Fast build script** - Streamlined installation process

## Troubleshooting

### Build taking too long?
- Check Python version is 3.10.13
- Verify spaCy model URL is accessible
- Check Render build logs for compilation warnings

### spaCy model not loading?
- The app will still run without spaCy (graceful degradation)
- Check environment variables are set correctly

### Connection errors?
- Verify MongoDB URI is correct
- Check FRONTEND_URL matches your Vercel deployment
- Ensure OPENROUTER_API_KEY is valid

## Post-Deployment

After successful deployment:

1. Copy your Render backend URL (e.g., `https://hireai-backend.onrender.com`)
2. Update Vercel environment variable:
   - Go to Vercel → Project Settings → Environment Variables
   - Edit `NEXT_PUBLIC_API_URL` to your Render URL
   - Redeploy frontend

## Health Check

Test your backend:
```
curl https://your-backend-url.onrender.com/docs
```

You should see the FastAPI documentation page.
