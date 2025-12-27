@echo off
REM GearGuard Quick Start Script for Windows

echo.
echo ========================================
echo GearGuard - Maintenance Tracker
echo Quick Start Guide
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please download from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version

REM Check if MongoDB is installed and running
echo.
echo Checking MongoDB status...
sc query MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB service not found
    echo Please ensure MongoDB is installed and running
    echo Download from https://www.mongodb.com/try/download/community
    echo.
) else (
    echo [OK] MongoDB service detected
)

echo.
echo.
echo ========================================
echo Installation Steps:
echo ========================================
echo.
echo 1. First Time Setup:
echo    - This script will install dependencies for both frontend and backend
echo.
echo 2. Running the Application:
echo    - Backend will run on http://localhost:5000
echo    - Frontend will run on http://localhost:3000
echo.
echo ========================================
echo.

REM Navigate to backend and install
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

REM Navigate to frontend and install
echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo Terminal 1 - Start Backend:
echo   cd backend
echo   npm start
echo.
echo Terminal 2 - Start Frontend:
echo   cd frontend
echo   npm start
echo.
echo The frontend will automatically open in your browser at http://localhost:3000
echo.
pause
