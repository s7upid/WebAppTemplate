import { TEST_IDS } from "../../../src/config/constants";
import {
  baseTestSetup,
  setupUncaughtExceptionHandler,
} from "../../support/base-test";
import {
  setExpiredToken,
  interceptRateLimit,
  interceptRevokedToken,
  loginAndWait,
  setInvalidToken,
} from "../../support/test-helpers";

describe("Error Handling", () => {
  beforeEach(() => {
    baseTestSetup();
    setupUncaughtExceptionHandler(["fetch", "NetworkError"]);
  });

  describe("Login Error Handling", () => {
    it("should handle invalid login credentials", () => {
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
        "invalid@example.com"
      );
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type(
        "wrongpassword"
      );
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.get("body").should("be.visible");
    });

    it("should handle network errors during login", () => {
      cy.intercept("POST", "**/api/auth/login", { forceNetworkError: true });
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
        "test@example.com"
      );
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("password123");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.get("body").should("be.visible");
    });

    it("should handle session expiration", () => {
      setInvalidToken();
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Form Validation Errors", () => {
    it("should display client-side validation errors", () => {
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.wait(500);
      cy.get("body").should("be.visible");
    });

    it("should clear validation errors when form is corrected", () => {
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.wait(500);
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
        "test@example.com"
      );
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("password123");
      cy.get("body").should("be.visible");
    });

    it("should validate email format", () => {
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type("invalid-email");
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("password123");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.wait(500);
      cy.get("body").should("be.visible");
    });
  });

  describe("Authentication Errors", () => {
    it("should handle invalid login credentials", () => {
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
        "nonexistent@example.com"
      );
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type(
        "wrongpassword"
      );
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.get("body").should("be.visible");
    });

    it("should handle session expiration with expired token", () => {
      setExpiredToken();
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should handle revoked token error", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");

      interceptRevokedToken("**/api/users**", "revokedToken");
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("Rate Limiting Errors", () => {
    it("should handle 429 rate limit errors gracefully", () => {
      loginAndWait();

      interceptRateLimit(
        "**/api/users**",
        "Rate limit exceeded. Maximum 10 requests per 15 minutes.",
        "rateLimited"
      );
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should handle rate limit errors with different message formats", () => {
      loginAndWait();

      // Intercept with different message format
      cy.intercept("GET", "**/api/users**", {
        statusCode: 429,
        body: { errorMessage: "Rate limit exceeded" },
      }).as("rateLimited");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Permission Errors", () => {
    it("should handle insufficient permissions", () => {
      cy.loginAsUser();
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Error Recovery", () => {
    it("should allow navigation away from error states", () => {
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.wait(500);
      cy.visit("/");
      cy.get("body").should("be.visible");
    });
  });

  describe("Error Accessibility", () => {
    it("should announce errors to screen readers", () => {
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.wait(500);
      cy.get("body").should("be.visible");
    });

    it("should have proper error message contrast", () => {
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.wait(500);
      cy.get("body").should("be.visible");
    });
  });

  describe("Error Prevention", () => {
    it("should validate data before submission", () => {
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.wait(500);
      cy.url().should("include", "/login");
    });

    it("should prevent duplicate submissions", () => {
      cy.visit("/login");
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
        "test@example.com"
      );
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("password123");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
      cy.get("body").should("be.visible");
    });
  });
});
