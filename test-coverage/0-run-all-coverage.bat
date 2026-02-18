@echo off
REM ============================================
REM 0. Run All Coverage (Master Script)
REM ============================================
REM Runs all coverage scripts in sequence:
REM   1. Backend (.NET) Coverage
REM   2. Frontend Jest Coverage
REM   3. Frontend Cypress Coverage
REM   4. Extract Results
REM   5. Update README Badges
REM ============================================

echo.
echo ==========================================
echo Running All Coverage Generation
echo ==========================================
echo.

REM Get script directory
SET SCRIPT_DIR=%~dp0
SET ROOT_DIR=%SCRIPT_DIR%..

REM Step 1: Backend Coverage
echo [1/5] Running Backend (.NET) Coverage...
echo ----------------------------------------
call "%SCRIPT_DIR%1-run-be-coverage.bat"
if %errorlevel% neq 0 (
    echo [WARNING] Backend coverage generation had issues
    set BACKEND_FAILED=1
) else (
    echo [SUCCESS] Backend coverage generated
    set BACKEND_FAILED=0
)
echo.

REM Step 2: Jest Coverage
echo [2/5] Running Frontend Jest Coverage...
echo ----------------------------------------
call "%SCRIPT_DIR%2-run-fe-jest-coverage.bat"
if %errorlevel% neq 0 (
    echo [WARNING] Jest coverage generation had issues
    set JEST_FAILED=1
) else (
    echo [SUCCESS] Jest coverage generated
    set JEST_FAILED=0
)
echo.

REM Step 3: Cypress Coverage
echo [3/5] Running Frontend Cypress Coverage...
echo ----------------------------------------
call "%SCRIPT_DIR%3-run-fe-cypress-coverage.bat"
if %errorlevel% neq 0 (
    echo [WARNING] Cypress coverage generation had issues
    set CYPRESS_FAILED=1
) else (
    echo [SUCCESS] Cypress coverage generated
    set CYPRESS_FAILED=0
)
echo.

REM Step 4: Extract Results
echo [4/5] Extracting Coverage Results...
echo ----------------------------------------
cd /d "%SCRIPT_DIR%"
if not exist "node_modules" (
    echo Installing npm dependencies for coverage scripts...
    call npm install
)
node 4-extract-results.js
if %errorlevel% neq 0 (
    echo [WARNING] Coverage extraction had issues
) else (
    echo [SUCCESS] Coverage results extracted
)
echo.

REM Step 5: Update README Badges
echo [5/5] Updating README Badges...
echo ----------------------------------------
node 5-update-readme-badges.js
if %errorlevel% neq 0 (
    echo [WARNING] README badge update had issues
) else (
    echo [SUCCESS] README badges updated
)
echo.

REM Summary
echo ==========================================
echo Coverage Generation Complete
echo ==========================================
echo.
echo Coverage Reports:
if %BACKEND_FAILED%==0 (
    echo   Backend:  %ROOT_DIR%\coverage\report\index.html
) else (
    echo   Backend:  [FAILED]
)
if %JEST_FAILED%==0 (
    echo   Jest:     %ROOT_DIR%\Template.Client\coverage\jest\index.html
) else (
    echo   Jest:     [FAILED]
)
if %CYPRESS_FAILED%==0 (
    echo   Cypress:  %ROOT_DIR%\Template.Client\coverage\cypress\out.json
) else (
    echo   Cypress:  [FAILED]
)
echo.
echo Results:   %ROOT_DIR%\Template.Client\coverage-report.json
echo Badges:    Updated in Template.Client\README.md
echo.

pause

