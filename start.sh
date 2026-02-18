#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "========================================"
echo "Starting Application"
echo "========================================"
echo

echo "[1/3] Starting PostgreSQL Docker container..."
docker compose up -d db || {
    echo "ERROR: Failed to start PostgreSQL container!"
    echo "Make sure Docker Desktop is running."
    exit 1
}

echo "Waiting for PostgreSQL to be ready..."
until docker compose exec db pg_isready -U postgres -d template > /dev/null 2>&1; do
    sleep 2
done
echo "PostgreSQL is ready on port 5444."
echo

echo "[2/3] Starting .NET Backend Server..."
dotnet run --project Template.Server/Template.Server.csproj &

echo "[3/3] Starting Vite Frontend Dev Server..."
(cd Template.Client && npm run dev) &

echo
echo "========================================"
echo "All services are starting:"
echo "  Database: localhost:5444 (PostgreSQL)"
echo "  Backend:  http://localhost:5249"
echo "  Frontend: http://localhost:3000"
echo "========================================"
echo
echo "Press Ctrl+C to stop all services."
wait
