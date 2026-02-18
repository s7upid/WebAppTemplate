#!/usr/bin/env bash
# ============================================
# 2. Frontend Jest (Unit Test) Coverage
# ============================================
# Runs Jest unit tests with coverage
# Output: Template.Client/coverage/jest/
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CLIENT_DIR="$ROOT_DIR/Template.Client"

cd "$CLIENT_DIR"

echo
echo "=========================================="
echo "Frontend Jest (Unit Test) Coverage"
echo "=========================================="
echo

echo "Working directory: $(pwd)"

# Check if node_modules exists, install if not
if [ ! -d "node_modules" ]; then
    echo "node_modules not found, installing npm dependencies..."
    npm install || { echo "[ERROR] npm install failed!"; exit 1; }
else
    echo "node_modules found"
fi

# Run Jest tests with coverage
echo
echo "Running Jest tests with coverage..."
./node_modules/.bin/jest --config jest.config.ts --coverage || {
    echo "[WARNING] Jest tests had some failures"
}

echo
echo "=========================================="
echo "Jest Coverage Complete"
echo "=========================================="
echo "Report: $CLIENT_DIR/coverage/jest/index.html"
echo "=========================================="

exit 0
