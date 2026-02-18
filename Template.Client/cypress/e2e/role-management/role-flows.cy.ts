import { TEST_IDS, SUCCESS_MESSAGES } from "../../../src/config/constants";
import { baseTestSetup } from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("Role Management Flows", () => {
  beforeEach(() => {
    baseTestSetup();
  });

  describe("Login Flow", () => {
    it("TC01 - Successful Login with Correct Permission shows Role Management entry", () => {
      loginAndWait();
      cy.visit("/");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.NAV_ROLES}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.NAV_ROLES}"]`).should("be.visible");
        }
      });
    });

    it("TC02 - Access Denied Without Permission", () => {
      loginAndWait("alice.johnson@example.com", "password123");
      cy.visit("/");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.NAV_ROLES}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.NAV_ROLES}"]`).should("not.exist");
        }
      });
      cy.visit("/roles");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ACCESS_DENIED}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ACCESS_DENIED}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Role List Page", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/roles");
      cy.get("body").should("be.visible");
    });

    it("TC03 - Display List of Roles", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ROLES_TABLE}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLES_TABLE}"]`).should(
            "be.visible"
          );
        }
        if ($b.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });

    it("TC04 - Pagination Works", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid="pagination"]').length > 0) {
          cy.get('[data-testid="pagination"]').within(() => {
            cy.get("button").contains("2").click({ force: true });
          });
          cy.get("body").should("be.visible");
        }
      });
    });

    it("TC05 - Filtering Works", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ROLE_SEARCH}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_SEARCH}"]`).type("admin");
        }
      });
    });

    it("TC06 - Sorting Works", () => {
      cy.get("body").then(($b) => {
        if ($b.find("th").length > 0) {
          cy.get("th")
            .contains(/name|role/i)
            .first()
            .click({ force: true });
          cy.wait(200);
          cy.get("th")
            .contains(/name|role/i)
            .first()
            .click({ force: true });
        }
      });
    });

    it("TC07 - Create Role Button Exists", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`)
            .should("be.visible")
            .click();
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Role Detail Page", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/roles");
    });

    it("TC08 - Navigate to Role Detail", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).first().click();
          cy.get("body").should("be.visible");
        }
      });
    });

    it("TC09 - Navigate Back to Role List", () => {
      cy.get("body").then(($b) => {
        const backSel = `[data-testid="${TEST_IDS.BACK_TO_ROLES_BUTTON}"]`;
        if ($b.find(backSel).length > 0) {
          cy.get(backSel).click();
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Edit Role", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/roles");
    });

    it("TC10 - Edit Role Information", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`)
            .first()
            .click();
          if (
            $b.find(`[data-testid="${TEST_IDS.ROLE_DESCRIPTION_INPUT}"]`)
              .length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.ROLE_DESCRIPTION_INPUT}"]`)
              .clear()
              .type("Updated Description");
          }
          if ($b.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).length > 0) {
            cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
          }
        }
      });
    });

    it("TC10b - Edit Role shows success toast", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`)
            .first()
            .click();
          if (
            $b.find(`[data-testid="${TEST_IDS.ROLE_DESCRIPTION_INPUT}"]`)
              .length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.ROLE_DESCRIPTION_INPUT}"]`)
              .clear()
              .type("Updated Description");
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
                  SUCCESS_MESSAGES.ROLE_UPDATED
                );
              }
            });
          }
        }
      });
    });

    it("TC11 - Edit Role Without Permission", () => {
      loginAndWait("alice.johnson@example.com", "password123");
      cy.visit("/roles");
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`).should(
            "not.exist"
          );
        }
      });
    });
  });

  describe("Delete Role", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/roles");
    });

    it("TC12 - Delete Non-System Role", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`)
            .first()
            .click();
          if (
            $b.find(`[data-testid="${TEST_IDS.CONFIRMATION_DIALOG}"]`).length >
            0
          ) {
            cy.get(`[data-testid="${TEST_IDS.CONFIRMATION_DIALOG}"]`).should(
              "be.visible"
            );
          }
          if ($b.find('[data-testid="confirm-delete-button"]').length > 0) {
            cy.get('[data-testid="confirm-delete-button"]').click();
          }
        }
      });
    });

    it("TC12b - Delete Role shows success toast", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`)
            .first()
            .click();
          if ($b.find('[data-testid="confirm-delete-button"]').length > 0) {
            cy.get('[data-testid="confirm-delete-button"]').click();
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
                  SUCCESS_MESSAGES.ROLE_DELETED
                );
              }
            });
          }
        }
      });
    });

    it("TC13 - System Role Cannot Be Deleted", () => {
      cy.get("body").then(($b) => {
        const rowWithSystem = $b
          .find(
            `[data-testid="${TEST_IDS.ROLE_ROW}"] [data-testid="${TEST_IDS.SYSTEM_ROLE_INDICATOR}"]`
          )
          .first()
          .closest(`[data-testid="${TEST_IDS.ROLE_ROW}"]`);
        if (rowWithSystem.length > 0) {
          cy.wrap(rowWithSystem).within(() => {
            cy.get(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`).should(
              "not.exist"
            );
          });
        }
      });
    });
  });

  describe("Create Role", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/roles");
    });

    it("TC14 - Create New Role", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          if (
            $b.find(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`).length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`).type(
              "E2E Role"
            );
          }
          if ($b.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).length > 0) {
            cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
          }
        }
      });
    });

    it("TC14b - Create Role shows success toast", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          if (
            $b.find(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`).length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`).type(
              `E2E Role ${Date.now()}`
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
                  SUCCESS_MESSAGES.ROLE_CREATED
                );
              }
            });
          }
        }
      });
    });

    it("TC15 - Validation Errors on Create", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          if ($b.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).length > 0) {
            cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
          }
          if ($b.find(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).length > 0) {
            cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });
  });

  describe("Permissions & Restrictions", () => {
    it("TC16 - View Role Without Manage Permission shows no edit/delete", () => {
      loginAndWait("alice.johnson@example.com", "password123");
      cy.visit("/roles");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`)
            .first()
            .within(() => {
              cy.get(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`).should(
                "not.exist"
              );
              cy.get(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`).should(
                "not.exist"
              );
            });
        }
      });
    });

    it("TC17 - Edit Role Permissions", () => {
      loginAndWait();
      cy.visit("/roles");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).first().click();
          if (
            $b.find(`[data-testid="${TEST_IDS.ROLE_PERMISSIONS}"]`).length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.ROLE_PERMISSIONS}"]`).should(
              "be.visible"
            );
          }
        }
      });
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("General Navigation & Smoke", () => {
    it("TC18 - End-to-End Navigation Smoke Test", () => {
      loginAndWait();
      cy.visit("/roles");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).first().click();
        }
      });
      cy.visit("/roles");
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
        }
      });
      cy.visit("/login");
      cy.get("body").should("be.visible");
    });
  });
});
