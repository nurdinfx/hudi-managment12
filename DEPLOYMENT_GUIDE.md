# 🚀 Hotel Management App - Deployment Guide

## **Option 1: Deploy to Vercel (Recommended)**

### **Step 1: Prepare Your Code**
```bash
# Make sure you're in your project directory
cd hotel-management-master

# Install dependencies
npm install

# Test the build
npm run build
```

### **Step 2: Push to GitHub**
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit for deployment"
git branch -M main

# Create a new repository on GitHub.com
# Then push your code:
git remote add origin https://github.com/YOUR_USERNAME/hotel-management.git
git push -u origin main
```

### **Step 3: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"

### **Step 4: Configure Environment Variables**
In Vercel dashboard, add these environment variables:

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app-name.vercel.app

# Sanity (if you have it set up)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_TOKEN=your_sanity_token

# OAuth Providers (optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## **Option 2: Deploy to Netlify**

### **Step 1: Build the Project**
```bash
npm run build
```

### **Step 2: Deploy to Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Connect your repository
5. Set build command: `npm run build`
6. Set publish directory: `.next`
7. Click "Deploy site"

## **Option 3: Deploy to Railway**

### **Step 1: Connect to Railway**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will auto-detect Next.js

### **Step 2: Add Environment Variables**
Add the same environment variables as Vercel.

## **🔧 Pre-Deployment Checklist**

### **✅ Before Deploying:**
1. **Test locally:** `npm run dev` works
2. **Build test:** `npm run build` succeeds
3. **Git repository:** Code is pushed to GitHub
4. **Environment variables:** Ready to add to platform
5. **Domain:** Decide if you want a custom domain

### **✅ After Deploying:**
1. **Test the live site**
2. **Check all features work**
3. **Test booking flow**
4. **Test payment methods**
5. **Set up custom domain (optional)**

## **🌐 Your App Will Be Live At:**
- **Vercel:** `https://your-app-name.vercel.app`
- **Netlify:** `https://your-app-name.netlify.app`
- **Railway:** `https://your-app-name.railway.app`

## **📞 Need Help?**
- Check the platform's documentation
- Most platforms have excellent Next.js support
- Environment variables are the most common issue

## **🎯 Recommended: Vercel**
Vercel is the easiest and most reliable option for Next.js apps. It's created by the same team as Next.js and provides the best performance and features.

---
**Ready to deploy? Choose your platform and follow the steps above!** 