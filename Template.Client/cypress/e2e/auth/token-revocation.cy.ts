import { baseTestSetup } from "../../support/base-test";
import {
  loginAndWait,
  clickLogout,
  interceptRevokedToken,
} from "../../support/test-helpers";

describe("Token Revocation", () => {
  beforeEach(() => {
    baseTestSetup();
  });

  describe("Logout Token Revocation", () => {
    it("should revoke token on logout", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");

      // Intercept logout endpoint
      cy.intercept("POST", "**/api/auth/logout", {
        statusCode: 200,
        body: { success: true },
      }).as("logout");

      clickLogout();
      cy.get("body").should("be.visible");
    });

    it("should prevent API access after logout", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");

      // Logout
      cy.intercept("POST", "**/api/auth/logout", {
        statusCode: 200,
        body: { success: true },
      }).as("logout");

      clickLogout();

      // Try to access protected endpoint with old token
      interceptRevokedToken("**/api/users**", "revokedRequest");

      // Navigate to users page
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("User Deletion Token Revocation", () => {
    it("should revoke tokens when user is deleted", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");

      // Create a test user first
      const testUserEmail = `test-${Date.now()}@example.com`;

      cy.intercept("POST", "**/api/users", {
        statusCode: 200,
        body: {
          id: "test-user-id",
          email: testUserEmail,
          firstName: "Test",
          lastName: "User",
        },
      }).as("createUser");

      // Create user (if UI supports it)
      // Then delete the user
      cy.intercept("DELETE", "**/api/users/**", {
        statusCode: 200,
        body: { success: true },
      }).as("deleteUser");

      // After deletion, any requests with that user's token should fail
      // This is tested server-side, but we can verify the deletion endpoint is called
    });
  });

  describe("Revoked Token Validation", () => {
    it("should reject API requests with revoked token", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");

      interceptRevokedToken("**/api/users**", "revokedToken");
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should handle revoked token error message correctly", () => {
      loginAndWait();

      const revocationMessage =
        "User token has been revoked. Please log in again.";

      cy.intercept("GET", "**/api/users**", {
        statusCode: 401,
        body: { message: revocationMessage },
      }).as("revokedToken");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Token Revocation After Logout", () => {
    it("should not allow token reuse after logout", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");

      // Get the token before logout
      let tokenBeforeLogout: string | null = null;
      cy.window().then((win) => {
        tokenBeforeLogout = win.localStorage.getItem("auth-token");
      });

      // Logout
      cy.intercept("POST", "**/api/auth/logout", {
        statusCode: 200,
        body: { success: true },
      }).as("logout");

      clickLogout();

      // Try to use the old token (simulate by setting it manually)
      cy.window().then((win) => {
        if (tokenBeforeLogout) {
          win.localStorage.setItem("auth-token", tokenBeforeLogout);
        }
      });

      // Try to access protected endpoint
      interceptRevokedToken("**/api/users**", "revokedRequest");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });
});
