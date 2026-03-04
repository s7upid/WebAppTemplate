@echo off
REM ============================================
REM 3. Frontend Cypress (E2E) Coverage
REM ============================================
REM Runs Cypress E2E tests with coverage
REM Output: Template.Client/coverage/cypress/
REM ============================================

echo.
echo ==========================================
echo Frontend Cypress (E2E) Coverage
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
    echo Installing npm dependencies...
    call npm install
)

REM Build application with coverage instrumentation
echo [1/4] Building application with coverage instrumentation...
set CYPRESS_COVERAGE=true
call npm run build:coverage
if %errorlevel% neq 0 (
    echo Build with coverage failed!
    exit /b 1
)

REM Start development server with coverage instrumentation
echo [2/4] Starting development server with coverage instrumentation...
set CYPRESS_COVERAGE=true
set ENABLE_COVERAGE=true
set NODE_ENV=development

REM Start the dev server in background with coverage mode
echo Starting Vite dev server on port 3000...
start /MIN cmd /C "cd /d %CLIENT_DIR% && set CYPRESS_COVERAGE=true && set ENABLE_COVERAGE=true && set NODE_ENV=development && node_modules\.bin\vite --mode coverage --port 3000"

REM Wait for server to be ready
echo Waiting for development server to start...
timeout /t 10 /nobreak >nul

REM Verify server is running on port 3000
echo Verifying server is running on port 3000...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5 -UseBasicParsing; Write-Host '[SUCCESS] Server is running on port 3000' } catch { Write-Host '[INFO] Server not ready on port 3000, waiting more...'; Start-Sleep -Seconds 5; try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5 -UseBasicParsing; Write-Host '[SUCCESS] Server is now running on port 3000' } catch { Write-Host '[ERROR] Server failed to start on port 3000'; exit 1 } }"

if %errorlevel% neq 0 (
    echo [ERROR] Development server failed to start
    goto cleanup_and_exit
)

set SERVER_PORT=3000
echo [SUCCESS] Development server is ready on port %SERVER_PORT%

REM Generate Cypress coverage against running app
echo [3/4] Running Cypress tests with coverage (output: coverage/cypress)...
set NYC_OUTPUT_DIR=%CLIENT_DIR%\coverage\cypress
if not exist "%NYC_OUTPUT_DIR%" mkdir "%NYC_OUTPUT_DIR%"

REM Clean up stale coverage files
if exist "%NYC_OUTPUT_DIR%\out.json" del /F "%NYC_OUTPUT_DIR%\out.json"
if exist "%CLIENT_DIR%\.nyc_output\out.json" del /F "%CLIENT_DIR%\.nyc_output\out.json"
if exist "%CLIENT_DIR%\.c8_output" rmdir /S /Q "%CLIENT_DIR%\.c8_output"

echo NYC output directory: %NYC_OUTPUT_DIR%

REM Run Cypress tests in parallel (4 processes) with coverage enabled
echo Running Cypress tests in parallel with coverage...
call npm run cypress:run:parallel:coverage

set CYPRESS_EXIT_CODE=%errorlevel%
echo Cypress tests completed with exit code: %CYPRESS_EXIT_CODE%

REM Merge per-split coverage files into final output
echo Merging coverage from parallel processes...
call npm run cypress:merge-coverage

REM Look for coverage data in multiple possible locations
echo Looking for coverage data...

REM Check coverage/cypress folder (primary location)
if exist "%CLIENT_DIR%\coverage\cypress\out.json" (
    echo [SUCCESS] Found coverage in coverage/cypress folder
    echo Coverage location: %CLIENT_DIR%\coverage\cypress\out.json
    goto coverage_found
)

REM Check .nyc_output folder (fallback location)
if exist "%CLIENT_DIR%\.nyc_output\out.json" (
    echo Found coverage in .nyc_output folder, copying to coverage/cypress...
    copy /Y "%CLIENT_DIR%\.nyc_output\out.json" "%NYC_OUTPUT_DIR%\out.json"
    echo [SUCCESS] Coverage copied to %NYC_OUTPUT_DIR%\out.json
    goto coverage_found
)

echo [WARNING] No coverage data found
echo.
echo This usually means one of:
echo   1. The app was not built with coverage instrumentation (npm run build:coverage)
echo   2. ENABLE_COVERAGE=true was not passed to Cypress
echo   3. The vite-plugin-istanbul is not instrumenting the code
echo.

:coverage_found

REM Stop the development server
echo [4/4] Stopping development server...
taskkill /F /IM node.exe >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":%SERVER_PORT%" ^| find "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
echo Development server stopped

:cleanup_and_exit
echo.
if %CYPRESS_EXIT_CODE% equ 0 (
    echo [SUCCESS] Cypress coverage generation completed!
) else (
    echo [WARNING] Cypress tests had issues
)
echo [INFO] Cypress coverage: coverage/cypress/out.json

exit /b %CYPRESS_EXIT_CODE%

