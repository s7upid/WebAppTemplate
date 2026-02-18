/// <reference types="cypress" />

import "./commands";
import "./test-helpers";
import "./base-test";

// Coverage collection - using custom c8-compatible approach
const enableCoverage = Cypress.env("ENABLE_COVERAGE") === true || 
                       Cypress.env("ENABLE_COVERAGE") === "true";

if (enableCoverage) {
  console.log("📊 Cypress coverage collection is ENABLED");
  
  // Clear old coverage at the start
  before(() => {
    cy.task("clearCoverage", null, { log: false });
  });
  
  // Collect coverage after each test
  afterEach(() => {
    cy.window().then((win) => {
      const coverage = (win as unknown as { __coverage__?: object }).__coverage__;
      if (coverage) {
        const fileCount = Object.keys(coverage).length;
        console.log(`📊 Saving coverage from ${fileCount} instrumented files`);
        cy.task("saveCoverage", coverage, { log: false });
      } else {
        console.log("⚠️ No __coverage__ found on window - is the app built with coverage instrumentation?");
      }
    });
  });

  // Write final coverage after all tests
  after(() => {
    cy.task("getCoverage", null, { log: false }).then((coverage) => {
      if (coverage && Object.keys(coverage as object).length > 0) {
        console.log(`📊 Writing final coverage for ${Object.keys(coverage as object).length} files`);
        cy.task("writeFinalCoverage", coverage, { log: false });
      } else {
        console.log("⚠️ No coverage data accumulated");
      }
    });
  });
} else {
  console.log("📊 Cypress coverage collection is DISABLED (set ENABLE_COVERAGE=true to enable)");
}

const disableAnimations = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    *, *::before, *::after {
      transition: none !important;
      animation: none !important;
    }
  `;
  document.head.appendChild(style);
};

Cypress.on("window:load", () => {
  disableAnimations();
});

Cypress.on("uncaught:exception", () => false);

// Global API interceptors - mock all API calls by default
beforeEach(() => {
  // Mock login endpoint
  cy.intercept("POST", "**/api/auth/login", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        token: "mock-jwt-token",
        user: {
          id: "1",
          email: "admin@admin.com",
          firstName: "Admin",
          lastName: "User",
          role: "administrator",
        },
      },
    },
  }).as("loginApi");

  // Mock logout endpoint
  cy.intercept("POST", "**/api/auth/logout", {
    statusCode: 200,
    body: { success: true },
  }).as("logoutApi");

  // Mock token refresh endpoint
  cy.intercept("POST", "**/api/auth/refresh-token", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        token: "mock-refreshed-token",
        user: {
          id: "1",
          email: "admin@admin.com",
          firstName: "Admin",
          lastName: "User",
        },
      },
    },
  }).as("refreshTokenApi");

  // Mock users endpoint
  cy.intercept("GET", "**/api/users**", {
    statusCode: 200,
    body: {
      success: true,
      data: [
        {
          id: "1",
          email: "admin@admin.com",
          firstName: "Admin",
          lastName: "User",
          role: "administrator",
          status: "active",
        },
        {
          id: "2",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "admin",
          status: "active",
        },
        {
          id: "3",
          email: "jane.smith@example.com",
          firstName: "Jane",
          lastName: "Smith",
          role: "manager",
          status: "active",
        },
        {
          id: "4",
          email: "alice.johnson@example.com",
          firstName: "Alice",
          lastName: "Johnson",
          role: "user",
          status: "active",
        },
      ],
      totalCount: 4,
      pageSize: 10,
      currentPage: 1,
    },
  }).as("getUsersApi");

  // Mock create user endpoint
  cy.intercept("POST", "**/api/users", {
    statusCode: 201,
    body: {
      success: true,
      data: {
        id: "99",
        email: "new@example.com",
        firstName: "New",
        lastName: "User",
      },
    },
  }).as("createUserApi");

  // Mock update user endpoint
  cy.intercept("PUT", "**/api/users/**", {
    statusCode: 200,
    body: { success: true },
  }).as("updateUserApi");

  // Mock delete user endpoint
  cy.intercept("DELETE", "**/api/users/**", {
    statusCode: 200,
    body: { success: true },
  }).as("deleteUserApi");

  // Mock roles endpoint
  cy.intercept("GET", "**/api/roles**", {
    statusCode: 200,
    body: {
      success: true,
      data: [
        {
          id: "1",
          name: "Administrator",
          description: "Full system access",
          isSystem: true,
        },
        {
          id: "2",
          name: "Admin",
          description: "Administrative access",
          isSystem: false,
        },
        {
          id: "3",
          name: "Manager",
          description: "Manager level access",
          isSystem: false,
        },
        {
          id: "4",
          name: "User",
          description: "Basic user access",
          isSystem: false,
        },
      ],
      totalCount: 4,
    },
  }).as("getRolesApi");

  // Mock create role endpoint
  cy.intercept("POST", "**/api/roles", {
    statusCode: 201,
    body: {
      success: true,
      data: { id: "99", name: "New Role", description: "New role description" },
    },
  }).as("createRoleApi");

  // Mock update role endpoint
  cy.intercept("PUT", "**/api/roles/**", {
    statusCode: 200,
    body: { success: true },
  }).as("updateRoleApi");

  // Mock delete role endpoint
  cy.intercept("DELETE", "**/api/roles/**", {
    statusCode: 200,
    body: { success: true },
  }).as("deleteRoleApi");

  // Mock permissions endpoint
  cy.intercept("GET", "**/api/permissions**", {
    statusCode: 200,
    body: {
      success: true,
      data: [
        { id: "1", name: "users.view", description: "View users" },
        { id: "2", name: "users.create", description: "Create users" },
        { id: "3", name: "users.edit", description: "Edit users" },
        { id: "4", name: "users.delete", description: "Delete users" },
        { id: "5", name: "roles.view", description: "View roles" },
        { id: "6", name: "roles.manage", description: "Manage roles" },
      ],
      totalCount: 6,
    },
  }).as("getPermissionsApi");

  // Mock any other API calls with a generic success response
  cy.intercept("GET", "**/api/**", {
    statusCode: 200,
    body: { success: true, data: [] },
  }).as("genericGetApi");

  cy.intercept("POST", "**/api/**", {
    statusCode: 200,
    body: { success: true },
  }).as("genericPostApi");

  cy.intercept("PUT", "**/api/**", {
    statusCode: 200,
    body: { success: true },
  }).as("genericPutApi");

  cy.intercept("DELETE", "**/api/**", {
    statusCode: 200,
    body: { success: true },
  }).as("genericDeleteApi");
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsAdmin(): Chainable;
      loginAsUser(): Chainable;
      login(email: string, password: string): Chainable;
      loginAndWait(email?: string, password?: string): Chainable;
      logout(): Chainable;
      verifyAuthenticated(): Chainable;
      verifyLoggedOut(): Chainable;
      createUser(userData: any): Chainable;
      createRole(roleData: any): Chainable;
      assignPermission(userId: string, permission: string): Chainable;
      assignRole(userId: string, roleId: string): Chainable;
      toggleTheme(): Chainable;
      clickTableHeader(headerText: string): Chainable;
      cancelDialog(): Chainable;
      confirmDialog(): Chainable;
      fillForm(formData: Record<string, string>): Chainable;
    }
  }
}
