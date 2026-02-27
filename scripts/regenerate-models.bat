@echo off
setlocal
cd /d "%~dp0\.."

echo ========================================
echo Regenerating TypeScript Models and Constants from C#
echo ========================================
echo.

echo Step 1: Cleaning and building Server project...
dotnet clean Template.Server/Template.Server.csproj -v:minimal
dotnet build Template.Server/Template.Server.csproj -v:minimal

echo.
echo Step 2: Restoring .NET tools...
dotnet tool restore

echo.
echo Step 3: Generating TypeScript models via NSwag...
dotnet tool run nswag run nswag.json

echo.
echo Step 4: Generating Permission Constants from C#...
node generate-constants.js

echo.
echo ========================================
echo Generation completed successfully!
echo Generated files:
echo   - Template.Client/src/models/generated.ts
echo   - Template.Client/src/config/generated/permissionKeys.generated.ts
echo ========================================
pause
