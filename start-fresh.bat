@echo off
echo Clearing all caches and starting fresh...
echo.

REM Stop any running processes
taskkill /f /im node.exe 2>nul
echo Stopped any running Node.js processes.

REM Clear Next.js cache
if exist .next rmdir /s /q .next
echo Cleared .next cache.

REM Clear node_modules cache
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo Cleared node_modules cache.

REM Clear npm cache
npm cache clean --force
echo Cleared npm cache.

REM Set minimal memory usage
set NODE_OPTIONS=--max-old-space-size=2048 --max-semi-space-size=256
set NEXT_TELEMETRY_DISABLED=1
set NEXTAUTH_DEBUG=false

echo.
echo Starting with minimal memory usage...
echo Memory limit: 2GB
echo.

REM Start the application
npx next dev 