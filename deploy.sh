#!/bin/bash

# Hotel Management System Deployment Script
# This script helps you deploy your hotel management app

echo "🏨 Hotel Management System Deployment Script"
echo "============================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local file not found!"
    echo "📝 Please create a .env.local file with your environment variables:"
    echo ""
    echo "# Sanity"
    echo "NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id"
    echo "NEXT_PUBLIC_SANITY_DATASET=production"
    echo "SANITY_STUDIO_TOKEN=your_token"
    echo ""
    echo "# NextAuth"
    echo "NEXTAUTH_SECRET=your_secret_key"
    echo "NEXTAUTH_URL=http://localhost:3000"
    echo ""
    echo "# OAuth"
    echo "GITHUB_CLIENT_ID=your_github_client_id"
    echo "GITHUB_CLIENT_SECRET=your_github_client_secret"
    echo "GOOGLE_CLIENT_ID=your_google_client_id"
    echo "GOOGLE_CLIENT_SECRET=your_google_client_secret"
    echo ""
    echo "# Stripe"
    echo "STRIPE_SECRET_KEY=your_stripe_secret_key"
    echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key"
    echo "STRIPE_WEBHOOK_SECRET=your_webhook_secret"
    echo ""
    read -p "Press Enter after creating .env.local file..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Choose your deployment method:"
echo "1. Deploy to Vercel (Recommended)"
echo "2. Deploy to Netlify"
echo "3. Deploy to Railway"
echo "4. Manual deployment"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        echo "📝 Please follow these steps:"
        echo "1. Go to https://vercel.com"
        echo "2. Sign up/Login with GitHub"
        echo "3. Click 'New Project'"
        echo "4. Import your GitHub repository"
        echo "5. Add environment variables in Vercel dashboard"
        echo "6. Click 'Deploy'"
        echo ""
        echo "💡 Tip: You can also use 'vercel' command in terminal"
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        echo "📝 Please follow these steps:"
        echo "1. Go to https://netlify.com"
        echo "2. Sign up/Login"
        echo "3. Drag and drop your project folder"
        echo "4. Set build command: npm run build"
        echo "5. Set publish directory: .next"
        echo "6. Add environment variables"
        ;;
    3)
        echo "🚀 Deploying to Railway..."
        echo "📝 Please follow these steps:"
        echo "1. Go to https://railway.app"
        echo "2. Sign up/Login with GitHub"
        echo "3. Click 'New Project'"
        echo "4. Select 'Deploy from GitHub repo'"
        echo "5. Select your repository"
        echo "6. Add environment variables"
        ;;
    4)
        echo "📋 Manual Deployment Steps:"
        echo "1. Push your code to GitHub:"
        echo "   git remote add origin https://github.com/yourusername/hotel-management.git"
        echo "   git push -u origin main"
        echo ""
        echo "2. Choose a hosting platform:"
        echo "   - Vercel (recommended for Next.js)"
        echo "   - Netlify"
        echo "   - Railway"
        echo "   - DigitalOcean App Platform"
        echo "   - AWS Amplify"
        echo ""
        echo "3. Connect your GitHub repository"
        echo "4. Add environment variables"
        echo "5. Deploy!"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Set up your environment variables"
echo "2. Configure your domain (optional)"
echo "3. Test all features after deployment"
echo "4. Set up monitoring and analytics"
echo ""
echo "📖 For detailed instructions, check the README.md file"
echo "🆘 For help, check the troubleshooting section in README.md" 