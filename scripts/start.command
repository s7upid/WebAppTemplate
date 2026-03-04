#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "========================================"
echo "Starting Application"
echo "========================================"
echo

echo "[1/4] Starting PostgreSQL Docker container..."
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

echo "[2/4] Applying database migrations..."
export ASPNETCORE_ENVIRONMENT=Development
dotnet ef database update --project Template.Data --startup-project Template.Server || echo "WARNING: Migrations failed. Backend may still apply them on first run."
echo

echo "[3/4] Starting .NET Backend Server..."
dotnet run --project Template.Server/Template.Server.csproj &

echo "[4/4] Starting Vite Frontend Dev Server..."
if [ ! -f "Template.Client/solstice-ui-1.0.0.tgz" ]; then
    echo "Building solstice-ui from GitHub..."
    git clone --depth 1 https://github.com/s7upid/solstice-ui.git _solstice-ui-tmp
    (cd _solstice-ui-tmp && npm install && npm run build && npm pack)
    cp _solstice-ui-tmp/solstice-ui-1.0.0.tgz Template.Client/solstice-ui-1.0.0.tgz
    rm -rf _solstice-ui-tmp
fi
if [ ! -d "Template.Client/node_modules" ]; then
    echo "Installing frontend dependencies..."
    (cd Template.Client && npm install)
fi
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
