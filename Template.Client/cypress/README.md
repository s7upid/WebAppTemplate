# Cypress E2E Tests

This directory contains all Cypress end-to-end tests for the application.

## 📁 Directory Structure

```
cypress/
├── e2e/                    # Test files organized by feature
│   ├── auth/              # Authentication tests
│   ├── user-management/   # User management tests
│   │   ├── user-flows.cy.ts  # User flows incl. create/update/delete (UX flow)
│   │   ├── user-flows.cy.ts
│   │   ├── user-list.cy.ts
│   │   └── user-edge-cases.cy.ts
│   ├── role-management/   # Role management tests
│   │   ├── role-flows.cy.ts  # Role flows incl. create/update/delete (UX flow)
│   │   ├── role-flows.cy.ts
│   │   ├── role-list.cy.ts
│   │   └── role-edge-cases.cy.ts
│   ├── permission-management/ # Permission tests (read-only list)
│   ├── navigation/        # Navigation tests
│   └── regression/       # Regression tests
└── support/               # Test utilities and helpers
    ├── base-test.ts      # Base test setup functions
    ├── test-helpers.ts   # Helper functions
    ├── commands.ts       # Custom Cypress commands
    └── README.md         # Detailed helper documentation
```

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests (sequential)
npm run cypress:run

# Run all tests (parallel — 4 processes, ~3-4x faster)
npm run cypress:run:parallel

# Run tests in interactive mode
npm run cypress:open

# Run only CRUD e2e (user + role create/update/delete)
# Requires backend + frontend running (e.g. run scripts/start.bat from repo root)
npm run cypress:run:crud

# Run CRUD e2e with coverage and update coverage %
npm run cypress:run:crud:coverage   # dev server must be on port 3000 in coverage mode
npm run crud:e2e:coverage           # one-shot: build, server, CRUD tests, report

# Run specific test file
npx cypress run --spec "cypress/e2e/auth/login.cy.ts"
```

### Writing New Tests

1. **Choose the right pattern:**

   - **Auth Tests**: Use Pattern A (minimal setup, login in tests)
   - **Page Tests**: Use Pattern B (full setup with login in beforeEach)
   - **Flow Tests**: Use Pattern C (setup in beforeEach, login in nested beforeEach)

2. **Import base utilities:**

   ```typescript
   import { baseTestSetup } from "../../support/base-test";
   import {
     loginAndWait,
     waitForAuthenticatedPage,
   } from "../../support/test-helpers";
   ```

3. **Follow the standard pattern:**

   ```typescript
   describe("My Feature", () => {
     beforeEach(() => {
       baseTestSetup();
       loginAndWait();
       cy.visit("/page");
       waitForAuthenticatedPage();
     });

     it("should test something", () => {
       // Your test code
     });
   });
   ```

## 📚 Documentation

- **[Cypress Testing Guide](../../Documentation/Cypress-Testing-Complete.md)** - Complete guide
- **[Helper Functions](./support/README.md)** - Local helper documentation

## ✅ Standards

All tests follow these standards:

1. **Base Setup**: Always use `baseTestSetup()` in `beforeEach()`
2. **Consistent Syntax**: Use arrow functions `beforeEach(() => {`
3. **Helper Functions**: Use helper functions instead of repeating patterns
4. **Wait Patterns**: Use `waitForAuthenticatedPage()` after login + visit
5. **Exception Handling**: Use `setupUncaughtExceptionHandler()` in `beforeEach()`

## 🎯 Test Coverage

- **Authentication**: Login, logout, token management, session management
- **User Management**: User flows (create/update/delete, list, detail) in `user-flows.cy.ts` — login → sidebar to User Management → create → open detail → update/delete; plus list, edge cases
- **Role Management**: Role flows in `role-flows.cy.ts` — same UX flow via sidebar; create/update/delete, list, edge cases
- **Permission Management**: Read-only list and demo (no create/update/delete)
- **Navigation**: Navigation flows, routing
- **Regression**: Error handling, validation, data integrity, theme, pagination

CRUD e2e tests are written to match user experience: navigate via the sidebar (e.g. Access Management → User Management) instead of direct URL visits, then create, open a row to detail, edit or delete.

## 🔧 Helper Functions

### Authentication

- `loginAndWait()` - Login and wait for completion
- `waitForLogin()` - Wait for login to complete
- `waitForLoginRedirect()` - Wait for redirect to login
- `waitForAuthenticatedPage()` - Wait for authenticated page

### Token Management

- `setExpiredToken()` - Set expired token
- `setInvalidToken()` - Set invalid token
- `setMalformedToken()` - Set malformed token
- `setMissingToken()` - Set missing token

### URL Navigation

- `waitForUrl(path)` - Wait for URL to include path
- `waitForUrlNot(path)` - Wait for URL to not include path

### Theme Management

- `setTheme(theme)` - Set theme ('light' | 'dark')
- `getTheme()` - Get current theme

### Session Management

- `clearSession()` - Clear localStorage and cookies

See [support/README.md](./support/README.md) for complete documentation.

## 📊 Statistics

- **Total Test Files**: 21
- **Files Using Base Utilities**: 21/21 (100%)
- **Helper Functions**: 30+
- **Code Reduction**: ~200+ lines eliminated
- **Pattern Instances Extracted**: 55+

## 🎉 Benefits

1. **Consistency** - All tests follow the same patterns
2. **Maintainability** - Changes to common logic in one place
3. **Readability** - Tests are concise and expressive
4. **Reliability** - Common patterns tested once
5. **Performance** - Reduced redundant operations

---

**Last Updated**: Current
**Status**: ✅ All tests standardized and verified
