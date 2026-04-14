@echo off
echo ========================================
echo  Restarting HireAI Frontend
echo ========================================
echo.

echo [1/3] Stopping any running processes...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Cleaning build cache...
cd frontend
if exist .next (
    rmdir /s /q .next
    echo Build cache cleared!
) else (
    echo No cache to clear.
)

echo [3/3] Starting development server...
echo.
echo ========================================
echo  Server starting on http://localhost:3000
echo ========================================
echo.
npm run dev
