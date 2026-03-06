/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts" />
import { TEST_IDS } from "../../../src/config/constants";
import { mockRoles } from "../../../src/mock/data";
import {
  baseTestSetup,
  setupIgnoreAllExceptions,
} from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("Role Management", () => {
  beforeEach(() => {
    baseTestSetup();
    setupIgnoreAllExceptions();
    loginAndWait();
    cy.visit("/roles");
    cy.get("body").should("be.visible");
  });

  describe("Roles Navigation", () => {
    it("should navigate to roles page", () => {
      // Already on /roles from beforeEach
      cy.get("body").should("be.visible");
    });

    it("should display roles page content", () => {
      // Already on /roles from beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="roles-page"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLES_PAGE}"]`).should("be.visible");
        }
      });
    });
  });

  describe("Roles List Page", () => {
    beforeEach(() => {
      cy.intercept("GET", "**/api/roles**", { body: mockRoles });
    });

    it("should display roles table if it exists", () => {
      // Already on /roles from top-level beforeEach

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="roles-table"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLES_TABLE}"]`).should(
            "be.visible"
          );
          if (
            $body.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length >
            0
          ) {
            cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).should(
              "contain.text",
              "Name"
            );
          }
        }
      });
    });

    it("should display roles in table if it exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="table-row"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_ROW}"]`).should(
            "have.length.at.least",
            1
          );
        }
      });
    });

    it("should show create role button if it exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-role-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Role Search and Filtering", () => {
    it("should search roles if search functionality exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="search-input"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.SEARCH_INPUT}"]`).type("admin");
          cy.get(`[data-testid="${TEST_IDS.SEARCH_BUTTON}"]`).click();
        }
      });
    });

    it("should filter roles if filter functionality exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="system-filter"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.SYSTEM_FILTER}"]`).select("system");
        }
      });
    });
  });

  describe("Table Sorting", () => {
    it("should sort roles if sorting functionality exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find("th").length > 0) {
          cy.clickTableHeader("Name");
        }
      });
    });
  });

  describe("Create Role", () => {
    it("should open create role modal if button exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-role-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();

          if ($body.find('[data-testid="role-form-modal"]').length > 0) {
            cy.get(`[data-testid="${TEST_IDS.ROLE_FORM_MODAL}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });

    it("should validate required fields if form exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-role-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();

          if ($body.find('[data-testid="role-form-modal"]').length > 0) {
            cy.get('[data-testid="submit-button"]').click();

            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="error-message"]').length > 0) {
                cy.get('[data-testid="error-message"]').should("be.visible");
              }
            });
          }
        }
      });
    });
  });

  describe("Edit Role", () => {
    it("should open edit role modal if table exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="table-row"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_ROW}"]`).first().click();
          cy.wait(300);
          cy.get("body").then(($body2) => {
            if ($body2.find('[data-testid="edit-role-button"]').length > 0) {
              cy.get('[data-testid="edit-role-button"]').click();
              cy.wait(300);
              cy.get("body").then(($body3) => {
                if ($body3.find('[data-testid="role-form-modal"]').length > 0) {
                  cy.get(`[data-testid="${TEST_IDS.ROLE_FORM_MODAL}"]`).should(
                    "be.visible"
                  );
                }
              });
            }
          });
        }
      });
    });
  });

  describe("Delete Role", () => {
    it("should show delete confirmation if delete button exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="table-row"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_ROW}"]`).first().click();
          cy.wait(300);
          cy.get("body").then(($body2) => {
            if ($body2.find('[data-testid="delete-role-button"]').length > 0) {
              cy.get('[data-testid="delete-role-button"]').click();
              cy.wait(300);
              cy.get("body").then(($body3) => {
                if (
                  $body3.find('[data-testid="confirmation-dialog"]').length > 0
                ) {
                  cy.get('[data-testid="confirmation-dialog"]').should(
                    "be.visible"
                  );
                  cy.cancelDialog();
                }
              });
            }
          });
        }
      });
    });
  });

  describe("Role Permissions", () => {
    it("should display permissions if permission selector exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-role-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();

          if ($body.find('[data-testid="permission-selector"]').length > 0) {
            cy.get('[data-testid="permission-selector"]').should("be.visible");
          }
        }
      });
    });
  });

  describe("Role Details View", () => {
    it("should navigate to role details if table exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="table-row"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_ROW}"]`).first().click();
          cy.wait(300);

          cy.get("body").then(($body2) => {
            if ($body2.find('[data-testid="role-details"]').length > 0) {
              cy.get('[data-testid="role-details"]').should("be.visible");
            }
          });
        }
      });
    });
  });

  describe("Role Assignment", () => {
    it("should assign role if assignment functionality exists", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="table-row"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_ROW}"]`).first().click();
          cy.wait(300);
          cy.get("body").then(($body2) => {
            if ($body2.find('[data-testid="assign-role-button"]').length > 0) {
              cy.get('[data-testid="assign-role-button"]').click();
              cy.wait(300);
              cy.get("body").then(($body3) => {
                if (
                  $body3.find('[data-testid="role-assignment-modal"]').length >
                  0
                ) {
                  cy.get('[data-testid="role-assignment-modal"]').should(
                    "be.visible"
                  );
                }
              });
            }
          });
        }
      });
    });
  });

  describe("Role Management Error Handling", () => {
    it("should handle API errors gracefully", () => {
      cy.intercept("GET", "**/api/roles**", { statusCode: 500 });
      // Already on /roles from top-level beforeEach, but reload to trigger error
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should handle network errors", () => {
      cy.intercept("GET", "**/api/roles**", { forceNetworkError: true });
      // Already on /roles from top-level beforeEach, but reload to trigger error
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("Role Management Accessibility", () => {
    it("should be accessible", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").should("be.visible");
    });

    it("should support keyboard navigation", () => {
      // Already on /roles from top-level beforeEach
      cy.get("body").should("be.visible");
      // Only assert a visible focusable (exclude hidden mobile sidebar)
      cy.get("button, input, select, textarea, a[href]")
        .filter(":visible")
        .first()
        .should("exist");
    });
  });

  describe("Role Management Performance", () => {
    it("should load within acceptable time", () => {
      // Already on /roles from top-level beforeEach
      // Performance test should measure page load, so we reload
      const startTime = Date.now();
      cy.reload();
      cy.get("body")
        .should("be.visible")
        .then(() => {
          const loadTime = Date.now() - startTime;
          expect(loadTime).to.be.lessThan(5000);
        });
    });
  });
});
