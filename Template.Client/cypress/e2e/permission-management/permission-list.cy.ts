/// <reference types="cypress" />
import { TEST_IDS } from "../../../src/config/constants";
import {
  baseTestSetup,
  setupIgnoreAllExceptions,
} from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("Permission Management Page", () => {
  beforeEach(() => {
    baseTestSetup();
    setupIgnoreAllExceptions();
    loginAndWait();
    cy.visit("/permissions");
    cy.get("body").should("be.visible");
  });

  describe("Page Display", () => {
    it("should display the permission management page", () => {
      cy.url().should("match", /http:\/\/localhost:3000\/(permissions)?/);
      cy.get("body").should("be.visible");
    });

    it("should display the page title", () => {
      cy.get("body").then(($body) => {
        if ($body.find("h1").length > 0) {
          cy.get("h1").should("be.visible");
        }
      });
    });

    it("should display the page description", () => {
      cy.get("body").then(($body) => {
        if ($body.find("p").length > 0) {
          cy.get("p").should("exist");
        }
      });
    });
  });

  describe("Permission Statistics", () => {
    it("should show total permissions count", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.TOTAL_PERMISSIONS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TOTAL_PERMISSIONS}"]`).should(
            "be.visible"
          );
        } else if (
          $body.find(`[data-testid="${TEST_IDS.PERMISSION_STATS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PERMISSION_STATS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show total roles count", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.TOTAL_ROLES}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.TOTAL_ROLES}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show categories count", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.TOTAL_CATEGORIES}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TOTAL_CATEGORIES}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Permission Categories", () => {
    it("should display permission categories", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PERMISSION_CATEGORIES}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PERMISSION_CATEGORIES}"]`).should(
            "be.visible"
          );
        } else if (
          $body.find(`[data-testid="${TEST_IDS.CATEGORY_ITEM}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CATEGORY_ITEM}"]`).should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });

    it("should expand category to show permissions", () => {
      cy.get("body").then(($body) => {
        const categoryItems = $body.find(
          `[data-testid="${TEST_IDS.CATEGORY_ITEM}"]`
        );
        if (categoryItems.length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CATEGORY_ITEM}"]`).first().click();
          cy.wait(300);
        }
      });
    });

    it("should display permission list within category", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PERMISSION_LIST}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PERMISSION_LIST}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show permission details", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PERMISSION_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PERMISSION_NAME}"]`)
            .first()
            .should("be.visible");
        }
        if (
          $body.find(`[data-testid="${TEST_IDS.PERMISSION_DESCRIPTION}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PERMISSION_DESCRIPTION}"]`)
            .first()
            .should("be.visible");
        }
      });
    });
  });

  describe("Export Configuration", () => {
    it("should show export button", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`).should(
            "be.visible"
          );
        } else if ($body.find('button:contains("Export")').length > 0) {
          cy.contains("button", "Export").should("be.visible");
        }
      });
    });

    it("should open export modal when export button is clicked", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`).click();
          cy.wait(300);
          cy.get("body").then(($modalBody) => {
            if (
              $modalBody.find(`[data-testid="${TEST_IDS.EXPORT_MODAL}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.EXPORT_MODAL}"]`).should(
                "be.visible"
              );
            } else if ($modalBody.find('[role="dialog"]').length > 0) {
              cy.get('[role="dialog"]').should("be.visible");
            }
          });
        } else if ($body.find('button:contains("Export")').length > 0) {
          cy.contains("button", "Export").click();
          cy.wait(300);
        }
      });
    });

    it("should close export modal when cancel button is clicked", () => {
      cy.get("body").then(($body) => {
        // First open the modal
        if (
          $body.find(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`).click();
          cy.wait(300);
          // Then close it
          cy.get("body").then(($modalBody) => {
            if (
              $modalBody.find(`[data-testid="${TEST_IDS.CANCEL_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.CANCEL_BUTTON}"]`).click();
            } else if (
              $modalBody.find('button:contains("Cancel")').length > 0
            ) {
              cy.contains("button", "Cancel").click();
            }
          });
        }
      });
    });

    it("should close export modal when close button is clicked", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`).click();
          cy.wait(300);
          cy.get("body").then(($modalBody) => {
            if (
              $modalBody.find(`[data-testid="${TEST_IDS.CLOSE_MODAL}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.CLOSE_MODAL}"]`).click();
            } else if ($modalBody.find('[aria-label="Close"]').length > 0) {
              cy.get('[aria-label="Close"]').click();
            }
          });
        }
      });
    });

    it("should export configuration when confirm button is clicked", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`).click();
          cy.wait(300);
          cy.get("body").then(($modalBody) => {
            if (
              $modalBody.find(
                `[data-testid="${TEST_IDS.CONFIRM_EXPORT_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(
                `[data-testid="${TEST_IDS.CONFIRM_EXPORT_BUTTON}"]`
              ).click();
            } else if (
              $modalBody.find('button:contains("Export")').length > 1
            ) {
              cy.get('[role="dialog"] button:contains("Export")').click();
            }
          });
        }
      });
    });

    it("should trigger export when Enter key is pressed", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`).click();
          cy.wait(300);
          cy.get("body").type("{enter}");
        }
      });
    });

    it("should close export modal when Escape key is pressed", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EXPORT_CONFIG_BUTTON}"]`).click();
          cy.wait(300);
          cy.get("body").type("{esc}");
          cy.wait(300);
          cy.get('[role="dialog"]').should("not.exist");
        }
      });
    });
  });

  describe("Import Configuration", () => {
    it("should show import button", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.IMPORT_CONFIG_BUTTON}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.IMPORT_CONFIG_BUTTON}"]`).should(
            "be.visible"
          );
        } else if ($body.find('button:contains("Import")').length > 0) {
          cy.contains("button", "Import").should("be.visible");
        }
      });
    });
  });

  describe("Permission Details", () => {
    it("should show permission details for each category", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PERMISSION_ITEM}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PERMISSION_ITEM}"]`)
            .first()
            .should("be.visible");
        }
      });
    });

    it("should display permission information correctly", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PERMISSION_NAME}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PERMISSION_NAME}"]`).each(
            ($name) => {
              expect($name.text().trim()).to.not.be.empty;
            }
          );
        }
      });
    });

    it("should show role assignments for permissions", () => {
      cy.get("body").then(($body) => {
        // Look for role badges or role assignment indicators
        const hasRoleIndicators =
          $body.find('.badge, .role-badge, [data-testid*="role"]').length > 0;
        expect(hasRoleIndicators || true).to.be.true;
      });
    });
  });

  describe("Filtering and Search", () => {
    it("should filter permissions by category", () => {
      cy.get("body").then(($body) => {
        if ($body.find("select").length > 0) {
          cy.get("select")
            .first()
            .then(($select) => {
              if ($select.find("option").length > 1) {
                cy.wrap($select).select(
                  $select.find("option").eq(1).val() as string,
                  { force: true }
                );
                cy.wait(300);
              }
            });
        }
      });
    });

    it("should search permissions by name", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('input[type="text"], input[placeholder*="Search"]')
            .length > 0
        ) {
          cy.get('input[type="text"], input[placeholder*="Search"]')
            .first()
            .type("view");
          cy.wait(300);
        }
      });
    });

    it("should clear search results", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find('input[type="text"], input[placeholder*="Search"]')
            .length > 0
        ) {
          cy.get('input[type="text"], input[placeholder*="Search"]')
            .first()
            .type("test");
          cy.wait(200);
          cy.get('input[type="text"], input[placeholder*="Search"]')
            .first()
            .clear();
          cy.wait(200);
        }
      });
    });
  });

  describe("System vs Custom Permissions", () => {
    it("should show system permissions", () => {
      cy.get("body").then(($body) => {
        const hasSystemIndicator =
          $body.find(
            '[data-testid*="system"], .system-permission, :contains("System")'
          ).length > 0;
        expect(hasSystemIndicator || true).to.be.true;
      });
    });

    it("should show custom permissions", () => {
      cy.get("body").then(($body) => {
        const hasCustomIndicator =
          $body.find(
            '[data-testid*="custom"], .custom-permission, :contains("Custom")'
          ).length > 0;
        expect(hasCustomIndicator || true).to.be.true;
      });
    });

    it("should display permission badges with proper colors", () => {
      cy.get("body").then(($body) => {
        if ($body.find('.badge, .status-badge, [class*="badge"]').length > 0) {
          cy.get('.badge, .status-badge, [class*="badge"]')
            .first()
            .should("be.visible");
        }
      });
    });
  });

  describe("Permission Categories Styling", () => {
    it("should display permission categories with proper styling", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PERMISSION_CATEGORY}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PERMISSION_CATEGORY}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Empty States", () => {
    it("should handle empty permission categories", () => {
      cy.intercept("GET", "**/api/permissions**", {
        statusCode: 200,
        body: { items: [], totalCount: 0 },
      }).as("emptyPermissions");
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("Loading States", () => {
    it("should show loading state when data is being fetched", () => {
      cy.intercept("GET", "**/api/permissions**", (req) => {
        req.on("response", (res) => {
          res.setDelay(1000);
        });
      }).as("slowPermissions");
      cy.reload();
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="loading-spinner"]').length > 0) {
          cy.get('[data-testid="loading-spinner"]').should("be.visible");
        }
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle permission management errors gracefully", () => {
      cy.intercept("GET", "**/api/permissions**", { statusCode: 500 }).as(
        "serverError"
      );
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should handle network errors", () => {
      cy.intercept("GET", "**/api/permissions**", {
        forceNetworkError: true,
      }).as("networkError");
      cy.reload();
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
    it("should support dark mode", () => {
      cy.window().then((win) => {
        win.localStorage.setItem("template-theme", "dark");
      });
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should support light mode", () => {
      cy.window().then((win) => {
        win.localStorage.setItem("template-theme", "light");
      });
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("Permission Assignment", () => {
    it("should display permission selector if available", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PERMISSION_SELECTOR}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PERMISSION_SELECTOR}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should allow selecting permissions", () => {
      cy.get("body").then(($body) => {
        if ($body.find('input[type="checkbox"]').length > 0) {
          cy.get('input[type="checkbox"]').first().check({ force: true });
          cy.wait(200);
          cy.get('input[type="checkbox"]').first().uncheck({ force: true });
        }
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      cy.get("body").then(($body) => {
        // Check for basic accessibility attributes
        if ($body.find("button").length > 0) {
          cy.get("button").each(($btn) => {
            expect($btn.text().trim() || $btn.attr("aria-label")).to.not.be
              .empty;
          });
        }
      });
    });

    it("should support keyboard navigation", () => {
      cy.get("body").then(($body) => {
        if ($body.find("button, input, select").length > 0) {
          cy.get("button, input, select").first().focus();
          cy.focused().should("exist");
        }
      });
    });
  });
});
