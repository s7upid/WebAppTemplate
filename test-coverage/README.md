# Test Coverage Scripts

> **Preferred:** Use the scripts in the repo root **`scripts/`** folder: run **`./scripts/generate-test-report.command`** (or `npm run coverage`) for the full pipeline. See [scripts/README.md](../scripts/README.md#coverage-generate-test-report).

This folder contains the original coverage scripts (`.sh` / `.bat`); equivalent `.command` scripts and extract/badge JS files live in **`scripts/coverage/`**.

## 📋 Scripts Overview

| # | Script (Windows) | Script (macOS/Linux) | Description |
|---|------------------|----------------------|-------------|
| 0 | `0-run-all-coverage.bat` | `0-run-all-coverage.sh` | **Master script** - Runs all coverage scripts in sequence |
| 1 | `1-run-be-coverage.bat` | `1-run-be-coverage.sh` | Backend (.NET) unit/integration test coverage |
| 2 | `2-run-fe-jest-coverage.bat` | `2-run-fe-jest-coverage.sh` | Frontend Jest unit test coverage |
| 3 | `3-run-fe-cypress-coverage.bat` | `3-run-fe-cypress-coverage.sh` | Frontend Cypress E2E test coverage |
| 4 | `4-extract-results.js` | `4-extract-results.js` | Extracts and consolidates coverage data |
| 5 | `5-update-readme-badges.js` | `5-update-readme-badges.js` | Updates README.md with coverage badges |
| - | `cleanup.bat` | `cleanup.sh` | **Utility** - Removes all coverage artifacts |

## 🚀 Quick Start

### Run Everything
```bash
# From project root (prefer scripts folder)
./scripts/generate-test-report.command       # or: npm run coverage

# Legacy (this folder):
./test-coverage/0-run-all-coverage.sh        # macOS / Linux
test-coverage\0-run-all-coverage.bat         # Windows
```

### Run Individual Scripts
```bash
# Backend coverage only
./test-coverage/1-run-be-coverage.sh         # macOS / Linux
test-coverage\1-run-be-coverage.bat          # Windows

# Jest coverage only
./test-coverage/2-run-fe-jest-coverage.sh    # macOS / Linux
test-coverage\2-run-fe-jest-coverage.bat     # Windows

# Cypress coverage only
./test-coverage/3-run-fe-cypress-coverage.sh # macOS / Linux
test-coverage\3-run-fe-cypress-coverage.bat  # Windows

# Extract results (after running tests)
cd test-coverage
node 4-extract-results.js

# Update badges (after extracting results)
node 5-update-readme-badges.js
```

## 📁 Output Locations

| Coverage Type | Output Location |
|---------------|-----------------|
| Backend (.NET) | `coverage/report/Cobertura.xml` |
| Jest (Unit) | `Template.Client/coverage/jest/` |
| Cypress (E2E) | `Template.Client/coverage/cypress/` |
| Consolidated Report | `Template.Client/coverage-report.json` |
| README Badges | `Template.Client/README.md` |

## 📖 Script Details

### 0. Run All Coverage (`0-run-all-coverage.bat` / `.sh`)
The master script that orchestrates the entire coverage workflow:
1. Runs backend .NET tests with coverage
2. Runs frontend Jest tests with coverage
3. Runs frontend Cypress E2E tests with coverage
4. Extracts and consolidates all results
5. Updates README badges

**Note:** If you run the master script, you don't need to run any other scripts individually.

### 1. Backend Coverage (`1-run-be-coverage.bat` / `.sh`)
- Runs .NET unit and integration tests
- Uses `coverlet.console` for coverage collection
- Uses `ReportGenerator` for HTML reports
- Generates `coverage/report/Cobertura.xml`

**Prerequisites:**
- .NET SDK installed
- Will auto-install `coverlet.console` and `dotnet-reportgenerator-globaltool` if missing

### 2. Jest Coverage (`2-run-fe-jest-coverage.bat` / `.sh`)
- Runs all Jest unit tests with coverage
- Generates `coverage/jest/coverage-summary.json`
- Generates HTML report in `coverage/jest/`

**Prerequisites:**
- Node.js installed
- Will auto-install npm dependencies if `node_modules` missing

### 3. Cypress Coverage (`3-run-fe-cypress-coverage.bat` / `.sh`)
- Builds app with Istanbul instrumentation (`vite-plugin-istanbul`)
- Starts dev server with coverage enabled (`--mode coverage`)
- Runs Cypress E2E tests in **parallel** (4 processes via `cypress-split` + `concurrently`)
- Each process writes its own `coverage-split-N.json` to `.c8_output/`
- Merges all split files into `coverage/cypress/out.json` and `.nyc_output/out.json`
- Uses native V8 coverage approach (c8-compatible, works with Node.js 24+)

**Prerequisites:**
- Node.js 24+ installed
- Chrome browser installed

**How parallel coverage works:**
1. `npm run cypress:run:parallel:coverage` — runs 4 Cypress processes, each collecting its own coverage
2. `npm run cypress:merge-coverage` — deep-merges Istanbul coverage objects (sums statement/branch/function counters)
3. Final merged file written to `coverage/cypress/out.json`

### 4. Extract Results (`4-extract-results.js`)
- Reads coverage from all three sources
- Consolidates into `coverage-report.json`
- Calculates percentages and badge colors

**Run from the `test-coverage` directory:**
```bash
cd test-coverage
node 4-extract-results.js
```

### 5. Update README Badges (`5-update-readme-badges.js`)
- Reads `coverage-report.json`
- Updates badges in `README.md`
- Preserves existing README content

**Run from the `test-coverage` directory:**
```bash
cd test-coverage
node 5-update-readme-badges.js
```

## 🎨 Badge Colors

| Coverage | Color |
|----------|-------|
| ≥ 90% | 🟢 brightgreen |
| ≥ 80% | 🟢 green |
| ≥ 70% | 🟡 yellowgreen |
| ≥ 60% | 🟡 yellow |
| ≥ 50% | 🟠 orange |
| < 50% | 🔴 red |

## 🧹 Cleanup

### Using cleanup script
The cleanup script removes all generated coverage artifacts:

```bash
# From project root
./test-coverage/cleanup.sh                   # macOS / Linux
test-coverage\cleanup.bat                    # Windows
```

**What it removes:**
- `Template.Client/coverage/` - Jest and Cypress coverage reports
- `Template.Client/.nyc_output/` - nyc/Istanbul intermediate files
- `Template.Client/.c8_output/` - c8 intermediate files
- `Template.Client/coverage-report.json` - Consolidated report
- `coverage/` - Backend coverage reports
- `TestResults/` - .NET test results

### Using npm scripts (Frontend only)
```bash
cd Template.Client

# Clean coverage artifacts only
npm run clean

# Clean everything including node_modules
npm run clean:all
```

### Ignored Files
All coverage output files are already in `.gitignore`. The following are automatically ignored:
- `coverage/`
- `.nyc_output/`
- `.c8_output/`
- `*.lcov`
- `coverage-report.json`
- `TestResults/`
- `*.trx`
- `Cobertura.xml`

## 🔧 Troubleshooting

### npm dependencies not found
```bash
cd Template.Client
npm install
```

### .NET tools not found
```bash
dotnet tool install --global coverlet.console
dotnet tool install --global dotnet-reportgenerator-globaltool
```

### Cypress tests failing
- Ensure Chrome browser is installed
- Check if dev server is already running on port 3000
- Try running with specific spec: `set CYPRESS_SPEC=cypress/e2e/auth/login.cy.ts`

### Coverage data not found
- Ensure tests completed successfully
- Check output directories exist
- Verify coverage instrumentation is enabled in build

