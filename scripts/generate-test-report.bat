@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%.."
set "COVERAGE_DIR=%SCRIPT_DIR%coverage"

cd /d "%ROOT_DIR%"

echo.
echo ==========================================
echo Running All Coverage Generation
echo ==========================================
echo.

set BACKEND_FAILED=0
set JEST_FAILED=0
set CYPRESS_FAILED=0

echo [1/5] Running Backend (.NET) Coverage...
echo ----------------------------------------
call "%COVERAGE_DIR%\1-run-be-coverage.bat"
if errorlevel 1 (set BACKEND_FAILED=1) else echo [SUCCESS] Backend coverage generated
echo.

echo [2/5] Running Frontend Jest Coverage...
echo ----------------------------------------
call "%COVERAGE_DIR%\2-run-fe-jest-coverage.bat"
if errorlevel 1 (set JEST_FAILED=1) else echo [SUCCESS] Jest coverage generated
echo.

echo [3/5] Running Frontend Cypress Coverage...
echo ----------------------------------------
call "%COVERAGE_DIR%\3-run-fe-cypress-coverage.bat"
if errorlevel 1 (set CYPRESS_FAILED=1) else echo [SUCCESS] Cypress coverage generated
echo.

echo [4/5] Extracting Coverage Results...
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

echo [5/5] Updating README Badges...
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
