@echo off
REM ============================================
REM 2. Frontend Jest (Unit Test) Coverage
REM ============================================
REM Runs Jest unit tests with coverage
REM Output: Template.Client/coverage/jest/
REM ============================================

echo.
echo ==========================================
echo Frontend Jest (Unit Test) Coverage
echo ==========================================
echo.

REM Get script directory and set paths
SET SCRIPT_DIR=%~dp0
SET ROOT_DIR=%SCRIPT_DIR%..
SET CLIENT_DIR=%ROOT_DIR%\Template.Client

cd /d "%CLIENT_DIR%"
echo Working directory: %CD%

REM Check if node_modules exists, install if not
if not exist "node_modules" (
    echo node_modules not found, installing npm dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed!
        exit /b 1
    )
) else (
    echo node_modules found
)

REM Run Jest tests with coverage
echo.
echo Running Jest tests with coverage...
call node_modules\.bin\jest --config jest.config.ts --coverage

if %errorlevel% neq 0 (
    echo [WARNING] Jest tests had some failures
)

echo.
echo ==========================================
echo Jest Coverage Complete
echo ==========================================
echo Report: %CLIENT_DIR%\coverage\jest\index.html
echo ==========================================

exit /b 0
