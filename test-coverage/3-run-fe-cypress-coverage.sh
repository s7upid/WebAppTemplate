#!/usr/bin/env bash
# ============================================
# 3. Frontend Cypress (E2E) Coverage
# ============================================
# Runs Cypress E2E tests with coverage
# Output: Template.Client/coverage/cypress/
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CLIENT_DIR="$ROOT_DIR/Template.Client"

cd "$CLIENT_DIR"

echo
echo "=========================================="
echo "Frontend Cypress (E2E) Coverage"
echo "=========================================="
echo

echo "Working directory: $(pwd)"

# Check if node_modules exists, install if not
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Build application with coverage instrumentation
echo "[1/4] Building application with coverage instrumentation..."
export CYPRESS_COVERAGE=true
npm run build:coverage || { echo "Build with coverage failed!"; exit 1; }

# Start development server with coverage instrumentation
echo "[2/4] Starting development server with coverage instrumentation..."
export CYPRESS_COVERAGE=true
export ENABLE_COVERAGE=true
export NODE_ENV=development

echo "Starting Vite dev server on port 3000..."
./node_modules/.bin/vite --mode coverage --port 3000 &
VITE_PID=$!

# Wait for server to be ready
echo "Waiting for development server to start..."
sleep 5

SERVER_READY=false
for i in $(seq 1 12); do
    if curl -sf http://localhost:3000 > /dev/null 2>&1; then
        SERVER_READY=true
        break
    fi
    echo "  Waiting... (attempt $i/12)"
    sleep 5
done

if [ "$SERVER_READY" = false ]; then
    echo "[ERROR] Development server failed to start"
    kill "$VITE_PID" 2>/dev/null
    exit 1
fi

SERVER_PORT=3000
echo "[SUCCESS] Development server is ready on port $SERVER_PORT"

# Generate Cypress coverage against running app
echo "[3/4] Running Cypress tests with coverage (output: coverage/cypress)..."
NYC_OUTPUT_DIR="$CLIENT_DIR/coverage/cypress"
mkdir -p "$NYC_OUTPUT_DIR"

# Clean up stale coverage files
rm -f "$NYC_OUTPUT_DIR/out.json"
rm -f "$CLIENT_DIR/.nyc_output/out.json"
rm -rf "$CLIENT_DIR/.c8_output"

echo "NYC output directory: $NYC_OUTPUT_DIR"

# Run Cypress tests in parallel (4 processes) with coverage enabled
echo "Running Cypress tests in parallel with coverage..."
npm run cypress:run:parallel:coverage

CYPRESS_EXIT_CODE=$?
echo "Cypress tests completed with exit code: $CYPRESS_EXIT_CODE"

# Merge per-split coverage files into final output
echo "Merging coverage from parallel processes..."
npm run cypress:merge-coverage

# Look for coverage data in multiple possible locations
echo "Looking for coverage data..."

if [ -f "$CLIENT_DIR/coverage/cypress/out.json" ]; then
    echo "[SUCCESS] Found coverage in coverage/cypress folder"
    echo "Coverage location: $CLIENT_DIR/coverage/cypress/out.json"
elif [ -f "$CLIENT_DIR/.nyc_output/out.json" ]; then
    echo "Found coverage in .nyc_output folder, copying to coverage/cypress..."
    cp "$CLIENT_DIR/.nyc_output/out.json" "$NYC_OUTPUT_DIR/out.json"
    echo "[SUCCESS] Coverage copied to $NYC_OUTPUT_DIR/out.json"
else
    echo "[WARNING] No coverage data found"
    echo
    echo "This usually means one of:"
    echo "  1. The app was not built with coverage instrumentation (npm run build:coverage)"
    echo "  2. ENABLE_COVERAGE=true was not passed to Cypress"
    echo "  3. The vite-plugin-istanbul is not instrumenting the code"
fi

# Stop the development server
echo "[4/4] Stopping development server..."
kill "$VITE_PID" 2>/dev/null
wait "$VITE_PID" 2>/dev/null
echo "Development server stopped"

echo
if [ "$CYPRESS_EXIT_CODE" -eq 0 ]; then
    echo "[SUCCESS] Cypress coverage generation completed!"
else
    echo "[WARNING] Cypress tests had issues"
fi
echo "[INFO] Cypress coverage: coverage/cypress/out.json"

exit "$CYPRESS_EXIT_CODE"
