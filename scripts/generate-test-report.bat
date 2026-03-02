@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%.."
set "COVERAGE_DIR=%ROOT_DIR%\test-coverage"

cd /d "%ROOT_DIR%"

echo.
echo ==========================================
echo Running All Coverage Generation
echo ==========================================
echo.

set BACKEND_FAILED=0
set JEST_FAILED=0
set CYPRESS_FAILED=0

echo [0/6] Running Lint...
echo ----------------------------------------
cd /d "%ROOT_DIR%\Template.Client"
if not exist "node_modules" (
    echo Installing Template.Client dependencies...
    call npm install
)
cd /d "%ROOT_DIR%"
call npm run lint
if errorlevel 1 (
    echo [ERROR] Lint failed. Fix lint errors and run again.
    pause
    exit /b 1
)
echo [SUCCESS] Lint passed.
echo.

echo [1/6] Running Backend (.NET) Coverage...
echo ----------------------------------------
set "SAVED_COVERAGE_DIR=%COVERAGE_DIR%"
call "%COVERAGE_DIR%\1-run-be-coverage.bat"
set "COVERAGE_DIR=%SAVED_COVERAGE_DIR%"
if errorlevel 1 (set BACKEND_FAILED=1) else echo [SUCCESS] Backend coverage generated
echo.

echo [2/6] Running Frontend Jest Coverage...
echo ----------------------------------------
set "SAVED_COVERAGE_DIR=%COVERAGE_DIR%"
call "%COVERAGE_DIR%\2-run-fe-jest-coverage.bat"
set "COVERAGE_DIR=%SAVED_COVERAGE_DIR%"
if errorlevel 1 (set JEST_FAILED=1) else echo [SUCCESS] Jest coverage generated
echo.

echo [3/6] Running Frontend Cypress Coverage...
echo ----------------------------------------
set "SAVED_COVERAGE_DIR=%COVERAGE_DIR%"
call "%COVERAGE_DIR%\3-run-fe-cypress-coverage.bat"
set "COVERAGE_DIR=%SAVED_COVERAGE_DIR%"
if errorlevel 1 (set CYPRESS_FAILED=1) else echo [SUCCESS] Cypress coverage generated
echo.

echo [4/6] Extracting Coverage Results...
echo ----------------------------------------
cd /d "%COVERAGE_DIR%"
if not exist "node_modules" (
    echo Installing npm dependencies for coverage scripts...
    call npm install
)
cd /d "%ROOT_DIR%"
node "%COVERAGE_DIR%\4-extract-results.js"
if errorlevel 1 (echo [WARNING] Coverage extraction had issues) else echo [SUCCESS] Coverage results extracted
echo.

echo [5/6] Updating README Badges...
echo ----------------------------------------
node "%COVERAGE_DIR%\5-update-readme-badges.js"
if errorlevel 1 (echo [WARNING] README badge update had issues) else echo [SUCCESS] README badges updated
echo.

echo ==========================================
echo Coverage Generation Complete
echo ==========================================
echo.
echo Results:   %ROOT_DIR%\Template.Client\coverage-report.json
echo Badges:    Updated in README.md
echo.
pause
