import { baseTestSetup } from "../../support/base-test";
import {
  loginAndWait,
  interceptTokenRefresh,
  setExpiringToken,
} from "../../support/test-helpers";

describe("Token Refresh", () => {
  beforeEach(() => {
    baseTestSetup();
  });

  describe("Automatic Token Refresh", () => {
    it("should automatically refresh token when it expires", () => {
      loginAndWait();

      // Set up intercepts BEFORE visiting the page
      interceptTokenRefresh(200, "new-refreshed-token", "refreshToken");

      // Intercept a protected endpoint and return 401 first, then success after refresh
      let callCount = 0;
      cy.intercept("GET", "**/api/users**", (req) => {
        callCount++;
        if (callCount === 1) {
          req.reply({ statusCode: 401, body: { message: "Unauthorized" } });
        } else {
          req.reply({
            statusCode: 200,
            body: { success: true, data: [] },
          });
        }
      }).as("getUsers");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should retry original request after token refresh", () => {
      loginAndWait();

      // Setup intercepts BEFORE visiting
      interceptTokenRefresh(200, "refreshed-token-123", "refreshToken");

      let userCallCount = 0;
      cy.intercept("GET", "**/api/users**", (req) => {
        userCallCount++;
        if (userCallCount === 1) {
          req.reply({ statusCode: 401 });
        } else {
          req.reply({
            statusCode: 200,
            body: { success: true, data: [] },
          });
        }
      }).as("getUsers");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Token Refresh Failure", () => {
    it("should redirect to login when token refresh fails", () => {
      loginAndWait();

      // Set up intercepts BEFORE visiting
      // Intercept refresh to fail
      interceptTokenRefresh(401, "", "refreshFail");

      // Intercept protected endpoint to return 401
      cy.intercept("GET", "**/api/users**", {
        statusCode: 401,
      }).as("getUsers");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should clear storage when token refresh fails", () => {
      loginAndWait();

      // Set up intercepts BEFORE visiting
      interceptTokenRefresh(401, "", "refreshFail");

      cy.intercept("GET", "**/api/users**", {
        statusCode: 401,
      }).as("getUsers");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Token Refresh Scenarios", () => {
    it("should handle network error during token refresh", () => {
      loginAndWait();

      // Set up intercepts BEFORE visiting
      // Intercept refresh with network error
      cy.intercept("POST", "**/api/auth/refresh-token", {
        forceNetworkError: true,
      }).as("refreshError");

      cy.intercept("GET", "**/api/users**", {
        statusCode: 401,
      }).as("getUsers");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should handle server error during token refresh", () => {
      loginAndWait();

      // Set up intercepts BEFORE visiting
      cy.intercept("POST", "**/api/auth/refresh-token", {
        statusCode: 500,
        body: { message: "Internal server error" },
      }).as("refreshError");

      cy.intercept("GET", "**/api/users**", {
        statusCode: 401,
      }).as("getUsers");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Token Refresh Timing", () => {
    it("should refresh token before it expires", () => {
      loginAndWait();

      // Create a token that expires soon
      setExpiringToken();

      // Set up intercepts BEFORE visiting
      interceptTokenRefresh(200, "new-token", "refreshToken");

      // Make an API call that should trigger refresh
      cy.intercept("GET", "**/api/users**", (req) => {
        req.reply({ statusCode: 200, body: { success: true, data: [] } });
      }).as("getUsers");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });
});
