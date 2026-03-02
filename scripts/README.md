# Scripts

Main project scripts live here. Run from the **repository root** (parent of `scripts/`).

**macOS / Linux / Git Bash (Windows):**

```bash
./scripts/<script-name>.command
```

**Windows (CMD):** Double-click or run from repo root:

```bat
scripts\start.bat
scripts\add-migration.bat
scripts\regenerate-models.bat
scripts\clean.bat
scripts\generate-test-report.bat
```

You can also use the root `package.json` npm scripts that delegate to the `.command` scripts (see below).

---

## Scripts

| Script | Description |
|--------|-------------|
| **start.command** / **start.bat** | Starts the full stack: PostgreSQL (Docker), .NET server, Vite client. Run from repo root. |
| **add-migration.command** / **add-migration.bat** | Prompts for a migration name and runs `dotnet ef migrations add` (Data + Server projects). |
| **regenerate-models.command** / **regenerate-models.bat** | Rebuilds server, restores .NET tools, runs NSwag, then `node generate-constants.js` (API client + constants). |
| **clean.command** / **clean.bat** | Removes build artifacts: `bin`, `obj`, `node_modules`, `coverage`, `.nyc_output`, `.c8_output`, `dist`, `build`, `TestResults`, `coverage-report.json`. |
| **generate-test-report.command** / **generate-test-report.bat** | Full coverage pipeline: **lint** (fails first if errors) → backend (.NET) → Jest → Cypress → extract results → update README badges. |

---

## Lint and typecheck

From the repo root:

- `npm run lint` – runs ESLint in Template.Client (must pass before generate-test-report continues).
- `npm run lint:fix` – same with auto-fix.
- `npm run typecheck` – runs `tsc --noEmit` in Template.Client.

Frontend test scripts (`npm test`, `npm run test:coverage`, `npm run test:ci`) are cross-platform and run Jest directly; no platform-specific wrappers.

## Coverage (generate-test-report)

The **generate-test-report** script runs **lint** first; if lint fails, the script exits. It then uses the helpers in `scripts/coverage/`:

- `1-run-be-coverage.command` / `.bat` – .NET tests with Coverlet + ReportGenerator
- `2-run-fe-jest-coverage.command` / `.bat` – Jest unit test coverage
- `3-run-fe-cypress-coverage.command` / `.bat` – Cypress E2E coverage
- `4-extract-results.js` – Writes `Template.Client/coverage-report.json`
- `5-update-readme-badges.js` – Updates badges in root `README.md`
- `cleanup.command` / `cleanup.bat` – Removes coverage output folders and report file

To only clean coverage artifacts, run:

```bash
./scripts/coverage/cleanup.command   # macOS/Linux/Git Bash
scripts\coverage\cleanup.bat         # Windows
```

---

## npm scripts (root package.json)

These run the same logic via bash:

- `npm run start:full` → `scripts/start.command`
- `npm run db:migration:add` → uses `dotnet ef`; for interactive name prompt use `./scripts/add-migration.command`
- `npm run regenerate-models` → `scripts/regenerate-models.command`
- `npm run clean:scripts` → `scripts/clean.command`
- `npm run coverage` → `scripts/generate-test-report.command`

## GitHub Actions (CI)

On push/PR to `main` or `develop`, `.github/workflows/ci.yml` runs:

- **Lint** – ESLint + TypeScript typecheck (Template.Client)
- **Unit tests (Client)** – Jest with coverage
- **Unit tests (Server)** – `dotnet test` (Template.Tests)
- **Build** – Vite client build + .NET server build (after lint and tests pass)

---

## Requirements

- **start**: Docker (PostgreSQL), .NET SDK, Node/npm.
- **add-migration** / **regenerate-models**: .NET SDK, Node (for `generate-constants.js`).
- **generate-test-report**: .NET SDK, Node/npm in `Template.Client`, optional Cypress/Chrome for E2E.
