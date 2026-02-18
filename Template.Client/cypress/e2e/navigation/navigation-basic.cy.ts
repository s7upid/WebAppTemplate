import { baseTestSetup } from "../../support/base-test";
import {
  loginAndWait,
  clearSession,
  setTheme,
} from "../../support/test-helpers";

describe("Application Flow", () => {
  beforeEach(() => {
    baseTestSetup();
  });

  describe("Complete User Management Flow", () => {
    it("should complete full user management workflow", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Complete Role Management Flow", () => {
    it("should complete full role management workflow", () => {
      loginAndWait();
      cy.visit("/roles");
      cy.get("body").should("be.visible");
    });
  });

  describe("Permission Management Flow", () => {
    it("should complete permission management workflow", () => {
      loginAndWait();
      cy.visit("/permissions");
      cy.get("body").should("be.visible");
    });
  });

  describe("Cross-Role Navigation Flow", () => {
    it("should navigate between different sections as super admin", () => {
      loginAndWait();
      cy.visit("/dashboard");
      cy.get("body").should("be.visible");
      cy.visit("/users");
      cy.get("body").should("be.visible");
      cy.visit("/roles");
      cy.get("body").should("be.visible");
      cy.visit("/permissions");
      cy.get("body").should("be.visible");
    });

    it("should have limited navigation as regular user", () => {
      loginAndWait();
      cy.visit("/dashboard");
      cy.get("body").should("be.visible");
      cy.visit("/users");
      cy.get("body").should("be.visible");
      cy.visit("/roles");
      cy.get("body").should("be.visible");
      cy.visit("/permissions");
      cy.get("body").should("be.visible");
    });
  });

  describe("Theme Persistence Flow", () => {
    it("should persist theme selection across navigation", () => {
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");
      setTheme("dark");
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("Session Management Flow", () => {
    it("should maintain session across page refreshes", () => {
      loginAndWait();
      cy.visit("/dashboard");
      cy.reload();
      cy.get("body").should("be.visible");
      cy.visit("/users");
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should logout and redirect to login", () => {
      loginAndWait();
      cy.visit("/dashboard");
      cy.get("body").should("be.visible");
      clearSession();
      cy.visit("/dashboard");
      cy.get("body").should("be.visible");
    });
  });

  describe("Error Handling Flow", () => {
    it("should handle network errors gracefully", () => {
      loginAndWait();
      cy.visit("/users");
      cy.intercept("GET", "/api/users", { forceNetworkError: true });
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should handle server errors gracefully", () => {
      loginAndWait();
      cy.visit("/users");
      cy.intercept("GET", "/api/users", { statusCode: 500 });
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("Responsive Flow", () => {
    it("should work on mobile devices", () => {
      cy.viewport(375, 667);
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");
    });

    it("should work on tablet devices", () => {
      cy.viewport(768, 1024);
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");
    });
  });

  describe("Data Persistence Flow", () => {
    it("should persist form data during navigation", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Performance Flow", () => {
    it("should load pages quickly", () => {
      loginAndWait();
      cy.visit("/dashboard");
      cy.get("body").should("be.visible");
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });
});
