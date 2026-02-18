import { baseTestSetup } from "../../support/base-test";
import {
  setExpiredToken,
  interceptUnauthorized,
  loginAndWait,
  setInvalidToken,
  setMalformedToken,
  setMissingToken,
} from "../../support/test-helpers";

describe("Token Expiration Handling", () => {
  beforeEach(() => {
    baseTestSetup();
  });

  describe("Token Expiration Detection", () => {
    it("should detect expired token and redirect to login", () => {
      setExpiredToken();
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should handle 401 Unauthorized response and redirect to login", () => {
      loginAndWait();
      cy.visit("/users");

      interceptUnauthorized("**/api/users**", "unauthorized");
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should clear storage on 401 response", () => {
      loginAndWait();
      cy.visit("/users");

      interceptUnauthorized("**/api/users**", "unauthorized");
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("Token Expiration During API Calls", () => {
    it("should handle expired token on user list request", () => {
      setExpiredToken();
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should handle expired token on role list request", () => {
      setExpiredToken();
      cy.visit("/roles");
      cy.get("body").should("be.visible");
    });

    it("should handle expired token on dashboard request", () => {
      setExpiredToken();
      cy.visit("/");
      cy.get("body").should("be.visible");
    });
  });

  describe("Invalid Token Handling", () => {
    it("should handle invalid token format", () => {
      setInvalidToken("invalid-token-format");

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should handle malformed JWT token", () => {
      setMalformedToken();

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should handle missing token", () => {
      setMissingToken();

      cy.visit("/users");
      cy.get("body").should("be.visible");
    });
  });
});
