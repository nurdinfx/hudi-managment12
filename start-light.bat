@echo off
echo Starting hotel management app with minimal memory usage...
echo.

REM Clear Next.js cache
if exist .next rmdir /s /q .next
echo Cache cleared.

REM Set environment variables for minimal memory usage
set NODE_OPTIONS=--max-old-space-size=2048 --max-semi-space-size=256
set NEXT_TELEMETRY_DISABLED=1
set NEXTAUTH_DEBUG=false

echo Memory limit: 2GB
echo Starting development server...

REM Start the application
npx next dev --turbo 