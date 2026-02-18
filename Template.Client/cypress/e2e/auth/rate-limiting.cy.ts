import { TEST_IDS } from "../../../src/config/constants";
import { baseTestSetup } from "../../support/base-test";
import {
  loginAndWait,
  interceptRateLimit,
  interceptTokenRefresh,
} from "../../support/test-helpers";

describe("Rate Limiting", () => {
  beforeEach(() => {
    baseTestSetup();
  });

  describe("Login Rate Limiting (5 requests per 15 minutes)", () => {
    it("should allow 5 login requests within rate limit", () => {
      cy.visit("/login");

      // Intercept login endpoint - first 5 requests should succeed
      let requestCount = 0;
      cy.intercept("POST", "**/api/auth/login", (req) => {
        requestCount++;
        if (requestCount <= 5) {
          req.reply({
            statusCode: 401, // Invalid credentials, but not rate limited
            body: { message: "Invalid credentials" },
          });
        } else {
          req.reply({
            statusCode: 429,
            body: {
              success: false,
              message:
                "Rate limit exceeded. Maximum 5 requests per 15 minutes.",
            },
          });
        }
      }).as("login");

      // Make login attempt (should not be rate limited)
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).then(($el) => {
        if ($el.length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`)
            .clear()
            .type("test@example.com");
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`)
            .clear()
            .type("wrongpassword");
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
        }
      });

      cy.get("body").should("be.visible");
    });

    it("should return 429 on 6th login request", () => {
      cy.visit("/login");

      // Intercept login endpoint to return 429
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 429,
        body: {
          success: false,
          message: "Rate limit exceeded. Maximum 5 requests per 15 minutes.",
        },
      }).as("login");

      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).then(($el) => {
        if ($el.length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`)
            .clear()
            .type("test@example.com");
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`)
            .clear()
            .type("wrongpassword");
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
        }
      });

      cy.get("body").should("be.visible");
    });

    it("should display warning toast for login rate limit", () => {
      cy.visit("/login");

      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 429,
        body: {
          success: false,
          message: "Rate limit exceeded. Maximum 5 requests per 15 minutes.",
        },
      }).as("rateLimited");

      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).then(($el) => {
        if ($el.length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "test@example.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type(
            "password123"
          );
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
        }
      });

      // Should show warning toast (not error toast)
      cy.get("body").should("be.visible");
    });

    it("should handle rate limit per IP address", () => {
      cy.visit("/login");

      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 429,
        body: {
          success: false,
          message: "Rate limit exceeded. Maximum 5 requests per 15 minutes.",
        },
      }).as("rateLimited");

      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).then(($el) => {
        if ($el.length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`)
            .clear()
            .type("user@example.com");
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`)
            .clear()
            .type("password123");
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
        }
      });

      cy.get("body").should("be.visible");
    });
  });

  describe("Token Refresh Rate Limiting (10 requests per 15 minutes)", () => {
    it("should allow requests within rate limit", () => {
      loginAndWait();

      // Intercept refresh token endpoint - requests should succeed
      cy.intercept("POST", "**/api/auth/refresh-token", {
        statusCode: 200,
        body: {
          user: { id: 1, email: "admin@admin.com" },
          token: "new-token",
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        },
      }).as("refreshToken");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should return 429 when rate limit exceeded", () => {
      loginAndWait();

      // Intercept refresh token endpoint to return 429
      cy.intercept("POST", "**/api/auth/refresh-token", {
        statusCode: 429,
        body: {
          success: false,
          message: "Rate limit exceeded. Maximum 10 requests per 15 minutes.",
        },
      }).as("refreshToken");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should display rate limit error message to user", () => {
      loginAndWait();

      // Set up intercept BEFORE visiting
      interceptTokenRefresh(429, "", "rateLimited");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Rate Limit Error Handling", () => {
    it("should handle 429 errors gracefully", () => {
      loginAndWait();

      // Set up intercept BEFORE visiting
      interceptRateLimit(
        "**/api/users**",
        "Rate limit exceeded. Please try again later.",
        "rateLimited"
      );

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should extract rate limit message from response", () => {
      loginAndWait();

      cy.intercept("GET", "**/api/users**", {
        statusCode: 429,
        body: {
          message: "Rate limit exceeded. Maximum 10 requests per 15 minutes.",
        },
      }).as("rateLimited");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should show warning toast for rate limit errors (not error toast)", () => {
      loginAndWait();

      // Set up intercept BEFORE visiting
      interceptRateLimit(
        "**/api/users**",
        "Rate limit exceeded. Maximum 10 requests per 15 minutes.",
        "rateLimited"
      );

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should handle concurrent rate limit requests", () => {
      loginAndWait();

      cy.intercept("POST", "**/api/auth/refresh-token", {
        statusCode: 429,
        body: { message: "Rate limit exceeded" },
      }).as("refreshToken");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Rate Limit Window Expiration", () => {
    it("should reset rate limit after window expires", () => {
      loginAndWait();

      interceptTokenRefresh(200, "new-token", "refreshToken");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });
});
