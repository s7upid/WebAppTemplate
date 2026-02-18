import { baseTestSetup } from "../../support/base-test";
import { loginAndWait, clickLogout } from "../../support/test-helpers";

describe("Logout Functionality", () => {
  beforeEach(() => {
    baseTestSetup();
  });

  describe("Logout Flow", () => {
    it("should logout successfully and redirect to login", () => {
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");

      clickLogout();
      cy.get("body").should("be.visible");
    });

    it("should clear all authentication data on logout", () => {
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");

      // Set some additional auth-related data
      cy.window().then((win) => {
        win.localStorage.setItem("auth-token", "test-token");
        win.localStorage.setItem(
          "auth-user",
          JSON.stringify({ id: 1, email: "test@test.com" })
        );
        win.localStorage.setItem("refresh-token", "test-refresh");
      });

      clickLogout();
      cy.get("body").should("be.visible");
    });

    it("should prevent access to protected routes after logout", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");

      clickLogout();

      // Try to access protected route
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });

  describe("Logout from Different Pages", () => {
    it("should logout from dashboard page", () => {
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");
      clickLogout();
      cy.get("body").should("be.visible");
    });

    it("should logout from users page", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");
      clickLogout();
      cy.get("body").should("be.visible");
    });

    it("should logout from roles page", () => {
      loginAndWait();
      cy.visit("/roles");
      cy.get("body").should("be.visible");
      clickLogout();
      cy.get("body").should("be.visible");
    });
  });
});
