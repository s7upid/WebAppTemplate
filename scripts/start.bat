@echo off
setlocal
cd /d "%~dp0\.."

echo ========================================
echo Starting Application
echo ========================================
echo.

echo [1/4] Starting PostgreSQL Docker container...
docker compose up -d db
if errorlevel 1 (
    echo ERROR: Failed to start PostgreSQL container!
    echo Make sure Docker Desktop is running.
    exit /b 1
)

echo Waiting for PostgreSQL to be ready...
:waitpg
docker compose exec db pg_isready -U postgres -d template >nul 2>&1
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto waitpg
)
echo PostgreSQL is ready on port 5444.
echo.

echo [2/4] Applying database migrations...
set ASPNETCORE_ENVIRONMENT=Development
dotnet ef database update --project Template.Data --startup-project Template.Server
if errorlevel 1 (
    echo WARNING: Migrations failed. Backend may still start and apply them on first run.
) else (
    echo Migrations applied successfully.
)
echo.

echo [3/4] Starting .NET Backend Server in new window...
start "Backend" cmd /k "cd /d "%~dp0\.." && set ASPNETCORE_ENVIRONMENT=Development && dotnet run --project Template.Server/Template.Server.csproj"

echo [4/4] Starting Vite Frontend Dev Server in new window...
if not exist "Template.Client\node_modules" (
    echo Installing frontend dependencies...
    cd Template.Client
    call npm install
    cd ..
)
start "Frontend" cmd /k "cd /d "%~dp0\..\Template.Client" && npm run dev"

echo.
echo ========================================
echo All services are starting:
echo   Database: localhost:5444 (PostgreSQL)
echo   Backend:  http://localhost:5249
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Backend and Frontend run in separate windows. Close those windows to stop.
pause
