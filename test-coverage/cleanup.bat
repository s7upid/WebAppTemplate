@echo off
REM ============================================
REM Cleanup Script for Test Coverage Artifacts
REM ============================================
REM Removes all generated test coverage files
REM Run this before committing or to free disk space
REM ============================================

echo.
echo ==========================================
echo Test Coverage Cleanup
echo ==========================================
echo.

SET SCRIPT_DIR=%~dp0
SET ROOT_DIR=%SCRIPT_DIR%..
SET CLIENT_DIR=%ROOT_DIR%\Template.Client

echo Cleaning up test coverage artifacts...
echo.

REM Frontend Coverage
echo [1/4] Cleaning Frontend Jest coverage...
if exist "%CLIENT_DIR%\coverage" (
    rmdir /s /q "%CLIENT_DIR%\coverage"
    echo   - Removed: Template.Client\coverage
) else (
    echo   - Skipped: coverage folder not found
)

echo [2/4] Cleaning Frontend Cypress coverage artifacts...
if exist "%CLIENT_DIR%\.nyc_output" (
    rmdir /s /q "%CLIENT_DIR%\.nyc_output"
    echo   - Removed: Template.Client\.nyc_output
)
if exist "%CLIENT_DIR%\.c8_output" (
    rmdir /s /q "%CLIENT_DIR%\.c8_output"
    echo   - Removed: Template.Client\.c8_output
)
if exist "%CLIENT_DIR%\coverage-report.json" (
    del /q "%CLIENT_DIR%\coverage-report.json"
    echo   - Removed: Template.Client\coverage-report.json
)

REM Backend Coverage
echo [3/4] Cleaning Backend (.NET) coverage...
if exist "%ROOT_DIR%\coverage" (
    rmdir /s /q "%ROOT_DIR%\coverage"
    echo   - Removed: coverage
) else (
    echo   - Skipped: backend coverage folder not found
)

REM Test Results
echo [4/4] Cleaning Test Results...
if exist "%ROOT_DIR%\TestResults" (
    rmdir /s /q "%ROOT_DIR%\TestResults"
    echo   - Removed: TestResults
)
if exist "%ROOT_DIR%\Template.Tests\TestResults" (
    rmdir /s /q "%ROOT_DIR%\Template.Tests\TestResults"
    echo   - Removed: Template.Tests\TestResults
)

echo.
echo ==========================================
echo Cleanup Complete!
echo ==========================================
echo.
echo All test coverage artifacts have been removed.
echo You can now run the coverage scripts again to generate fresh reports.
echo.

pause
