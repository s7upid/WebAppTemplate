/// <reference types="cypress" />
import { setupTest, cleanupTest } from "./test-helpers";

/**
 * Base test configuration that can be used in beforeEach hooks
 * Clears cookies and localStorage before each test
 */
export function baseTestSetup() {
  setupTest();
}

/**
 * Base test cleanup that can be used in afterEach hooks
 */
export function baseTestCleanup() {
  cleanupTest();
}

/**
 * Common beforeEach hook for auth-related tests
 */
export function authTestSetup() {
  baseTestSetup();
}

/**
 * Common beforeEach hook for tests that need a clean state
 */
export function cleanStateSetup() {
  baseTestSetup();
}

/**
 * Setup uncaught exception handler (common pattern for tests that need to ignore certain errors)
 */
export function setupUncaughtExceptionHandler(
  ignorePatterns: string[] = [
    "fetch",
    "NetworkError",
    "Objects are not valid as a React child",
  ]
) {
  cy.on("uncaught:exception", (err) => {
    // Return false to prevent the error from failing the test
    if (ignorePatterns.some((pattern) => err.message.includes(pattern))) {
      return false;
    }
    return true;
  });
}

/**
 * Setup uncaught exception handler that ignores all exceptions (use with caution)
 */
export function setupIgnoreAllExceptions() {
  cy.on("uncaught:exception", () => false);
}
