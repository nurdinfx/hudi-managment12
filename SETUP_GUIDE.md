# 🏨 Hotel Management App - Complete Setup Guide

## 🚀 Quick Start (Development Mode)

### 1. Environment Variables Setup

Create a `.env.local` file in the project root with:

```env
# Required for basic functionality
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Optional - for full CMS functionality
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_TOKEN=your-sanity-token

# Optional - for OAuth login
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional - for payment processing
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 2. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Start Development Server

```bash
npm run dev
```

## 🔧 Current Issues & Solutions

### ✅ FIXED ISSUES:
- ✅ Sanity CMS fallback data working
- ✅ Application running without crashes
- ✅ Core functionality operational

### 🔧 REMAINING ISSUES:
- ⚠️ NextAuth warnings (missing environment variables)
- ⚠️ Webpack caching warning (minor performance issue)

## 📋 What You Can Do Now

### 🎯 **Option 1: Quick Development Setup**
1. Create `.env.local` with just NEXTAUTH_SECRET
2. App will work with fallback data
3. Perfect for frontend development

### 🎯 **Option 2: Full CMS Setup**
1. Set up Sanity CMS project
2. Add all environment variables
3. Full functionality with real data

### 🎯 **Option 3: Production Ready**
1. Set up all services (Sanity, OAuth, Stripe)
2. Configure for production deployment
3. Complete hotel management system

## 🛠️ Next Steps

Choose your path and I'll help you implement it! 