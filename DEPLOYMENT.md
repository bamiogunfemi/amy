# 🚀 Amy Platform - Deployment Guide

## Overview

This guide covers deploying all Amy platform applications to production using free tier services.

## 🎯 **Recommended Hosting Strategy**

### **Frontend Apps (Vercel)**

- **Web App**: `https://amy-web.vercel.app`
- **Recruiter App**: `https://amy-app.vercel.app`
- **Admin App**: `https://amy-admin.vercel.app`

### **Backend API (Railway - Recommended)**

- **API Server**: `https://amy-api.railway.app`
- **Cost**: $5/month (free tier)
- **Features**: Auto-deploy, SSL, custom domains

## 📋 **Prerequisites**

1. **GitHub Account** (for Vercel deployment)
2. **Railway Account** (for API backend)
3. **Database**: PostgreSQL (Supabase, Railway, or Neon)
4. **Environment Variables** configured

## 🚀 **Step 1: Deploy Frontend Apps to Vercel**

### **Web App Deployment**

```bash
# 1. Push to GitHub
git add .
git commit -m "Add Vercel configuration"
git push origin main

# 2. Deploy to Vercel
# - Go to https://vercel.com
# - Import your GitHub repository
# - Set root directory to: apps/web
# - Build command: pnpm build
# - Output directory: dist
```

### **Recruiter App Deployment**

```bash
# 1. Create new Vercel project
# - Import same GitHub repository
# - Set root directory to: apps/app
# - Build command: pnpm build
# - Output directory: dist
```

### **Admin App Deployment**

```bash
# 1. Create new Vercel project
# - Import same GitHub repository
# - Set root directory to: apps/admin
# - Build command: pnpm build
# - Output directory: dist
```

## 🔧 **Step 2: Deploy Backend API**

### **Option A: Railway (Recommended)**

1. **Sign up**: https://railway.app
2. **Create new project**
3. **Deploy from GitHub**:

   - Select your repository
   - Set root directory to: `apps/api`
   - Railway will auto-detect Node.js

4. **Environment Variables** (set in Railway dashboard):

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_s3_bucket
```

### **Option B: Render (Free Tier)**

1. **Sign up**: https://render.com
2. **Create new Web Service**
3. **Connect GitHub repository**
4. **Configure**:
   - Root Directory: `apps/api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node

### **Option C: Fly.io (Free Tier)**

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`
2. **Login**: `fly auth login`
3. **Deploy**:

```bash
cd apps/api
fly launch
fly deploy
```

## 🗄️ **Step 3: Database Setup**

### **Option A: Supabase (Recommended)**

1. **Sign up**: https://supabase.com
2. **Create new project**
3. **Get connection string**
4. **Run migrations**:

```bash
pnpm db:migrate
pnpm db:seed
```

### **Option B: Railway PostgreSQL**

1. **Add PostgreSQL service** in Railway
2. **Link to your API service**
3. **Run migrations**:

```bash
pnpm db:migrate
pnpm db:seed
```

### **Option C: Neon (Free Tier)**

1. **Sign up**: https://neon.tech
2. **Create new project**
3. **Get connection string**
4. **Run migrations**

## 🔐 **Step 4: Environment Variables**

### **Frontend Apps (Vercel)**

Set these in each Vercel project's environment variables:

```env
VITE_API_URL=https://amy-api.railway.app
VITE_APP_NAME=Amy Recruitment Platform
```

### **Backend API**

Set these in your backend hosting platform:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis (optional, for sessions)
REDIS_URL=redis://localhost:6379
```

## 🔄 **Step 5: Update API URLs**

After deployment, update the API URLs in your frontend apps:

### **Update Constants**

```typescript
// packages/ui/src/constants/index.ts
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://amy-api.railway.app"
    : "http://localhost:3001";
```

### **Update CORS Settings**

The API server is already configured to accept requests from your Vercel domains.

## 🧪 **Step 6: Testing Deployment**

### **Health Check**

```bash
curl https://amy-api.railway.app/api/health
```

### **Test Frontend Apps**

1. **Web App**: https://amy-web.vercel.app
2. **Recruiter App**: https://amy-app.vercel.app
3. **Admin App**: https://amy-admin.vercel.app

## 📊 **Monitoring & Maintenance**

### **Vercel Analytics**

- Enable Vercel Analytics for performance monitoring
- Set up error tracking

### **Railway Monitoring**

- Monitor API performance in Railway dashboard
- Set up alerts for downtime

### **Database Monitoring**

- Monitor database performance
- Set up automated backups

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Build Failures**

   - Check build logs in Vercel/Railway
   - Ensure all dependencies are installed
   - Verify TypeScript compilation

2. **CORS Errors**

   - Verify CORS configuration in API
   - Check frontend URLs are whitelisted

3. **Database Connection**

   - Verify DATABASE_URL is correct
   - Check database is accessible from hosting platform

4. **Environment Variables**
   - Ensure all required variables are set
   - Check for typos in variable names

### **Useful Commands**

```bash
# Check API health
curl https://your-api-url/api/health

# Test database connection
pnpm db:studio

# View logs (Railway)
railway logs

# View logs (Vercel)
vercel logs
```

## 💰 **Cost Breakdown**

### **Free Tier Services**

- **Vercel**: Free (3 projects, 100GB bandwidth)
- **Railway**: $5/month (generous free tier)
- **Supabase**: Free (500MB database, 50MB file storage)
- **Total**: ~$5/month

### **Optional Paid Services**

- **Vercel Pro**: $20/month (unlimited projects)
- **Railway Pro**: $20/month (more resources)
- **Supabase Pro**: $25/month (more storage/bandwidth)

## 🎉 **Success!**

Your Amy platform is now deployed and ready for production use!

- **Landing Page**: https://amy-web.vercel.app
- **Recruiter Dashboard**: https://amy-app.vercel.app
- **Admin Dashboard**: https://amy-admin.vercel.app
- **API Backend**: https://amy-api.railway.app
