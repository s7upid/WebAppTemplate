@echo off
setlocal
cd /d "%~dp0\.."

set /p MigrationName="Enter migration name: "

dotnet ef migrations add "%MigrationName%" ^
    --project ./Template.Data ^
    --startup-project ./Template.Server ^
    --context Template.Data.Data.ApplicationDbContext

echo.
echo Migration "%MigrationName%" created.
pause
