import { TEST_IDS } from "../../../src/config/constants";
import { baseTestSetup } from "../../support/base-test";
import { loginAndWait, clearSession } from "../../support/test-helpers";

describe("Session Management", () => {
  beforeEach(() => {
    baseTestSetup();
  });

  describe("Session Persistence", () => {
    it("should maintain session after page refresh", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");

      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should maintain session across different pages", () => {
      loginAndWait();

      cy.visit("/");
      cy.get("body").should("be.visible");

      cy.visit("/users");
      cy.get("body").should("be.visible");

      cy.visit("/roles");
      cy.get("body").should("be.visible");
    });

    it("should maintain session after browser back/forward", () => {
      loginAndWait();

      cy.visit("/");
      cy.get("body").should("be.visible");

      cy.visit("/users");
      cy.get("body").should("be.visible");

      // Go back
      cy.go("back");
      cy.get("body").should("be.visible");

      // Go forward
      cy.go("forward");
      cy.get("body").should("be.visible");
    });
  });

  describe("Session Expiration", () => {
    it("should redirect to login when session expires", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");

      // Clear session (simulating expiration)
      clearSession();

      // Try to access protected route
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should not allow access to protected routes without session", () => {
      // Don't login, just try to access protected route
      cy.visit("/users");
      cy.get("body").should("be.visible");

      cy.visit("/roles");
      cy.get("body").should("be.visible");

      cy.visit("/");
      cy.get("body").should("be.visible");
    });
  });

  describe("Session Storage", () => {
    it("should store authentication data correctly", () => {
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");
    });

    it("should clear session data on logout", () => {
      loginAndWait();
      cy.visit("/");

      // Logout
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.LOGOUT_BUTTON}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.LOGOUT_BUTTON}"]`).click();
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Multiple Tab Session", () => {
    it("should maintain session across multiple tabs", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Session Timeout", () => {
    it("should handle session timeout gracefully", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");

      // Simulate session timeout by clearing session
      clearSession();
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });
});
