# 🚨 Railway Deployment Fix Guide

## Current Issue
Railway is failing with "Error creating build plan with Railpack" because it's trying to deploy from the root directory instead of the backend directory.

## 🔧 Quick Fix Solutions

### Option 1: Deploy Backend Directory Only (Recommended)

1. **Create a separate repository for backend**:
   ```bash
   # Create new repo for backend only
   cd backend
   git init
   git add .
   git commit -m "Initial backend setup for Railway"
   git remote add origin https://github.com/yourusername/cbtc-backend.git
   git push -u origin main
   ```

2. **Connect this new repo to Railway**
   - Go to Railway dashboard
   - Create new project
   - Connect the backend-only repository

### Option 2: Configure Railway for Monorepo

1. **In Railway Dashboard**:
   - Go to your project settings
   - Set **Root Directory** to `backend`
   - Or set **Build Command** to `cd backend && npm ci && npx prisma generate`
   - Set **Start Command** to `cd backend && npx prisma migrate deploy && npm start`

### Option 3: Use Railway CLI with Specific Directory

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy from backend directory
cd backend
railway up
```

## 🗄️ Database Setup

1. **Add PostgreSQL Service in Railway**:
   - In Railway dashboard, click "Add Service"
   - Select "PostgreSQL"
   - Railway will automatically provide `DATABASE_URL`

2. **Set Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secure-jwt-secret-here
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

## 🔍 Current Configuration Files

The following files are ready for deployment:
- ✅ `backend/railway.toml` - Railway configuration
- ✅ `backend/nixpacks.toml` - Build configuration
- ✅ `backend/package.json` - Updated with all dependencies
- ✅ `backend/prisma/schema.prisma` - Updated for PostgreSQL

## 🚀 Recommended Next Steps

1. **Option 1 (Separate Repo)** - Most reliable for Railway
2. Add PostgreSQL service in Railway
3. Set environment variables
4. Deploy should work automatically

---

**Need help?** Check Railway logs in the dashboard for specific error details.
