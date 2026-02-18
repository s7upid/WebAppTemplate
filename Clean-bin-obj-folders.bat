@echo off
SETLOCAL

echo ==========================================
echo Cleaning project - Deleting build artifacts
echo ==========================================
echo.

REM Recursively find and delete all bin folders
echo [1/9] Deleting bin folders...
for /d /r %%i in (bin) do (
    if exist "%%i" (
        echo   Deleting: %%i
        rmdir /s /q "%%i"
    )
)

REM Recursively find and delete all obj folders
echo [2/9] Deleting obj folders...
for /d /r %%i in (obj) do (
    if exist "%%i" (
        echo   Deleting: %%i
        rmdir /s /q "%%i"
    )
)

REM Recursively find and delete all node_modules folders
echo [3/9] Deleting node_modules folders...
for /d /r %%i in (node_modules) do (
    if exist "%%i" (
        echo   Deleting: %%i
        rmdir /s /q "%%i"
    )
)

REM Recursively find and delete all coverage folders
echo [4/9] Deleting coverage folders...
for /d /r %%i in (coverage) do (
    if exist "%%i" (
        echo   Deleting: %%i
        rmdir /s /q "%%i"
    )
)

REM Recursively find and delete all .nyc_output folders
echo [5/9] Deleting .nyc_output folders...
for /d /r %%i in (.nyc_output) do (
    if exist "%%i" (
        echo   Deleting: %%i
        rmdir /s /q "%%i"
    )
)

REM Recursively find and delete all dist folders
echo [6/9] Deleting dist folders...
for /d /r %%i in (dist) do (
    if exist "%%i" (
        echo   Deleting: %%i
        rmdir /s /q "%%i"
    )
)

REM Recursively find and delete all build folders (except in node_modules)
echo [7/9] Deleting build folders...
for /d /r %%i in (build) do (
    echo %%i | findstr /i "node_modules" >nul
    if errorlevel 1 (
        if exist "%%i" (
            echo   Deleting: %%i
            rmdir /s /q "%%i"
        )
    )
)

REM Delete coverage report JSON files
echo [8/9] Deleting coverage-report.json files...
for /r %%i in (coverage-report.json) do (
    if exist "%%i" (
        echo   Deleting: %%i
        del /q "%%i"
    )
)

REM Delete TestResults folders (.NET test results)
echo [9/9] Deleting TestResults folders...
for /d /r %%i in (TestResults) do (
    if exist "%%i" (
        echo   Deleting: %%i
        rmdir /s /q "%%i"
    )
)

echo.
echo ==========================================
echo Cleanup Complete!
echo ==========================================
echo.
echo Deleted:
echo   - bin folders (C# build output)
echo   - obj folders (C# intermediate)
echo   - node_modules folders
echo   - coverage folders (Jest/Cypress)
echo   - .nyc_output folders (NYC coverage)
echo   - dist folders (Vite build output)
echo   - build folders
echo   - coverage-report.json files
echo   - TestResults folders (.NET tests)
echo.
ENDLOCAL
pause
