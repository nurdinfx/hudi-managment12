@echo off
echo Setting up environment variables to eliminate warnings...
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo Creating .env.local file...
    (
        echo # NextAuth Configuration
        echo NEXTAUTH_URL=http://localhost:3000
        echo NEXTAUTH_SECRET=your-secret-key-here-change-in-production
        echo.
        echo # Memory Management
        echo NODE_OPTIONS=--max-old-space-size=4096
        echo.
        echo # Next.js optimization
        echo NEXT_TELEMETRY_DISABLED=1
        echo.
        echo # Development optimizations
        echo NODE_ENV=development
        echo.
        echo # Disable debug mode
        echo NEXTAUTH_DEBUG=false
    ) > .env.local
    echo .env.local created successfully!
) else (
    echo .env.local already exists.
)

echo.
echo Environment setup complete!
echo You can now run: npm run dev:light
pause 