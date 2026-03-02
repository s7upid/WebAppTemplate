@echo off
REM ============================================
REM 1. Backend (.NET) Coverage
REM ============================================
REM Runs .NET unit/integration tests with coverage
REM Output: coverage/report/Cobertura.xml
REM ============================================

echo.
echo ==========================================
echo Backend (.NET) Coverage Generation
echo ==========================================
echo.

REM Get script directory and set paths
SET SCRIPT_DIR=%~dp0
SET ROOT_DIR=%SCRIPT_DIR%..
cd /d "%ROOT_DIR%"

REM Paths (use BE_COVERAGE_DIR to avoid overwriting parent COVERAGE_DIR when called from generate-test-report)
SET TEST_PROJECT=Template.Tests\Template.Tests.csproj
SET BUILD_DIR=Template.Tests\bin\Debug\net10.0
SET TEST_DLL=%BUILD_DIR%\Template.Tests.dll
SET BE_COVERAGE_DIR=.\coverage
SET COVERAGE_FILE=%BE_COVERAGE_DIR%\coverage.info
SET REPORT_DIR=%BE_COVERAGE_DIR%\report
SET INDEX_FILE=%REPORT_DIR%\index.html

REM Create coverage folder if it doesn't exist
IF NOT EXIST "%BE_COVERAGE_DIR%" (
    mkdir "%BE_COVERAGE_DIR%"
)

REM Install coverlet.console if missing
dotnet tool list -g | findstr /i "coverlet.console"
IF ERRORLEVEL 1 (
    dotnet tool install --global coverlet.console
)

REM Install ReportGenerator if missing
dotnet tool list -g | findstr /i "dotnet-reportgenerator-globaltool"
IF ERRORLEVEL 1 (
    dotnet tool install --global dotnet-reportgenerator-globaltool
)

REM Build test project
dotnet build %TEST_PROJECT%

REM Run coverlet.console to collect coverage (unit tests only; integration tests require Docker)
coverlet "%TEST_DLL%" ^
    --target "dotnet" ^
    --targetargs "test %TEST_PROJECT% --no-build --filter Category=Unit" ^
    --output "%COVERAGE_FILE%" ^
    --format lcov ^
    --include "[Template.Server*]*" ^
    --include "[Template.Data*]*" ^
    --exclude "[*]*Program.cs" ^
    --exclude "[*]*Migrations*" ^
    --exclude "[*]*OpenApi*" ^
    --exclude-by-attribute "ExcludeFromCodeCoverage"

REM Generate HTML + Cobertura report
reportgenerator "-reports:%COVERAGE_FILE%" "-targetdir:%REPORT_DIR%" "-reporttypes:Html,Cobertura"

echo ======================================
echo Coverage report generated in: %REPORT_DIR%
echo ======================================

exit /b 0
