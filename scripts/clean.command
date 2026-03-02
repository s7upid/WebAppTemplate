#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "=========================================="
echo "Cleaning project - Deleting build artifacts"
echo "=========================================="
echo

delete_dirs() {
    local name="$1"
    local exclude_pattern="${2:-}"
    local count=0

    while IFS= read -r -d '' dir; do
        if [ -n "$exclude_pattern" ] && echo "$dir" | grep -qi "$exclude_pattern"; then
            continue
        fi
        echo "  Deleting: $dir"
        rm -rf "$dir"
        ((count++)) || true
    done < <(find . -type d -name "$name" -print0 2>/dev/null)

    if [ "$count" -eq 0 ]; then
        echo "  (none found)"
    fi
}

delete_files() {
    local name="$1"
    local count=0

    while IFS= read -r -d '' file; do
        echo "  Deleting: $file"
        rm -f "$file"
        ((count++)) || true
    done < <(find . -type f -name "$name" -print0 2>/dev/null)

    if [ "$count" -eq 0 ]; then
        echo "  (none found)"
    fi
}

echo "[1/10] Deleting bin folders..."
delete_dirs "bin"

echo "[2/10] Deleting obj folders..."
delete_dirs "obj"

echo "[3/10] Deleting node_modules folders..."
delete_dirs "node_modules"

echo "[4/10] Deleting coverage folders..."
delete_dirs "coverage"

echo "[5/10] Deleting .nyc_output folders..."
delete_dirs ".nyc_output"

echo "[6/10] Deleting .c8_output folders..."
delete_dirs ".c8_output"

echo "[7/10] Deleting dist folders..."
delete_dirs "dist"

echo "[8/10] Deleting build folders (excluding node_modules)..."
delete_dirs "build" "node_modules"

echo "[9/10] Deleting coverage-report.json files..."
delete_files "coverage-report.json"

echo "[10/10] Deleting TestResults folders..."
delete_dirs "TestResults"

echo
echo "=========================================="
echo "Cleanup Complete!"
echo "=========================================="
echo
echo "Deleted:"
echo "  - bin folders (C# build output)"
echo "  - obj folders (C# intermediate)"
echo "  - node_modules folders"
echo "  - coverage folders (Jest/Cypress)"
echo "  - .nyc_output folders (NYC coverage)"
echo "  - .c8_output folders (c8/Cypress coverage)"
echo "  - dist folders (legacy Vite build output)"
echo "  - build folders"
echo "  - coverage-report.json files"
echo "  - TestResults folders (.NET tests)"
