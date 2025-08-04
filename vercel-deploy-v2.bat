@echo off
echo =================================
echo   Healthcare Scheduling System
echo   Vercel Deployment Script v2.0
echo =================================

:: Check if Vercel CLI is installed
echo.
echo [1/5] Checking Vercel CLI...
call vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI not found. Installing...
    call npm install -g vercel
    if errorlevel 1 (
        echo ❌ Failed to install Vercel CLI
        pause
        exit /b 1
    )
)

:: Build locally first
echo.
echo [2/5] Building project locally...
call npm run build
if errorlevel 1 (
    echo ❌ Local build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

:: Initialize/link Vercel project if needed
echo.
echo [3/5] Linking Vercel project...
if not exist ".vercel" (
    echo 📋 First time setup - please follow the prompts:
    echo    - Link to existing project? N
    echo    - Project name: healthcare-scheduling
    echo    - Directory: ./
    call vercel link
)

:: Deploy to production
echo.
echo [4/5] Deploying to Vercel...
call vercel --prod

if errorlevel 1 (
    echo.
    echo ❌ Deployment failed!
    echo.
    echo 🔧 Try manual deployment:
    echo 1. Go to https://vercel.com/new
    echo 2. Import from GitHub: Wolves124/healthcare-scheduling-sheet
    echo 3. Use Framework: Next.js
    echo 4. Leave all other settings as default
    echo 5. Add environment variables from .env.example
    echo.
    pause
    exit /b 1
)

:: Show success message
echo.
echo [5/5] ✅ Deployment completed!
echo.
echo 📋 Important next steps:
echo 1. Copy your Vercel domain URL
echo 2. Update NEXTAUTH_URL environment variable
echo 3. Redeploy once to apply the URL change
echo.
echo 🔗 Vercel Dashboard: https://vercel.com/dashboard
echo 📖 Manual setup guide: VERCEL_MANUAL_DEPLOY.md
echo.
pause
