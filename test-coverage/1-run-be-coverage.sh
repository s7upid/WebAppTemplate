#!/usr/bin/env bash
# ============================================
# 1. Backend (.NET) Coverage
# ============================================
# Runs .NET unit/integration tests with coverage
# Output: coverage/report/Cobertura.xml
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo
echo "=========================================="
echo "Backend (.NET) Coverage Generation"
echo "=========================================="
echo

TEST_PROJECT="Template.Tests/Template.Tests.csproj"
BUILD_DIR="Template.Tests/bin/Debug/net10.0"
TEST_DLL="$BUILD_DIR/Template.Tests.dll"
COVERAGE_DIR="./coverage"
COVERAGE_FILE="$COVERAGE_DIR/coverage.info"
REPORT_DIR="$COVERAGE_DIR/report"

mkdir -p "$COVERAGE_DIR"

# Install coverlet.console if missing
if ! dotnet tool list -g | grep -qi "coverlet.console"; then
    dotnet tool install --global coverlet.console
fi

# Install ReportGenerator if missing
if ! dotnet tool list -g | grep -qi "dotnet-reportgenerator-globaltool"; then
    dotnet tool install --global dotnet-reportgenerator-globaltool
fi

# Build test project
dotnet build "$TEST_PROJECT"

# Run coverlet.console to collect coverage
coverlet "$TEST_DLL" \
    --target "dotnet" \
    --targetargs "test $TEST_PROJECT --no-build" \
    --output "$COVERAGE_FILE" \
    --format lcov \
    --include "[Template.Server*]*" \
    --include "[Template.Data*]*" \
    --exclude "[*]*Program.cs" \
    --exclude "[*]*Migrations*" \
    --exclude "[*]*OpenApi*" \
    --exclude-by-attribute "ExcludeFromCodeCoverage"

# Generate HTML + Cobertura report
reportgenerator "-reports:$COVERAGE_FILE" "-targetdir:$REPORT_DIR" "-reporttypes:Html,Cobertura"

echo "======================================"
echo "Coverage report generated in: $REPORT_DIR"
echo "======================================"

exit 0
