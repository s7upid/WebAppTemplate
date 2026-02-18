@echo off
echo ========================================
echo Regenerating TypeScript Models and Constants from C#
echo ========================================
echo.

echo Step 1: Cleaning and building Server project...
dotnet clean Template.Server/Template.Server.csproj -v:minimal
dotnet build Template.Server/Template.Server.csproj -v:minimal
if %ERRORLEVEL% neq 0 (
    echo ERROR: Server build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Restoring .NET tools...
dotnet tool restore
if %ERRORLEVEL% neq 0 (
    echo ERROR: Tool restore failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Generating TypeScript models via NSwag...
dotnet tool run nswag run nswag.json
if %ERRORLEVEL% neq 0 (
    echo ERROR: NSwag generation failed!
    pause
    exit /b 1
)

echo.
echo Step 4: Generating Permission Constants from C#...
node generate-constants.js
if %ERRORLEVEL% neq 0 (
    echo ERROR: Constants generation failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Generation completed successfully!
echo Generated files:
echo   - Template.Client/src/models/generated.ts
echo   - Template.Client/src/config/generated/permissionKeys.generated.ts
echo ========================================
pause
