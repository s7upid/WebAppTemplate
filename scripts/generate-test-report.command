#!/usr/bin/env bash
# ============================================
# Generate Test Report (Master Coverage Script)
# ============================================
# Runs: Backend coverage -> Jest -> Cypress -> Extract results -> Update README badges
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
COVERAGE_DIR="$SCRIPT_DIR/coverage"

echo
echo "=========================================="
echo "Running All Coverage Generation"
echo "=========================================="
echo

BACKEND_FAILED=0
JEST_FAILED=0
CYPRESS_FAILED=0

echo "[1/5] Running Backend (.NET) Coverage..."
echo "----------------------------------------"
if bash "$COVERAGE_DIR/1-run-be-coverage.command"; then
    echo "[SUCCESS] Backend coverage generated"
else
    echo "[WARNING] Backend coverage generation had issues"
    BACKEND_FAILED=1
fi
echo

echo "[2/5] Running Frontend Jest Coverage..."
echo "----------------------------------------"
if bash "$COVERAGE_DIR/2-run-fe-jest-coverage.command"; then
    echo "[SUCCESS] Jest coverage generated"
else
    echo "[WARNING] Jest coverage generation had issues"
    JEST_FAILED=1
fi
echo

echo "[3/5] Running Frontend Cypress Coverage..."
echo "----------------------------------------"
if bash "$COVERAGE_DIR/3-run-fe-cypress-coverage.command"; then
    echo "[SUCCESS] Cypress coverage generated"
else
    echo "[WARNING] Cypress coverage generation had issues"
    CYPRESS_FAILED=1
fi
echo

echo "[4/5] Extracting Coverage Results..."
echo "----------------------------------------"
cd "$COVERAGE_DIR"
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies for coverage scripts..."
    npm install
fi
cd "$ROOT_DIR"
if node "$COVERAGE_DIR/4-extract-results.js"; then
    echo "[SUCCESS] Coverage results extracted"
else
    echo "[WARNING] Coverage extraction had issues"
fi
echo

echo "[5/5] Updating README Badges..."
echo "----------------------------------------"
if node "$COVERAGE_DIR/5-update-readme-badges.js"; then
    echo "[SUCCESS] README badges updated"
else
    echo "[WARNING] README badge update had issues"
fi
echo

echo "=========================================="
echo "Coverage Generation Complete"
echo "=========================================="
echo
echo "Coverage Reports:"
if [ "$BACKEND_FAILED" -eq 0 ]; then
    echo "  Backend:  $ROOT_DIR/coverage/report/index.html"
else
    echo "  Backend:  [FAILED]"
fi
if [ "$JEST_FAILED" -eq 0 ]; then
    echo "  Jest:     $ROOT_DIR/Template.Client/coverage/jest/index.html"
else
    echo "  Jest:     [FAILED]"
fi
if [ "$CYPRESS_FAILED" -eq 0 ]; then
    echo "  Cypress:  $ROOT_DIR/Template.Client/coverage/cypress/out.json"
else
    echo "  Cypress:  [FAILED]"
fi
echo
echo "Results:   $ROOT_DIR/Template.Client/coverage-report.json"
echo "Badges:    Updated in README.md"
echo
