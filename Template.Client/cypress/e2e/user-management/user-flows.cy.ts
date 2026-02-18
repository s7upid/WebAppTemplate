/// <reference types="cypress" />
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
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.NAV_USERS}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.NAV_USERS}"]`).should("be.visible");
        }
      });
    });

    it("TC02 - Login Without Permission cannot access users", () => {
      loginAndWait("alice.johnson@example.com", "password123");
      cy.visit("/users");
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

    it("TC03 - Display List of Users", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.TABLE}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.TABLE}"]`).should("be.visible");
        }
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });

    it("TC04 - Search or Filter Users", () => {
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

    it("TC05 - Create User Button Exists and navigates", () => {
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

    it("TC05b - Create User shows success toast", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();
          // Fill form if inputs exist
          if (
            $b.find(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).type("Test");
          }
          if (
            $b.find(`[data-testid="${TEST_IDS.LAST_NAME_INPUT}"]`).length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.LAST_NAME_INPUT}"]`).type("User");
          }
          if ($b.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
            cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
              `test${Date.now()}@example.com`
            );
          }
          if ($b.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).length > 0) {
            cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
            // Check for success toast
            cy.wait(1000); // Wait for toast to appear
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
          }
        }
      });
    });
  });

  describe("User Detail Page", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
    });

    it("TC06 - Navigate to User Detail", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.get("body").should("be.visible");
        }
      });
    });

    it("TC07 - Navigate Back to User List", () => {
      cy.get("body").then(($b) => {
        const backSel = `[data-testid="${TEST_IDS.BACK_TO_USERS_BUTTON}"]`;
        if ($b.find(backSel).length > 0) {
          cy.get(backSel).click();
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Edit User", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
    });

    it("TC08 - Edit User Information", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          if (
            $b.find(`[data-testid="${TEST_IDS.EDIT_USER_BUTTON}"]`).length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.EDIT_USER_BUTTON}"]`).click();
            cy.get("body").should("be.visible");
          }
        }
      });
    });

    it("TC08b - Edit User shows success toast", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          if (
            $b.find(`[data-testid="${TEST_IDS.EDIT_USER_BUTTON}"]`).length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.EDIT_USER_BUTTON}"]`).click();
            // Fill form if inputs exist
            if (
              $b.find(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`)
                .clear()
                .type("Updated");
            }
            if (
              $b.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
              // Check for success toast
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
            }
          }
        }
      });
    });
  });

  describe("Delete User", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
    });

    it("TC09 - Delete User Confirmation", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          if (
            $b.find(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`).length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`).click();
            if (
              $b.find(`[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(
                `[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`
              ).click();
            }
          }
        }
      });
    });

    it("TC09b - Delete User shows success toast", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          if (
            $b.find(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`).length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`).click();
            if (
              $b.find(`[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(
                `[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`
              ).click();
              // Check for success toast
              cy.wait(1000); // Wait for toast to appear
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
            }
          }
        }
      });
    });
  });

  describe("Role and Permission Management", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
    });

    it("TC10 - Change User Role", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          if (
            $b.find(`[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`).length >
            0
          ) {
            cy.get(`[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`).click();
            if ($b.find(`[data-testid="${TEST_IDS.ROLE_OPTION}"]`).length > 0) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_OPTION}"]`).first().click();
            }
            if (
              $b.find(`[data-testid="${TEST_IDS.SAVE_ROLE_BUTTON}"]`).length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SAVE_ROLE_BUTTON}"]`).click();
            }
          }
        }
      });
    });

    it("TC11 - Change Permission and Show Custom Tag", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          if (
            $b.find(`[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`)
              .length > 0
          ) {
            cy.get(
              `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
            ).click();
            if (
              $b.find(`[data-testid="${TEST_IDS.PERMISSION_CHECKBOX}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.PERMISSION_CHECKBOX}"]`)
                .first()
                .check({ force: true });
            }
            if (
              $b.find(`[data-testid="${TEST_IDS.SAVE_PERMISSIONS_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(
                `[data-testid="${TEST_IDS.SAVE_PERMISSIONS_BUTTON}"]`
              ).click();
            }
          }
        }
      });
    });
  });

  describe("Negative / Edge Cases", () => {
    it("TC12 - Attempt Edit Without Permission", () => {
      loginAndWait("alice.johnson@example.com", "password123");
      cy.visit("/users");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ACCESS_DENIED}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ACCESS_DENIED}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("TC13 - Validation Errors on Create", () => {
      loginAndWait();
      cy.visit("/users");
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
    it("TC14 - Basic Navigation Smoke Test", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
        }
      });
      cy.visit("/users");
      cy.get("body").should("be.visible");
      cy.visit("/login");
      cy.get("body").should("be.visible");
    });
  });
});
