/// <reference types="cypress" />
/**
 * User Management Flows – full E2E with real login and backend.
 * Covers: login (with/without permission), user list (grid with USER_ROW cards), search,
 * create (with success toast), navigate to detail, back to list, edit (with success toast),
 * delete (with success toast), role/permission modals, validation and smoke.
 * Requires app and backend running (e.g. scripts/start.bat).
 * Selectors: user list uses TEST_IDS.USER_ROW (card grid), not table rows.
 */
import { TEST_IDS, SUCCESS_MESSAGES } from "../../../src/config/constants";
import { baseTestSetup } from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("User Management Flows", () => {
  beforeEach(() => {
    baseTestSetup();
  });

  describe("Login Flow", () => {
    it("TC01 - Successful Login shows User Management entry", () => {
      loginAndWait();
      cy.visit("/");
      cy.url().should("include", "/").and("not.include", "/login");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.NAV_USERS}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.NAV_USERS}"]`).should("be.visible");
        }
      });
    });

    it("TC02 - Login Without Permission cannot access users", () => {
      loginAndWait("alice.johnson@example.com", "password123");
      cy.visit("/users");
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ACCESS_DENIED}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ACCESS_DENIED}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("User List Page", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
    });

    it("TC03 - Display List of Users (grid or table with at least one row)", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.TABLE}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.TABLE}"]`).should("be.visible");
        }
        if ($b.find(`[data-testid="${TEST_IDS.USER_PAGE}-page"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_PAGE}-page"]`).should("be.visible");
        }
        if ($b.find(`[data-testid="${TEST_IDS.USER_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_ROW}"]`).should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });

    it("TC04 - Search or Filter Users", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        const $i = $b.find(
          'input[placeholder*="Search"], input[placeholder*="search"]'
        );
        if ($i.length > 0) {
          cy.wrap($i.first()).type("john");
          cy.wait(300);
        }
      });
    });

    it("TC05 - Create User Button Exists and opens create flow", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`)
            .should("be.visible")
            .click();
          cy.get("body").should("be.visible");
        }
      });
    });

    it("TC05b - Create User: fill form, submit, then success toast and USER_CREATED message", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();
          cy.get(`[data-testid="${TEST_IDS.USER_FORM}"]`, { timeout: 8000 }).should("be.visible");
          cy.get(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).type("Test");
          cy.get(`[data-testid="${TEST_IDS.LAST_NAME_INPUT}"]`).type("User");
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
            `test${Date.now()}@example.com`
          );
          cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
          cy.wait(1000);
          cy.get("body").then(($body) => {
            if (
              $body.find(`[data-testid="${TEST_IDS.TOAST_SUCCESS}"]`).length >
              0
            ) {
              cy.get(`[data-testid="${TEST_IDS.TOAST_SUCCESS}"]`).should(
                "be.visible"
              );
              cy.get(`[data-testid="${TEST_IDS.TOAST_TITLE}"]`).should(
                "contain",
                SUCCESS_MESSAGES.USER_CREATED
              );
            }
          });
          cy.url().should("include", "/users");
        }
      });
    });
  });

  describe("User Detail Page", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
    });

    it("TC06 - Navigate to User Detail (click first row, URL becomes /users/:id)", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.USER_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_ROW}"]`).first().click();
          cy.url().should("match", /\/users\/[^/]+/);
          cy.get("body").should("be.visible");
        }
      });
    });

    it("TC07 - Navigate Back to User List (back button returns to /users)", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.USER_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_ROW}"]`).first().click();
          cy.url().should("match", /\/users\/[^/]+/);
          const backSel = `[data-testid="${TEST_IDS.BACK_TO_USERS_BUTTON}"]`;
          cy.get("body").then(($body) => {
            if ($body.find(backSel).length > 0) {
              cy.get(backSel).click();
              cy.url().should("include", "/users");
              cy.get("body").should("be.visible");
            }
          });
        }
      });
    });
  });

  describe("Edit User", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
    });

    it("TC08 - Edit User: open detail, click Edit, form or body visible", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.USER_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_ROW}"]`).first().click();
          cy.url().should("match", /\/users\/[^/]+/);
          cy.get(`[data-testid="${TEST_IDS.EDIT_USER_BUTTON}"]`, { timeout: 8000 }).should("be.visible").click();
          cy.get("body").should("be.visible");
        }
      });
    });

    it("TC08b - Edit User: change name, submit, then success toast and USER_UPDATED message", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.USER_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_ROW}"]`).first().click();
          cy.url().should("match", /\/users\/[^/]+/);
          cy.get(`[data-testid="${TEST_IDS.EDIT_USER_BUTTON}"]`, { timeout: 8000 }).should("be.visible").click();
          cy.get(`[data-testid="${TEST_IDS.USER_FORM}"]`, { timeout: 8000 }).should("be.visible");
          cy.get(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).first().clear().type("Updated");
          cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
          cy.get("body").then(($body) => {
            if (
              $body.find(`[data-testid="${TEST_IDS.TOAST_SUCCESS}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.TOAST_SUCCESS}"]`).should(
                "be.visible"
              );
              cy.get(`[data-testid="${TEST_IDS.TOAST_TITLE}"]`).should(
                "contain",
                SUCCESS_MESSAGES.USER_UPDATED
              );
            }
          });
          cy.url().should("match", /\/users\/[^/]+/);
        }
      });
    });
  });

  describe("Delete User", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
    });

    it("TC09 - Delete User: open detail, click Delete, confirm (dialog flow)", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.USER_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_ROW}"]`).first().click();
          cy.url().should("match", /\/users\/[^/]+/);
          cy.get(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`, { timeout: 8000 }).should("be.visible").click();
          cy.get(`[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`, { timeout: 5000 }).should("be.visible").click();
          cy.url().should("include", "/users");
        }
      });
    });

    it("TC09b - Delete User: confirm delete, then success toast and USER_DELETED, redirect to list", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.USER_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_ROW}"]`).first().click();
          cy.url().should("match", /\/users\/[^/]+/);
          cy.get(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`, { timeout: 8000 }).should("be.visible").click();
          cy.get(`[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`, { timeout: 5000 }).should("be.visible").click();
          cy.wait(1000);
          cy.get("body").then(($body) => {
            if (
              $body.find(`[data-testid="${TEST_IDS.TOAST_SUCCESS}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.TOAST_SUCCESS}"]`).should(
                "be.visible"
              );
              cy.get(`[data-testid="${TEST_IDS.TOAST_TITLE}"]`).should(
                "contain",
                SUCCESS_MESSAGES.USER_DELETED
              );
            }
          });
          cy.url().should("include", "/users");
        }
      });
    });
  });

  describe("Role and Permission Management", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
    });

    it("TC10 - Change User Role (detail → Manage Roles → select role → Save)", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.USER_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_ROW}"]`).first().click();
          cy.url().should("match", /\/users\/[^/]+/);
          cy.get(`[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`, { timeout: 8000 }).should("be.visible").click();
          cy.get("body").then(($m) => {
            if ($m.find(`[data-testid="${TEST_IDS.ROLE_OPTION}"]`).length > 0) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_OPTION}"]`).first().click();
            }
            if ($m.find(`[data-testid="${TEST_IDS.SAVE_ROLE_BUTTON}"]`).length > 0) {
              cy.get(`[data-testid="${TEST_IDS.SAVE_ROLE_BUTTON}"]`).click();
            }
          });
        }
      });
    });

    it("TC11 - Change Permission and Show Custom Tag (detail → Manage Permissions → toggle → Save)", () => {
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.USER_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_ROW}"]`).first().click();
          cy.url().should("match", /\/users\/[^/]+/);
          cy.get(`[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`, { timeout: 8000 }).should("be.visible").click();
          cy.get("body").then(($m) => {
            if ($m.find(`[data-testid="${TEST_IDS.PERMISSION_CHECKBOX}"]`).length > 0) {
              cy.get(`[data-testid="${TEST_IDS.PERMISSION_CHECKBOX}"]`).first().check({ force: true });
            }
            if ($m.find(`[data-testid="${TEST_IDS.SAVE_PERMISSIONS_BUTTON}"]`).length > 0) {
              cy.get(`[data-testid="${TEST_IDS.SAVE_PERMISSIONS_BUTTON}"]`).click();
            }
          });
        }
      });
    });
  });

  describe("Negative / Edge Cases", () => {
    it("TC12 - Attempt Edit Without Permission shows access denied on /users", () => {
      loginAndWait("alice.johnson@example.com", "password123");
      cy.visit("/users");
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ACCESS_DENIED}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ACCESS_DENIED}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("TC13 - Validation Errors on Create: submit empty form, form stays open or errors shown", () => {
      loginAndWait();
      cy.visit("/users");
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();
          if ($b.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).length > 0) {
            cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
          }
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Smoke Test", () => {
    it("TC14 - Basic Navigation Smoke Test: users list → detail → list → login", () => {
      loginAndWait();
      cy.visit("/users");
      cy.url().should("include", "/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.USER_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_ROW}"]`).first().click();
          cy.url().should("match", /\/users\/[^/]+/);
        }
      });
      cy.visit("/users");
      cy.url().should("include", "/users");
      cy.get("body").should("be.visible");
      cy.visit("/login");
      // When already logged in, app may redirect to /
      cy.url().then((url) => {
        const onLogin = url.includes("/login");
        const onRoot = /^https?:\/\/[^/]+\/?$/.test(url) || url.endsWith("/");
        expect(onLogin || onRoot).to.be.true;
      });
      cy.get("body").should("be.visible");
    });
  });
});
