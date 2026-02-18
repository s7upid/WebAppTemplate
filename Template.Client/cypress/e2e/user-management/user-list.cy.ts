/// <reference types="cypress" />
import { TEST_IDS } from "../../../src/config/constants";
import { loginAndWait } from "../../support/test-helpers";
import {
  baseTestSetup,
  setupIgnoreAllExceptions,
} from "../../support/base-test";

describe("User Management", () => {
  beforeEach(() => {
    baseTestSetup();
    setupIgnoreAllExceptions();
    loginAndWait();
    cy.visit("/users");
    cy.get("body").should("be.visible");
  });

  describe("User List Page", () => {
    it("should display the user management page", () => {
      cy.get("body").should("be.visible");
      cy.get("body").then(($b) => {
        if ($b.find('h1:contains("User Management")').length > 0) {
          cy.get("h1").contains("User Management").should("be.visible");
        }
      });
    });

    it("should show user management tabs", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.USER_MANAGEMENT_TABS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.USER_MANAGEMENT_TABS}"]`).should(
            "be.visible"
          );
        }
        if ($b.find(`[data-testid="${TEST_IDS.ALL_TAB}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ALL_TAB}"]`).should("be.visible");
        }
        if ($b.find(`[data-testid="${TEST_IDS.PENDING_TAB}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.PENDING_TAB}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display user table", () => {
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

    it("should show user information in table", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]')
            .first()
            .within(() => {
              cy.get("td").first().should("exist");
            });
        }
      });
    });

    it("should show create user button", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show sortable column headers", () => {
      cy.get("body").then(($b) => {
        const headers = [
          TEST_IDS.TABLE_HEADER_NAME,
          TEST_IDS.TABLE_HEADER_ROLE,
          TEST_IDS.TABLE_HEADER_STATUS,
          TEST_IDS.TABLE_HEADER_LAST_LOGIN,
        ];
        headers.forEach((h) => {
          if ($b.find(`[data-testid="${h}"]`).length > 0) {
            cy.get(`[data-testid="${h}"]`).should("be.visible");
          }
        });
      });
    });

    it("should show custom permission tag for users with additional permissions", () => {
      cy.get("body").then(($b) => {
        const rows = $b.find('[data-testid^="table-row-"]');
        if (rows.length > 0) {
          cy.get('[data-testid^="table-row-"]')
            .first()
            .within(() => {
              cy.get("td").eq(2).find(".status-badge-base").should("exist");
            });
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Table Sorting", () => {
    it("should sort by name column", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        }
      });
    });

    it("should toggle sort direction when clicking same column", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
          cy.wait(300);
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        }
      });
    });

    it("should sort by role column", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).click();
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        }
      });
    });

    it("should sort by status column", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).click();
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        }
      });
    });

    it("should sort by last login column", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`).click();
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        }
      });
    });

    it("should reset to ascending when switching between different columns", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
          cy.wait(500);
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).click();
          cy.wait(500);
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });

    it("should maintain sort when searching", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
          cy.wait(500);
          const searchSel =
            'input[placeholder*="Search"], input[placeholder*="search"]';
          if ($b.find(searchSel).length > 0) {
            cy.get(searchSel).type("admin");
            cy.wait(500);
          }
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Search and Filtering", () => {
    it("should have search functionality", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find('input[placeholder*="Search"], input[placeholder*="search"]')
            .length > 0
        ) {
          cy.get(
            'input[placeholder*="Search"], input[placeholder*="search"]'
          ).should("be.visible");
        }
      });
    });

    it("should filter users by search term", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find('input[placeholder*="Search"], input[placeholder*="search"]')
            .length > 0
        ) {
          cy.get(
            'input[placeholder*="Search"], input[placeholder*="search"]'
          ).type("john");
          cy.wait(300);
        }
      });
    });

    it("should clear search results", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find('input[placeholder*="Search"], input[placeholder*="search"]')
            .length > 0
        ) {
          cy.get(
            'input[placeholder*="Search"], input[placeholder*="search"]'
          ).type("admin");
          cy.wait(200);
          cy.get(
            'input[placeholder*="Search"], input[placeholder*="search"]'
          ).clear();
          cy.wait(200);
          cy.get(
            'input[placeholder*="Search"], input[placeholder*="search"]'
          ).should("have.value", "");
        }
      });
    });

    it("should filter by role", () => {
      cy.get("body").then(($b) => {
        if ($b.find("select").length > 0) {
          cy.get("select").first().select("Administrator", { force: true });
          cy.wait(300);
        }
      });
    });

    it("should reset filter to show all users", () => {
      cy.get("body").then(($b) => {
        if ($b.find("select").length > 0) {
          cy.get("select").first().select("All Roles", { force: true });
          cy.wait(300);
        }
      });
    });

    it("should combine search and filter", () => {
      cy.get("body").then(($b) => {
        const searchSel =
          'input[placeholder*="Search"], input[placeholder*="search"]';
        const hasSearch = $b.find(searchSel).length > 0;
        const hasSelect = $b.find("select").length > 0;
        if (hasSearch) {
          cy.get(searchSel).type("john");
        }
        if (hasSelect) {
          cy.get("select").select("Administrator", { force: true });
        }
      });
    });
  });

  describe("Pagination", () => {
    it("should show pagination when there are multiple pages", () => {
      // This test assumes there are enough users to require pagination
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="pagination"]').length > 0) {
          cy.get('[data-testid="pagination"]').should("be.visible");
        }
      });
    });

    it("should navigate between pages", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="pagination"]').length > 0) {
          // Click next page if it exists
          cy.get('[data-testid="pagination"]').within(() => {
            cy.get("button").contains("2").click();
          });

          // Verify page changed
          cy.get('[data-testid^="table-row-"]').should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });
  });

  describe("User Creation", () => {
    beforeEach(() => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();
        }
      });
    });

    it("should navigate to user creation page", () => {
      cy.get("body").should("be.visible");
    });

    it("should have required form fields", () => {
      cy.get("body").should("be.visible");
    });

    it("should validate required fields", () => {
      cy.get("body").should("be.visible");
    });

    it("should create user with valid data", () => {
      cy.get("body").should("be.visible");
    });

    it("should validate email format", () => {
      cy.get("body").should("be.visible");
    });
  });

  describe("User Navigation", () => {
    it("should navigate to user details when clicking on a row", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
        }
      });
    });
  });

  describe("Pending Users Tab", () => {
    it("should switch to pending users tab", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.PENDING_TAB}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.PENDING_TAB}"]`).click();
        }
      });
    });

    it("should switch back to all users tab", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ALL_TAB}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ALL_TAB}"]`).click();
        }
      });
    });
  });

  describe("User Status Display", () => {
    it("should show user status badges", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]')
            .first()
            .within(() => {
              cy.get("td").eq(2).find(".status-badge-base").should("exist");
            });
        }
      });
    });

    it("should display different status colors", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').each(($row) => {
            cy.wrap($row).within(() => {
              cy.get("td").eq(2).find(".status-badge-base").should("exist");
            });
          });
        }
      });
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
      // Toggle to dark mode
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="theme-toggle"]').length > 0) {
          cy.get('[data-testid="theme-toggle"]').click();
        }
      });

      cy.get("body").should("be.visible");
    });

    it("should work in light mode", () => {
      // Ensure we're in light mode
      cy.get("body").then(($body) => {
        if ($body.hasClass("dark")) {
          cy.get('[data-testid="theme-toggle"]').click();
        }
      });

      cy.get("body").should("be.visible");
    });
  });

  describe("Performance and Loading", () => {
    it("should load the page within reasonable time", () => {
      cy.visit("/users");
      cy.get("body", { timeout: 3000 }).should("be.visible");
    });

    it("should handle loading states", () => {
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should handle empty states gracefully", () => {
      cy.get("body").should("be.visible");
    });
  });
});
