# Cypress E2E Testing - Complete Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Test Structure](#test-structure)
4. [Standard Flow Patterns](#standard-flow-patterns)
5. [Helper Functions](#helper-functions)
6. [Best Practices](#best-practices)
7. [Test Organization](#test-organization)
8. [Running Tests](#running-tests)
9. [Troubleshooting](#troubleshooting)
10. [Reference Documentation](#reference-documentation)

## Overview

The Cypress test suite consists of **21 test files** covering authentication, user management, role management, permissions, navigation, and regression scenarios. All tests are standardized to follow consistent flow patterns and use centralized base utilities.

### Test Coverage

- **Authentication**: Login, logout, token management, session management, rate limiting
- **User Management**: User CRUD operations, user flows, permissions
- **Role Management**: Role CRUD operations, role flows, assignments
- **Permission Management**: Permission management and assignments
- **Navigation**: Navigation flows, routing, theme persistence
- **Regression**: Error handling, validation, data integrity, theme, pagination, sorting

### Statistics

- **Total Test Files**: 21
- **Files Using Base Utilities**: 21/21 (100%)
- **Helper Functions**: 30+
- **Code Reduction**: ~200+ lines eliminated
- **Pattern Instances Extracted**: 55+

## Quick Start

### Running Tests

```bash
# Run all tests
npm run cypress:run

# Run tests in interactive mode
npm run cypress:open

# Run specific test file
npx cypress run --spec "cypress/e2e/auth/login.cy.ts"

# Run with coverage (use test-coverage scripts)
./test-coverage/3-run-fe-cypress-coverage.sh  # macOS / Linux
test-coverage\3-run-fe-cypress-coverage.bat   # Windows
```

### Writing Your First Test

```typescript
import { baseTestSetup } from '../../support/base-test';
import { loginAndWait, waitForAuthenticatedPage } from '../../support/test-helpers';

describe('My Feature', () => {
  beforeEach(() => {
    baseTestSetup();
    loginAndWait();
    cy.visit('/page');
    waitForAuthenticatedPage();
  });

  it('should test something', () => {
    // Your test code
  });
});
```

## Test Structure

### Directory Organization

```
cypress/
├── e2e/                    # Test files organized by feature
│   ├── auth/              # Authentication tests (7 files)
│   ├── user-management/   # User management tests (2 files)
│   ├── role-management/   # Role management tests (2 files)
│   ├── permission-management/ # Permission tests (2 files)
│   ├── navigation/        # Navigation tests (1 file)
│   └── regression/        # Regression tests (5 files)
├── support/               # Test utilities and helpers
│   ├── base-test.ts      # Base test setup functions
│   ├── test-helpers.ts   # Helper functions (30+)
│   ├── commands.ts       # Custom Cypress commands
│   └── README.md         # Helper documentation
└── README.md             # Main Cypress documentation
```

## Standard Flow Patterns

All tests follow one of these standardized patterns:

### Pattern A: Auth Tests (Testing Login/Logout/Token)

**Use for:** Testing authentication flows, token management, session handling

```typescript
import { baseTestSetup } from '../../support/base-test';
import { loginAndWait, waitForLoginRedirect } from '../../support/test-helpers';

describe('Auth Feature', () => {
  beforeEach(() => {
    baseTestSetup();
    // Login happens in individual tests as needed
  });

  it('should login successfully', () => {
    loginAndWait();
    verifyTokenExists();
  });

  it('should handle expired token', () => {
    setExpiredToken();
    cy.visit('/users');
    waitForLoginRedirect();
  });
});
```

**Files using this pattern:**
- `auth/login.cy.ts`
- `auth/logout.cy.ts`
- `auth/token-refresh.cy.ts`
- `auth/token-expiration.cy.ts`
- `auth/session-management.cy.ts`
- `auth/rate-limiting.cy.ts`
- `auth/token-revocation.cy.ts`

### Pattern B: Page Tests (Testing Page Functionality)

**Use for:** Testing specific page functionality, UI components, page interactions

```typescript
import { baseTestSetup, setupIgnoreAllExceptions } from '../../support/base-test';
import { loginAndWait, waitForAuthenticatedPage } from '../../support/test-helpers';

describe('Page Feature', () => {
  beforeEach(() => {
    baseTestSetup();
    setupIgnoreAllExceptions(); // Only if needed
    loginAndWait();
    cy.visit('/page');
    waitForAuthenticatedPage();
  });

  it('should display page content', () => {
    // Test page functionality
  });
});
```

**Files using this pattern:**
- `dashboard.cy.ts`
- `user-management/user-list.cy.ts`
- `permission-management/permission-list.cy.ts`
- `permission-management/permission-demo.cy.ts`
- `regression/pagination-filter-sorting.cy.ts`

### Pattern C: Flow Tests (Testing User Flows)

**Use for:** Testing complete user workflows, multi-step processes

```typescript
import { baseTestSetup } from '../../support/base-test';
import { loginAndWait, waitForAuthenticatedPage } from '../../support/test-helpers';

describe('User Flow', () => {
  beforeEach(() => {
    baseTestSetup();
  });

  describe('Specific Flow', () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit('/page');
      waitForAuthenticatedPage();
    });

    it('should complete flow', () => {
      // Test flow steps
    });
  });
});
```

**Files using this pattern:**
- `role-management/role-flows.cy.ts`
- `user-management/user-flows.cy.ts`
- `role-based-access.cy.ts`

## Helper Functions

### Authentication Helpers

```typescript
// Login and wait for completion
loginAndWait(); // Uses default admin credentials
loginAndWait('user@example.com', 'password123'); // Custom credentials

// Wait for authentication states
waitForLogin(); // Wait for login to complete
waitForLoginRedirect(); // Wait for redirect to login page
waitForAuthenticatedPage(); // Wait for authenticated page to load

// Verify authentication
verifyTokenExists();
verifyTokenCleared();
verifyAuthDataCleared();
verifyUserDataExists();
```

### Token Management Helpers

```typescript
// Set different token states for testing
setExpiredToken(); // Set expired token
setExpiringToken(); // Set token expiring soon
setInvalidToken(); // Set invalid token
setInvalidToken('custom-token'); // Set custom invalid token
setMalformedToken(); // Set malformed JWT
setMissingToken(); // Set missing token (only user data)
```

### URL Navigation Helpers

```typescript
// Wait for specific URLs
waitForUrl('/users'); // Wait for URL to include path
waitForUrlNot('/login'); // Wait for URL to not include path
```

### Theme Management Helpers

```typescript
// Set theme
setTheme('dark');
setTheme('light');

// Get theme
getTheme().then((theme) => {
  // Use theme value
});
```

### Session Management Helpers

```typescript
// Clear session (simulates expiration)
clearSession();
```

### Exception Handling Helpers

```typescript
// Setup exception handler
setupUncaughtExceptionHandler(['fetch', 'NetworkError']); // Custom patterns
setupIgnoreAllExceptions(); // Ignore all (use with caution)
```

### Element Helpers

```typescript
// Conditional element check
ifElementExists('[data-testid="button"]', () => {
  cy.get('[data-testid="button"]').click();
});

// Check if element exists
elementExists('[data-testid="button"]').then((exists) => {
  if (exists) {
    // Do something
  }
});
```

### API Intercept Helpers

```typescript
// Setup error intercepts
interceptUnauthorized('**/api/users**', 'unauthorized');
interceptRateLimit('**/api/users**', 'Rate limit exceeded', 'rateLimited');
interceptRevokedToken('**/api/users**', 'revokedToken');
interceptTokenRefresh(200, 'new-token', 'refreshToken');

// Wait for API requests
waitForApiRequest('unauthorized', 10000);
```

**For complete helper documentation, see:** [cypress/support/README.md](../Template.Client/cypress/support/README.md)

## Best Practices

### ✅ DO

- Always use `baseTestSetup()` in `beforeEach()`
- Use `loginAndWait()` instead of `cy.login()` + manual wait
- Use `waitForAuthenticatedPage()` after login + visit
- Use helper functions instead of repeating patterns
- Use arrow functions `beforeEach(() => {` for consistency
- Use `setupUncaughtExceptionHandler()` in `beforeEach()` instead of `before()`
- Use conditional helpers like `ifElementExists()` for optional elements

### ❌ DON'T

- Don't use `cy.loginAsAdmin()` for real authentication (use `loginAndWait()`)
- Don't use `cy.wait(500)` - use proper element/request waits
- Don't use `before(function () {` - use `beforeEach(() => {`
- Don't repeat `cy.visit()` if already in `beforeEach()`
- Don't use `cy.get('body').should('be.visible')` after `waitForAuthenticatedPage()`
- Don't manually set tokens - use helper functions
- Don't use `cy.clearCookies()` or `cy.clearLocalStorage()` directly - use `baseTestSetup()`

## Test Organization

### Test Files by Category

#### Authentication Tests (7 files)
- `auth/login.cy.ts` - Login functionality
- `auth/logout.cy.ts` - Logout functionality
- `auth/token-refresh.cy.ts` - Token refresh mechanism
- `auth/token-expiration.cy.ts` - Token expiration handling
- `auth/session-management.cy.ts` - Session persistence and management
- `auth/rate-limiting.cy.ts` - Rate limiting on authentication
- `auth/token-revocation.cy.ts` - Token revocation on logout/user deletion

#### User Management Tests (2 files)
- `user-management/user-list.cy.ts` - User list page functionality
- `user-management/user-flows.cy.ts` - Complete user management workflows

#### Role Management Tests (2 files)
- `role-management/role-list.cy.ts` - Role list page functionality
- `role-management/role-flows.cy.ts` - Complete role management workflows

#### Permission Management Tests (2 files)
- `permission-management/permission-list.cy.ts` - Permission list page
- `permission-management/permission-demo.cy.ts` - Permission demo component

#### Navigation Tests (1 file)
- `navigation/navigation-basic.cy.ts` - Basic navigation flows

#### Regression Tests (5 files)
- `regression/api-error-handling.cy.ts` - API error handling scenarios
- `regression/data-integrity.cy.ts` - Data integrity checks
- `regression/pagination-filter-sorting.cy.ts` - Table functionality
- `regression/theme-responsive.cy.ts` - Theme and responsive design
- `regression/validation-errors.cy.ts` - Form validation errors

#### Other Tests (2 files)
- `dashboard.cy.ts` - Dashboard page functionality
- `role-based-access.cy.ts` - Role-based access control

## Running Tests

### Basic Commands

```bash
# Interactive mode (recommended for development)
npm run cypress:open

# Headless mode (for CI/CD)
npm run cypress:run

# Run specific test file
npx cypress run --spec "cypress/e2e/auth/login.cy.ts"

# Run tests in specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge

# Run with coverage (from project root)
./test-coverage/3-run-fe-cypress-coverage.sh  # macOS / Linux
test-coverage\3-run-fe-cypress-coverage.bat   # Windows
```

### Advanced Options

```bash
# Run headed (visible browser)
npx cypress run --headed

# Enable videos and screenshots
npx cypress run --config video=true,screenshotOnRunFailure=true

# Run specific test by title
npx cypress run --spec "cypress/e2e/**/*.cy.ts" --grep "login"
```

## Troubleshooting

### Test fails with "uncaught exception"

```typescript
// Add exception handler
beforeEach(() => {
  baseTestSetup();
  setupUncaughtExceptionHandler(['fetch', 'NetworkError']);
});
```

### Test times out waiting for login

```typescript
// Use loginAndWait() which includes proper timeout
loginAndWait();
// Or increase timeout
waitForLogin(15000); // 15 seconds
```

### Element not found errors

```typescript
// Use conditional check
ifElementExists('[data-testid="element"]', () => {
  cy.get('[data-testid="element"]').click();
});
```

### Token-related test failures

```typescript
// Use appropriate token helper
setExpiredToken(); // For expiration tests
setInvalidToken(); // For invalid token tests
setMalformedToken(); // For malformed token tests
```

## Reference Documentation

- **[Local Helper Docs](../Template.Client/cypress/support/README.md)** - Helper function reference
- **[Cypress README](../Template.Client/cypress/README.md)** - Local Cypress docs

---

**Status**: ✅ All tests standardized and verified

