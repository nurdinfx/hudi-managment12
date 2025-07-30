@echo off
echo.
echo ========================================
echo   Hotel Management App - Deploy Ready!
echo ========================================
echo.
echo Your project is ready for deployment!
echo.
echo Choose your deployment platform:
echo.
echo 1. Vercel (Recommended)
echo    - Go to: https://vercel.com
echo    - Sign up and create new project
echo    - Upload this folder or connect GitHub
echo.
echo 2. Netlify
echo    - Go to: https://netlify.com
echo    - Sign up and create new site
echo    - Connect GitHub repository
echo.
echo 3. Railway
echo    - Go to: https://railway.app
echo    - Sign up and create new project
echo    - Connect GitHub repository
echo.
echo ========================================
echo.
echo Don't forget to add environment variables:
echo NEXTAUTH_SECRET=your-secret-key
echo NEXTAUTH_URL=https://your-app-name.vercel.app
echo.
echo Press any key to open deployment guide...
pause >nul
start DEPLOYMENT_READY.md 