#!/usr/bin/env bash
# ============================================
# Cleanup Script for Test Coverage Artifacts
# ============================================
# Removes all generated test coverage files
# Run this before committing or to free disk space
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CLIENT_DIR="$ROOT_DIR/Template.Client"

echo
echo "=========================================="
echo "Test Coverage Cleanup"
echo "=========================================="
echo

echo "Cleaning up test coverage artifacts..."
echo

# Frontend Coverage
echo "[1/4] Cleaning Frontend Jest coverage..."
if [ -d "$CLIENT_DIR/coverage" ]; then
    rm -rf "$CLIENT_DIR/coverage"
    echo "  - Removed: Template.Client/coverage"
else
    echo "  - Skipped: coverage folder not found"
fi

echo "[2/4] Cleaning Frontend Cypress coverage artifacts..."
if [ -d "$CLIENT_DIR/.nyc_output" ]; then
    rm -rf "$CLIENT_DIR/.nyc_output"
    echo "  - Removed: Template.Client/.nyc_output"
fi
if [ -d "$CLIENT_DIR/.c8_output" ]; then
    rm -rf "$CLIENT_DIR/.c8_output"
    echo "  - Removed: Template.Client/.c8_output"
fi
if [ -f "$CLIENT_DIR/coverage-report.json" ]; then
    rm -f "$CLIENT_DIR/coverage-report.json"
    echo "  - Removed: Template.Client/coverage-report.json"
fi

# Backend Coverage
echo "[3/4] Cleaning Backend (.NET) coverage..."
if [ -d "$ROOT_DIR/coverage" ]; then
    rm -rf "$ROOT_DIR/coverage"
    echo "  - Removed: coverage"
else
    echo "  - Skipped: backend coverage folder not found"
fi

# Test Results
echo "[4/4] Cleaning Test Results..."
if [ -d "$ROOT_DIR/TestResults" ]; then
    rm -rf "$ROOT_DIR/TestResults"
    echo "  - Removed: TestResults"
fi
if [ -d "$ROOT_DIR/Template.Tests/TestResults" ]; then
    rm -rf "$ROOT_DIR/Template.Tests/TestResults"
    echo "  - Removed: Template.Tests/TestResults"
fi

echo
echo "=========================================="
echo "Cleanup Complete!"
echo "=========================================="
echo
echo "All test coverage artifacts have been removed."
echo "You can now run the coverage scripts again to generate fresh reports."
