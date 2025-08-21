# CBTC Platform Deployment Guide

This guide will help you deploy the CBTC platform with:
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Express.js + PostgreSQL)

## 📁 Project Structure

```
cbtc-platform/
├── frontend/          # Next.js 14 frontend application
├── backend/           # Express.js backend API
├── ai-service/        # Python AI service
└── deployment files   # Configuration files for deployment
```

## 🚀 Backend Deployment (Railway)

### Prerequisites
1. Railway account
2. GitHub repository
3. PostgreSQL database

### Steps

1. **Connect Repository to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Link your project
   railway link
   ```

2. **Configure Database**
   - In Railway dashboard, add PostgreSQL service
   - Railway will automatically provide `DATABASE_URL`

3. **Set Environment Variables**
   In Railway dashboard, set these variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secure-jwt-secret-here
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   PORT=4000
   ```

4. **Deploy Backend**
   ```bash
   # Deploy from backend directory
   cd backend
   railway up
   ```

### Railway Configuration
- `railway.toml` is configured for automatic deployment
- Health check endpoint: `/api/health`
- Start command: `npm start`

## 🌐 Frontend Deployment (Vercel)

### Prerequisites
1. Vercel account
2. GitHub repository

### Steps

1. **Connect Repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` directory as root

2. **Configure Build Settings**
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set Environment Variables**
   In Vercel dashboard, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
   ```

4. **Deploy**
   - Vercel will automatically deploy on git push
   - `vercel.json` is configured for optimal deployment

## 🔧 Environment Variables Summary

### Backend (Railway)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Auto-provided by Railway |
| `JWT_SECRET` | Secret for JWT tokens | `your-super-secure-secret` |
| `CORS_ORIGIN` | Frontend URL for CORS | `https://app.vercel.app` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `4000` |

### Frontend (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.railway.app` |

## 📋 Deployment Checklist

### Before Deployment
- [ ] Update CORS origins in backend
- [ ] Set strong JWT secret
- [ ] Test database connections
- [ ] Verify API endpoints work

### Railway Backend
- [ ] PostgreSQL service added
- [ ] Environment variables set
- [ ] Health check working (`/api/health`)
- [ ] Database migrations run

### Vercel Frontend
- [ ] Repository connected
- [ ] Build directory set to `frontend`
- [ ] Environment variables configured
- [ ] Domain configured (optional)

## 🔄 Continuous Deployment

Both platforms support automatic deployment:
- **Railway**: Deploys on push to main branch
- **Vercel**: Deploys on push to main branch

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` in backend matches frontend URL
   - Check Vercel domain in Railway environment variables

2. **Database Connection**
   - Verify `DATABASE_URL` in Railway
   - Run database migrations: `npx prisma migrate deploy`

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are listed in package.json

### Logs and Monitoring
- **Railway**: View logs in Railway dashboard
- **Vercel**: View function logs in Vercel dashboard

## 📞 Support

For deployment issues, check:
1. Railway dashboard logs
2. Vercel function logs
3. Browser developer console
4. Network tab for API calls

---

**Created by Abel Coulibaly - CBTC Platform**
*Excellence Entrepreneuriale & Innovation Technique*
