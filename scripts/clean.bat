@echo off
setlocal
cd /d "%~dp0\.."

echo ==========================================
echo Cleaning project - Deleting build artifacts
echo ==========================================
echo.

echo [1/9] Deleting bin folders...
for /d /r . %%d in (bin) do @if exist "%%d" (
    echo   Deleting: %%d
    rmdir /s /q "%%d" 2>nul
)

echo [2/9] Deleting obj folders...
for /d /r . %%d in (obj) do @if exist "%%d" (
    echo   Deleting: %%d
    rmdir /s /q "%%d" 2>nul
)

echo [3/9] Deleting node_modules folders...
for /d /r . %%d in (node_modules) do @if exist "%%d" (
    echo   Deleting: %%d
    rmdir /s /q "%%d" 2>nul
)

echo [4/9] Deleting coverage folders...
for /d /r . %%d in (coverage) do @if exist "%%d" (
    echo   Deleting: %%d
    rmdir /s /q "%%d" 2>nul
)

echo [5/9] Deleting .nyc_output folders...
for /d /r . %%d in (.nyc_output) do @if exist "%%d" (
    echo   Deleting: %%d
    rmdir /s /q "%%d" 2>nul
)

echo [6/9] Deleting dist folders...
for /d /r . %%d in (dist) do @if exist "%%d" (
    echo   Deleting: %%d
    rmdir /s /q "%%d" 2>nul
)

echo [7/9] Deleting build folders...
for /d /r . %%d in (build) do @if exist "%%d" (
    echo   Deleting: %%d
    rmdir /s /q "%%d" 2>nul
)

echo [8/9] Deleting coverage-report.json files...
for /r . %%f in (coverage-report.json) do @if exist "%%f" (
    echo   Deleting: %%f
    del /q "%%f" 2>nul
)

echo [9/9] Deleting TestResults folders...
for /d /r . %%d in (TestResults) do @if exist "%%d" (
    echo   Deleting: %%d
    rmdir /s /q "%%d" 2>nul
)

echo.
echo ==========================================
echo Cleanup Complete!
echo ==========================================
echo.
echo Deleted: bin, obj, node_modules, coverage, .nyc_output, dist, build, coverage-report.json, TestResults
pause
