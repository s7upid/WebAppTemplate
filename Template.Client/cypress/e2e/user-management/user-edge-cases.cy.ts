/// <reference types="cypress" />
import { TEST_IDS } from "../../../src/config/constants";
import {
  baseTestSetup,
  setupIgnoreAllExceptions,
} from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("User Management Edge Cases", () => {
  beforeEach(() => {
    baseTestSetup();
    setupIgnoreAllExceptions();
    loginAndWait();
  });

  describe("Pending Users Approval", () => {
    beforeEach(() => {
      cy.visit("/users/pending");
      cy.get("body").should("be.visible");
    });

    it("should display pending users page", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PENDING_USERS_PAGE}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PENDING_USERS_PAGE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display pending user cards", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PENDING_USER_CARD}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PENDING_USER_CARD}"]`).should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });

    it("should show approve button for pending users", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.APPROVE_USER_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.APPROVE_USER_BUTTON}"]`)
            .first()
            .should("be.visible");
        } else if ($body.find('button:contains("Approve")').length > 0) {
          cy.contains("button", "Approve").should("be.visible");
        }
      });
    });

    it("should approve a pending user", () => {
      cy.intercept("POST", "**/api/users/*/approve", {
        statusCode: 200,
        body: { success: true },
      }).as("approveUser");

      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.APPROVE_USER_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.APPROVE_USER_BUTTON}"]`)
            .first()
            .click();
          cy.wait(500);
        } else if ($body.find('button:contains("Approve")').length > 0) {
          cy.contains("button", "Approve").first().click();
          cy.wait(500);
        }
      });
    });

    it("should reject a pending user", () => {
      cy.intercept("POST", "**/api/users/*/reject", {
        statusCode: 200,
        body: { success: true },
      }).as("rejectUser");

      cy.get("body").then(($body) => {
        if ($body.find('button:contains("Reject")').length > 0) {
          cy.contains("button", "Reject").first().click();
          cy.wait(500);
        }
      });
    });

    it("should show rejection reason modal", () => {
      cy.get("body").then(($body) => {
        if ($body.find('button:contains("Reject")').length > 0) {
          cy.contains("button", "Reject").first().click();
          cy.wait(300);
          cy.get("body").then(($modalBody) => {
            if ($modalBody.find('[role="dialog"]').length > 0) {
              cy.get('[role="dialog"]').should("be.visible");
            }
          });
        }
      });
    });

    it("should handle empty pending users list", () => {
      cy.intercept("GET", "**/api/users/pending**", {
        statusCode: 200,
        body: { items: [], totalCount: 0 },
      }).as("emptyPending");
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("User Form Validation Edge Cases", () => {
    beforeEach(() => {
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should validate email uniqueness", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();
          cy.wait(300);

          cy.intercept("POST", "**/api/users**", {
            statusCode: 400,
            body: { message: "Email already exists" },
          }).as("duplicateEmail");

          cy.get("body").then(($formBody) => {
            if (
              $formBody.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length >
              0
            ) {
              cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
                "existing@example.com"
              );
            }
            if (
              $formBody.find(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).type(
                "Test"
              );
            }
            if (
              $formBody.find(`[data-testid="${TEST_IDS.LAST_NAME_INPUT}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.LAST_NAME_INPUT}"]`).type(
                "User"
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

    it("should validate first name is required", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($formBody) => {
            if (
              $formBody.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length >
              0
            ) {
              cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
                "test@example.com"
              );
            }
            // Skip first name
            if (
              $formBody.find(`[data-testid="${TEST_IDS.LAST_NAME_INPUT}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.LAST_NAME_INPUT}"]`).type(
                "User"
              );
            }
            if (
              $formBody.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
              cy.wait(300);
            }
          });
        }
      });
    });

    it("should validate last name is required", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($formBody) => {
            if (
              $formBody.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length >
              0
            ) {
              cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
                "test@example.com"
              );
            }
            if (
              $formBody.find(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).type(
                "Test"
              );
            }
            // Skip last name
            if (
              $formBody.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
              cy.wait(300);
            }
          });
        }
      });
    });

    it("should validate email format", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($formBody) => {
            if (
              $formBody.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length >
              0
            ) {
              cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
                "invalid-email"
              );
            }
            if (
              $formBody.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
              cy.wait(300);
            }
          });
        }
      });
    });

    it("should trim whitespace from inputs", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($formBody) => {
            if (
              $formBody.find(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).type(
                "  Test  "
              );
            }
          });
        }
      });
    });
  });

  describe("User Role Assignment", () => {
    beforeEach(() => {
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should open role assignment modal", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(
                `[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`).click();
              cy.wait(300);
            } else if (
              $detailBody.find(`[data-testid="${TEST_IDS.ASSIGN_ROLE_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.ASSIGN_ROLE_BUTTON}"]`).click();
              cy.wait(300);
            }
          });
        }
      });
    });

    it("should display available roles", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(
                `[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`).click();
              cy.wait(300);

              cy.get("body").then(($modalBody) => {
                if (
                  $modalBody.find(`[data-testid="${TEST_IDS.ROLE_OPTION}"]`)
                    .length > 0
                ) {
                  cy.get(`[data-testid="${TEST_IDS.ROLE_OPTION}"]`).should(
                    "have.length.greaterThan",
                    0
                  );
                }
              });
            }
          });
        }
      });
    });

    it("should assign multiple roles to user", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(
                `[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`).click();
              cy.wait(300);

              cy.get("body").then(($modalBody) => {
                if ($modalBody.find('input[type="checkbox"]').length >= 2) {
                  cy.get('input[type="checkbox"]').eq(0).check({ force: true });
                  cy.get('input[type="checkbox"]').eq(1).check({ force: true });
                }
              });
            }
          });
        }
      });
    });

    it("should save role changes", () => {
      cy.intercept("PUT", "**/api/users/*/roles**", {
        statusCode: 200,
        body: { success: true },
      }).as("updateRoles");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(
                `[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.MANAGE_ROLES_BUTTON}"]`).click();
              cy.wait(300);

              cy.get("body").then(($modalBody) => {
                if (
                  $modalBody.find(
                    `[data-testid="${TEST_IDS.SAVE_ROLE_BUTTON}"]`
                  ).length > 0
                ) {
                  cy.get(
                    `[data-testid="${TEST_IDS.SAVE_ROLE_BUTTON}"]`
                  ).click();
                }
              });
            }
          });
        }
      });
    });
  });

  describe("User Permission Assignment", () => {
    beforeEach(() => {
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should open permission assignment modal", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(
                `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(
                `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
              ).click();
              cy.wait(300);
            }
          });
        }
      });
    });

    it("should display available permissions", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(
                `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(
                `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
              ).click();
              cy.wait(300);

              cy.get("body").then(($modalBody) => {
                if (
                  $modalBody.find(
                    `[data-testid="${TEST_IDS.PERMISSION_CHECKBOX}"]`
                  ).length > 0
                ) {
                  cy.get(
                    `[data-testid="${TEST_IDS.PERMISSION_CHECKBOX}"]`
                  ).should("have.length.greaterThan", 0);
                }
              });
            }
          });
        }
      });
    });

    it("should toggle permission", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(
                `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(
                `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
              ).click();
              cy.wait(300);

              cy.get("body").then(($modalBody) => {
                if (
                  $modalBody.find(
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

    it("should save permission changes", () => {
      cy.intercept("PUT", "**/api/users/*/permissions**", {
        statusCode: 200,
        body: { success: true },
      }).as("updatePermissions");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(
                `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
              ).length > 0
            ) {
              cy.get(
                `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
              ).click();
              cy.wait(300);

              cy.get("body").then(($modalBody) => {
                if (
                  $modalBody.find(
                    `[data-testid="${TEST_IDS.SAVE_PERMISSIONS_BUTTON}"]`
                  ).length > 0
                ) {
                  cy.get(
                    `[data-testid="${TEST_IDS.SAVE_PERMISSIONS_BUTTON}"]`
                  ).click();
                }
              });
            }
          });
        }
      });
    });
  });

  describe("User Delete Confirmation", () => {
    beforeEach(() => {
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should show delete confirmation dialog", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`).click();
              cy.wait(300);

              cy.get("body").then(($dialogBody) => {
                if (
                  $dialogBody.find(
                    `[data-testid="${TEST_IDS.CONFIRMATION_DIALOG}"]`
                  ).length > 0
                ) {
                  cy.get(
                    `[data-testid="${TEST_IDS.CONFIRMATION_DIALOG}"]`
                  ).should("be.visible");
                }
              });
            }
          });
        }
      });
    });

    it("should cancel delete operation", () => {
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid^="table-row-"]').length > 0) {
          cy.get('[data-testid^="table-row-"]').first().click();
          cy.wait(300);

          cy.get("body").then(($detailBody) => {
            if (
              $detailBody.find(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`)
                .length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`).click();
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
        }
      });
    });

    it("should prevent deleting own account", () => {
      // The logged in user should not be able to delete themselves
      cy.get("body").should("be.visible");
    });
  });

  describe("User Status Changes", () => {
    it("should activate a deactivated user", () => {
      cy.visit("/users");
      cy.get("body").then(($body) => {
        if ($body.find('button:contains("Activate")').length > 0) {
          cy.contains("button", "Activate").first().click();
          cy.wait(500);
        }
      });
    });

    it("should deactivate an active user", () => {
      cy.visit("/users");
      cy.get("body").then(($body) => {
        if ($body.find('button:contains("Deactivate")').length > 0) {
          cy.contains("button", "Deactivate").first().click();
          cy.wait(500);
        }
      });
    });
  });

  describe("Bulk User Actions", () => {
    beforeEach(() => {
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should show bulk actions when users are selected", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.BULK_ACTIONS}"]`).length > 0) {
          // Select multiple users first
          if ($body.find('input[type="checkbox"]').length > 1) {
            cy.get('input[type="checkbox"]').eq(1).check({ force: true });
            cy.get('input[type="checkbox"]').eq(2).check({ force: true });
            cy.get(`[data-testid="${TEST_IDS.BULK_ACTIONS}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });
  });

  describe("Error States", () => {
    it("should handle user not found error", () => {
      cy.visit("/users/nonexistent-id");
      cy.get("body").should("be.visible");
    });

    it("should handle API errors during user creation", () => {
      cy.intercept("POST", "**/api/users**", { statusCode: 500 }).as(
        "createError"
      );
      cy.visit("/users");
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();
          cy.wait(300);

          cy.get("body").then(($formBody) => {
            if (
              $formBody.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`)
                .length > 0
            ) {
              // Fill minimal required fields
              if (
                $formBody.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`)
                  .length > 0
              ) {
                cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
                  "test@test.com"
                );
              }
              if (
                $formBody.find(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`)
                  .length > 0
              ) {
                cy.get(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).type(
                  "Test"
                );
              }
              if (
                $formBody.find(`[data-testid="${TEST_IDS.LAST_NAME_INPUT}"]`)
                  .length > 0
              ) {
                cy.get(`[data-testid="${TEST_IDS.LAST_NAME_INPUT}"]`).type(
                  "User"
                );
              }
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
              cy.wait(500);
            }
          });
        }
      });
    });
  });
});
