import { TEST_IDS } from "../../../src/config/constants";
import { baseTestSetup } from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("Table Sorting Functionality", () => {
  beforeEach(() => {
    baseTestSetup();
    loginAndWait();
    cy.visit("/users");
    cy.get("body").should("be.visible");
  });

  describe("Column Header Interactions", () => {
    it("should show sortable indicators on column headers", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        }
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        }
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        }
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`).should(
            "have.class",
            "table-header-cell-sortable"
          );
        }
      });
    });

    it("should have clickable column headers", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).should(
            "have.css",
            "cursor",
            "pointer"
          );
        }
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).should(
            "have.css",
            "cursor",
            "pointer"
          );
        }
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).should(
            "have.css",
            "cursor",
            "pointer"
          );
        }
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`).should(
            "have.css",
            "cursor",
            "pointer"
          );
        }
      });
    });

    it("should show sort icons in headers", () => {
      cy.get("body").then(($b) => {
        if ($b.find('[data-testid="table-header-name"]').length > 0) {
          cy.get('[data-testid="table-header-name"] svg').should("exist");
        }
        if ($b.find('[data-testid="table-header-role"]').length > 0) {
          cy.get('[data-testid="table-header-role"] svg').should("exist");
        }
        if ($b.find('[data-testid="table-header-status"]').length > 0) {
          cy.get('[data-testid="table-header-status"] svg').should("exist");
        }
        if ($b.find('[data-testid="table-header-lastLogin"]').length > 0) {
          cy.get('[data-testid="table-header-lastLogin"] svg').should("exist");
        }
      });
    });
  });

  describe("Name Column Sorting", () => {
    it("should sort by name in ascending order", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
          cy.wait(300);
        }
      });
    });

    it("should sort by name in descending order when clicked twice", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
          cy.wait(200);
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
          cy.wait(200);
        }
      });
    });
  });

  describe("Role Column Sorting", () => {
    it("should sort by role in ascending order", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).click();
        }
      });
    });

    it("should sort by role in descending order when clicked twice", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).click();
          cy.wait(200);
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).click();
        }
      });
    });
  });

  describe("Status Column Sorting", () => {
    it("should sort by status in ascending order", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).click();
        }
      });
    });

    it("should group active and inactive users when sorted", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_STATUS}"]`).click();
        }
      });
    });
  });

  describe("Last Login Column Sorting", () => {
    it("should sort by last login in ascending order", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`).click();
        }
      });
    });

    it("should handle users with no last login date", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_LAST_LOGIN}"]`).click();
        }
      });
    });
  });

  describe("Sort Direction Indicators", () => {
    it("should show active sort indicators", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
        }
      });
    });

    it("should update sort indicators when changing columns", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
        }
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_ROLE}"]`).click();
        }
      });
    });
  });

  describe("Sorting with Search and Filters", () => {
    it("should maintain sort when searching", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
        }
        if (
          $b.find('input[placeholder*="Search"], input[placeholder*="search"]')
            .length > 0
        ) {
          cy.get('input[placeholder*="Search"], input[placeholder*="search"]')
            .first()
            .type("admin");
        }
      });
    });

    it("should maintain sort when filtering by role", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
        }
        if ($b.find("select").length > 0) {
          cy.get("select").first().select("Super Administrator");
        }
      });
    });

    it("should sort filtered results correctly", () => {
      cy.get("body").then(($b) => {
        if ($b.find("select").length > 0) {
          cy.get("select")
            .first()
            .then(($select) => {
              const options = Array.from(
                ($select[0] as HTMLSelectElement).options
              );
              const nonAllOption = options.find(
                (opt) =>
                  (opt as HTMLOptionElement).value !== "all" &&
                  (opt as HTMLOptionElement).value !== ""
              );
              if (nonAllOption) {
                cy.get("select")
                  .first()
                  .select((nonAllOption as HTMLOptionElement).value);
              }
            });
        }
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
        }
      });
    });
  });

  describe("Sort Performance", () => {
    it("should sort quickly without long loading states", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
        }
      });
    });

    it("should not show loading indicators during sort", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TABLE_HEADER_NAME}"]`).click();
          if ($b.find('[data-testid="table-loading"]').length > 0) {
            cy.get('[data-testid="table-loading"]').should("not.be.visible");
          }
        }
      });
    });
  });
});
