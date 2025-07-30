# Hotel Management System

A full-stack hotel management application built with Next.js, Sanity CMS, and Stripe payments.

## 🚀 Deployment Guide

### Option 1: Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/hotel-management.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   ```
   # Sanity
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_STUDIO_TOKEN=your_sanity_token
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   
   # OAuth Providers
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Configure Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `out` folder or connect GitHub
   - Set build command: `npm run build`
   - Set publish directory: `.next`

3. **Add environment variables** (same as Vercel)

### Option 3: Deploy to Railway

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway will auto-detect Next.js

2. **Add environment variables** (same as Vercel)

### Option 4: Deploy to DigitalOcean App Platform

1. **Connect to DigitalOcean**
   - Go to [digitalocean.com](https://digitalocean.com)
   - Create an App Platform project
   - Connect your GitHub repository

2. **Configure build settings**
   - Build command: `npm run build`
   - Run command: `npm start`

## 🔧 Pre-deployment Checklist

### 1. Set up Sanity Studio
```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Initialize Sanity (if not already done)
sanity init

# Deploy Sanity Studio
sanity deploy
```

### 2. Configure Stripe
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Set up webhooks for payment confirmation

### 3. Set up OAuth Providers

**GitHub OAuth:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth app
3. Set callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`

### 4. Environment Variables Setup

Create a `.env.local` file for local development:
```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_TOKEN=your_token

# NextAuth
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## 🚀 Quick Deploy Commands

### Vercel CLI (Alternative)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Manual Build & Deploy
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start production server
npm start
```

## 📝 Post-deployment

1. **Test all features:**
   - User registration/login
   - Room booking
   - Payment processing
   - Admin dashboard

2. **Set up custom domain** (optional):
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain
   - Update DNS records

3. **Monitor performance:**
   - Use Vercel Analytics
   - Monitor error logs
   - Set up uptime monitoring

## 🔒 Security Considerations

1. **Environment variables:** Never commit secrets to Git
2. **HTTPS:** All production deployments should use HTTPS
3. **CORS:** Configure CORS for API routes if needed
4. **Rate limiting:** Consider adding rate limiting for API routes
5. **Input validation:** Ensure all user inputs are validated

## 📊 Monitoring & Analytics

- **Vercel Analytics:** Built-in performance monitoring
- **Sentry:** Error tracking and monitoring
- **Google Analytics:** User behavior tracking

## 🆘 Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check all environment variables are set
   - Ensure all dependencies are installed
   - Check for TypeScript errors

2. **API routes not working:**
   - Verify environment variables
   - Check CORS settings
   - Ensure proper authentication

3. **Database connection issues:**
   - Verify Sanity project ID and dataset
   - Check API token permissions
   - Ensure dataset exists

4. **Payment issues:**
   - Verify Stripe keys are correct
   - Check webhook configuration
   - Ensure proper error handling

For more help, check the [Next.js deployment documentation](https://nextjs.org/docs/deployment) or [Vercel documentation](https://vercel.com/docs).
