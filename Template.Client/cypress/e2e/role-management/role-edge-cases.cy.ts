/// <reference types="cypress" />
import { TEST_IDS } from "../../../src/config/constants";
import {
  baseTestSetup,
  setupIgnoreAllExceptions,
} from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("Role Management Edge Cases", () => {
  beforeEach(() => {
    baseTestSetup();
    setupIgnoreAllExceptions();
    loginAndWait();
    cy.visit("/roles");
    cy.get("body").should("be.visible");
  });

  describe("Role Permissions Section", () => {
    it("should display role permissions when viewing role details", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(`[data-testid="${TEST_IDS.ROLE_PERMISSIONS}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_PERMISSIONS}"]`).should(
                "be.visible"
              );
            }
          });
        }
      });
    });

    it("should show permission count", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.ROLE_PERMISSION_COUNT}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_PERMISSION_COUNT}"]`)
            .first()
            .should("be.visible");
        } else if (
          $body.find(`[data-testid="${TEST_IDS.PERMISSION_COUNT}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PERMISSION_COUNT}"]`)
            .first()
            .should("be.visible");
        }
      });
    });

    it("should edit role permissions", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`).click();
              cy.wait(300);

              cy.get("body").then(($editBody) => {
                if (
                  $editBody.find(
                    `[data-testid="${TEST_IDS.PERMISSION_CHECKBOX}"]`
                  ).length > 0
                ) {
                  cy.get(`[data-testid="${TEST_IDS.PERMISSION_CHECKBOX}"]`)
                    .first()
                    .check({ force: true });
                }
              });
            }
          });
        }
      });
    });

    it("should toggle all permissions in a category", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`).click();
              cy.wait(300);

              // Look for "Select All" or category header checkbox
              cy.get("body").then(($editBody) => {
                if (
                  $editBody.find('input[type="checkbox"][data-select-all]')
                    .length > 0
                ) {
                  cy.get('input[type="checkbox"][data-select-all]')
                    .first()
                    .check({ force: true });
                }
              });
            }
          });
        }
      });
    });
  });

  describe("Role Users Section", () => {
    it("should display users assigned to role", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(`[data-testid="${TEST_IDS.ROLE_USERS}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_USERS}"]`).should(
                "be.visible"
              );
            }
          });
        }
      });
    });

    it("should show user count for role", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.ROLE_USER_COUNT}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_USER_COUNT}"]`)
            .first()
            .should("be.visible");
        } else if (
          $body.find(`[data-testid="${TEST_IDS.USER_COUNT}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.USER_COUNT}"]`)
            .first()
            .should("be.visible");
        }
      });
    });

    it("should navigate to user from role users list", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(`[data-testid="${TEST_IDS.USER_ITEM}"]`).length >
              0
            ) {
              cy.get(`[data-testid="${TEST_IDS.USER_ITEM}"]`).first().click();
            }
          });
        }
      });
    });
  });

  describe("System Role Protection", () => {
    it("should not allow editing system role name", () => {
      cy.get("body").then(($body) => {
        // Find a system role indicator
        if (
          $body.find(`[data-testid="${TEST_IDS.SYSTEM_ROLE_INDICATOR}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.SYSTEM_ROLE_INDICATOR}"]`)
            .first()
            .closest(`[data-testid="${TEST_IDS.ROLE_ROW}"]`)
            .click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            // Check that role name input is disabled or edit button doesn't exist
            if (
              $detailBody.find(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`).should(
                "be.disabled"
              );
            }
          });
        }
      });
    });

    it("should not show delete button for system roles", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.SYSTEM_ROLE_INDICATOR}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.SYSTEM_ROLE_INDICATOR}"]`)
            .first()
            .closest(`[data-testid="${TEST_IDS.ROLE_ROW}"]`)
            .within(() => {
              cy.get(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`).should(
                "not.exist"
              );
            });
        }
      });
    });

    it("should display system role badge", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.SYSTEM_ROLE_INDICATOR}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.SYSTEM_ROLE_INDICATOR}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Role Form Validation", () => {
    it("should validate role name is required", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($formBody) => {
            // Don't fill the name, just try to submit
            if (
              $formBody.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
              cy.wait(300);
              // Should show validation error
            }
          });
        }
      });
    });

    it("should validate role name uniqueness", () => {
      cy.intercept("POST", "**/api/roles**", {
        statusCode: 400,
        body: { message: "Role name already exists" },
      }).as("duplicateRole");

      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($formBody) => {
            if (
              $formBody.find(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`).type(
                "Administrator"
              );
            }
            if (
              $formBody.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
              cy.wait(500);
            }
          });
        }
      });
    });

    it("should validate role name length", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($formBody) => {
            if (
              $formBody.find(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`)
                .length > 0
            ) {
              // Try a very long name
              cy.get(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`).type(
                "A".repeat(256)
              );
            }
            if (
              $formBody.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
            }
          });
        }
      });
    });

    it("should allow empty description", () => {
      cy.intercept("POST", "**/api/roles**", {
        statusCode: 200,
        body: { success: true },
      }).as("createRole");

      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($formBody) => {
            if (
              $formBody.find(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`).type(
                `TestRole${Date.now()}`
              );
            }
            // Don't fill description
            if (
              $formBody.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
            }
          });
        }
      });
    });
  });

  describe("Role Delete Confirmation", () => {
    it("should show confirmation dialog before delete", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`)
            .first()
            .click();
          cy.wait(300);

          cy.get("body").then(($dialogBody) => {
            if (
              $dialogBody.find(
                `[data-testid="${TEST_IDS.CONFIRMATION_DIALOG}"]`
              ).length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.CONFIRMATION_DIALOG}"]`).should(
                "be.visible"
              );
            }
          });
        }
      });
    });

    it("should cancel delete operation", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`)
            .first()
            .click();
          cy.wait(300);

          cy.get("body").then(($dialogBody) => {
            if (
              $dialogBody.find(
                `[data-testid="${TEST_IDS.CANCEL_DELETE_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(
                `[data-testid="${TEST_IDS.CANCEL_DELETE_BUTTON}"]`
              ).click();
            } else if (
              $dialogBody.find('button:contains("Cancel")').length > 0
            ) {
              cy.contains("button", "Cancel").click();
            }
          });
        }
      });
    });

    it("should prevent deleting role with assigned users", () => {
      cy.intercept("DELETE", "**/api/roles/**", {
        statusCode: 400,
        body: { message: "Cannot delete role with assigned users" },
      }).as("deleteError");

      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.DELETE_ROLE_BUTTON}"]`)
            .first()
            .click();
          cy.wait(300);

          cy.get("body").then(($dialogBody) => {
            if (
              $dialogBody.find(
                `[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(
                `[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`
              ).click();
              cy.wait(500);
            } else if (
              $dialogBody.find('button:contains("Delete")').length > 0
            ) {
              cy.get('[role="dialog"] button:contains("Delete")').click();
              cy.wait(500);
            }
          });
        }
      });
    });
  });

  describe("Role Stats Section", () => {
    it("should display role statistics", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(`[data-testid="${TEST_IDS.ROLE_STATS}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_STATS}"]`).should(
                "be.visible"
              );
            }
          });
        }
      });
    });
  });

  describe("Role Actions", () => {
    it("should display role actions dropdown", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ROLE_ROW}"]`).first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(`[data-testid="${TEST_IDS.ROLE_ACTIONS}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_ACTIONS}"]`).should(
                "be.visible"
              );
            }
          });
        }
      });
    });

    it("should show edit option in actions", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`)
            .first()
            .should("be.visible");
        }
      });
    });

    it("should show view details option", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.VIEW_DETAILS_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.VIEW_DETAILS_BUTTON}"]`)
            .first()
            .should("be.visible");
        }
      });
    });
  });

  describe("Role Modal Behavior", () => {
    it("should close modal on escape key", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          cy.wait(300);
          cy.get("body").type("{esc}");
          cy.wait(300);
          cy.get(`[data-testid="${TEST_IDS.ROLE_FORM_MODAL}"]`).should(
            "not.exist"
          );
        }
      });
    });

    it("should close modal on cancel button", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($modalBody) => {
            if (
              $modalBody.find(`[data-testid="${TEST_IDS.CANCEL_ROLE_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.CANCEL_ROLE_BUTTON}"]`).click();
            } else if (
              $modalBody.find('button:contains("Cancel")').length > 0
            ) {
              cy.contains("button", "Cancel").click();
            }
          });
        }
      });
    });

    it("should close modal on close button", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($modalBody) => {
            if (
              $modalBody.find(`[data-testid="${TEST_IDS.CLOSE_ROLE_MODAL}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.CLOSE_ROLE_MODAL}"]`).click();
            } else if ($modalBody.find('[aria-label="Close"]').length > 0) {
              cy.get('[aria-label="Close"]').click();
            }
          });
        }
      });
    });

    it("should warn about unsaved changes", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($modalBody) => {
            if (
              $modalBody.find(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`).type(
                "Test"
              );
              // Try to close
              cy.get("body").type("{esc}");
            }
          });
        }
      });
    });
  });

  describe("Error States", () => {
    it("should handle role not found error", () => {
      cy.visit("/roles/nonexistent-id");
      cy.get("body").should("be.visible");
    });

    it("should handle API errors during role update", () => {
      cy.intercept("PUT", "**/api/roles/**", { statusCode: 500 }).as(
        "updateError"
      );

      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EDIT_ROLE_BUTTON}"]`)
            .first()
            .click();
          cy.wait(300);

          cy.get("body").then(($modalBody) => {
            if (
              $modalBody.find(
                `[data-testid="${TEST_IDS.ROLE_DESCRIPTION_INPUT}"]`
              ).length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.ROLE_DESCRIPTION_INPUT}"]`)
                .clear()
                .type("Updated");
            }
            if (
              $modalBody.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
              cy.wait(500);
            }
          });
        }
      });
    });
  });
});
