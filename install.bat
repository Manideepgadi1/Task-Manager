@echo off
echo ========================================
echo   Task Manager - Installation Script
echo ========================================
echo.

echo [1/4] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo [3/4] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b %errorlevel%
)

cd ..

echo.
echo ========================================
echo   Installation Complete! ✓
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run: cd backend
echo 3. Run: npm run seed
echo 4. Run: cd ..
echo 5. Run: npm run dev
echo.
echo For detailed instructions, see README.md or QUICKSTART.md
echo.
pause
