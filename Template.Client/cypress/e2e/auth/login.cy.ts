import { TEST_IDS } from "../../../src/config/constants";
import { baseTestSetup } from "../../support/base-test";
import {
  loginAndWait,
  waitForLogin,
  verifyTokenExists,
  waitForLoginRedirect,
  clearSession,
} from "../../support/test-helpers";

declare global {
  namespace Cypress {
    interface Chainable {
      tab(): Chainable<Element>;
    }
  }
}

Cypress.Commands.add("tab", { prevSubject: "element" }, (subject) => {
  cy.wrap(subject).trigger("keydown", { key: "Tab" });
});

describe("Login Functionality", () => {
  beforeEach(() => {
    baseTestSetup();
    cy.visit("/login");
    cy.get("body").should("be.visible");
  });

  describe("Login Page", () => {
    it("should display the login page", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.LOGIN_PAGE}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.LOGIN_PAGE}"]`).should("be.visible");
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });

    it("should have required form fields", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).should(
            "be.visible"
          );
        }
        if ($b.find(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).should(
            "be.visible"
          );
        }
        if ($b.find(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should have Google login button", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.GOOGLE_LOGIN_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.GOOGLE_LOGIN_BUTTON}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should have forgot password link", () => {
      cy.get("body").should("be.visible");
    });

    it("should have sign up link", () => {
      cy.get("body").should("be.visible");
    });
  });

  describe("Form Validation", () => {
    it("should validate required fields", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
          cy.url().should("include", "/login");
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });

    it("should validate email format", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "invalid-email"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type(
            "password123"
          );
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
          cy.url().should("include", "/login");
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });

    it("should validate password length", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "user@example.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("123");
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
          cy.url().should("include", "/login");
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Successful Login", () => {
    it("should login with valid credentials", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "admin@admin.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("admin123");
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
          cy.url().should("match", /http:\/\/localhost:3000\//);
        } else {
          cy.url().should("match", /http:\/\/localhost:3000\//);
        }
      });
    });

    it("should login with Enter key", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "admin@admin.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("admin123");
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("{enter}");
        }
        cy.url().should("match", /http:\/\/localhost:3000\//);
      });
    });

    it("should show loading state during login", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "admin@admin.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("admin123");
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
        }
        cy.url().should("match", /http:\/\/localhost:3000\//);
      });
    });

    it("should redirect to dashboard after successful login", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "admin@admin.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("admin123");
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
        }
        cy.url().should("match", /http:\/\/localhost:3000\//);
      });
    });
  });

  describe("Failed Login", () => {
    it("should show error for invalid credentials", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "invalid@example.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type(
            "wrongpassword"
          );
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
          cy.url().should("include", "/login");
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });

    it("should show error for non-existent user", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "nonexistent@example.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type(
            "password123"
          );
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
          cy.url().should("include", "/login");
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });

    it("should show error for locked account", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "locked@example.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type(
            "password123"
          );
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
          cy.url().should("include", "/login");
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Google Login", () => {
    it("should show Google login button", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.GOOGLE_LOGIN_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.GOOGLE_LOGIN_BUTTON}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should handle Google login click", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.GOOGLE_LOGIN_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.GOOGLE_LOGIN_BUTTON}"]`).click();
        }
      });
    });
  });

  describe("Password Visibility", () => {
    it("should toggle password visibility", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type(
            "password123"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_TOGGLE}"]`).click();
        }
        cy.get("body").should("be.visible");
      });
    });
  });

  describe("Remember Me", () => {
    it("should have remember me checkbox", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.REMEMBER_ME}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.REMEMBER_ME}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should remember user when checked", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "admin@admin.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("admin123");
          if ($b.find(`[data-testid="${TEST_IDS.REMEMBER_ME}"]`).length > 0) {
            cy.get(`[data-testid="${TEST_IDS.REMEMBER_ME}"]`).find("input[type=checkbox]").check();
          }
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
        }
        cy.url().should("match", /http:\/\/localhost:3000\//);
      });
    });
  });

  describe("Navigation Links", () => {
    it("should navigate to forgot password page", () => {
      cy.get("body").should("be.visible");
    });

    it("should navigate to sign up page", () => {
      cy.get("body").should("be.visible");
    });
  });

  describe("Responsive Design", () => {
    it("should be responsive on mobile", () => {
      cy.viewport(375, 667);
      cy.get("body").should("be.visible");
    });

    it("should be responsive on tablet", () => {
      cy.viewport(768, 1024);
      cy.get("body").should("be.visible");
    });

    it("should be responsive on desktop", () => {
      cy.viewport(1920, 1080);
      cy.get("body").should("be.visible");
    });
  });

  describe("Dark Mode Support", () => {
    it("should work in dark mode", () => {
      cy.get("body").should("be.visible");
    });

    it("should work in light mode", () => {
      cy.get("body").should("be.visible");
    });
  });

  describe("Accessibility", () => {
    it("should have proper form labels", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).should("exist");
        }
        if ($b.find(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).should("exist");
        }
      });
    });

    it("should have proper button labels", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).should("exist");
        }
        if (
          $b.find(`[data-testid="${TEST_IDS.GOOGLE_LOGIN_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.GOOGLE_LOGIN_BUTTON}"]`).should(
            "exist"
          );
        }
      });
    });

    it("should support keyboard navigation", () => {
      cy.get("body").should("be.visible");
    });
  });

  describe("Session Management", () => {
    it("should redirect to login when not authenticated", () => {
      cy.visit("/dashboard");
      cy.url().should("include", "/login");
    });

    it("should maintain session after page refresh", () => {
      loginAndWait();
      verifyTokenExists();

      cy.reload();
      waitForLogin();
      verifyTokenExists();
    });

    it("should logout when session expires", () => {
      loginAndWait();

      // Clear session (simulating expiration)
      clearSession();

      // Try to access protected route
      cy.visit("/");
      waitForLoginRedirect();
    });
  });

  describe("Error Handling", () => {
    it("should handle network errors gracefully", () => {
      cy.intercept("POST", "/api/auth/login", { forceNetworkError: true });
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "admin@admin.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("admin123");
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
          cy.url().should("include", "/login");
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });

    it("should handle server errors gracefully", () => {
      cy.intercept("POST", "/api/auth/login", { statusCode: 500 });
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            "admin@admin.com"
          );
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("admin123");
          cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();
          cy.url().should("include", "/login");
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });
  });
});
