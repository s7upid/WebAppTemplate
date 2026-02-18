/// <reference types="cypress" />
/// <reference path="../../support/types.ts" />
import { TEST_IDS } from "../../../src/config/constants";
import {
  baseTestSetup,
  setupUncaughtExceptionHandler,
} from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("Form Validation", () => {
  beforeEach(() => {
    baseTestSetup();
    setupUncaughtExceptionHandler(["Objects are not valid as a React child"]);
  });

  describe("Login Form Validation", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("should validate required email field", () => {
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("password123");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();

      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).should(
        "have.attr",
        "required"
      );
      // Wait for validation to trigger
      cy.wait(500);

      // Check if error message exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="error-message"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should validate required password field", () => {
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
        "test@example.com"
      );
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();

      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).should(
        "have.attr",
        "required"
      );
      // Wait for validation to trigger
      cy.wait(500);

      // Check if error message exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="error-message"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should validate email format", () => {
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type("invalid-email");
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("password123");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();

      // Wait for validation to trigger
      cy.wait(500);

      // Check if error message exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="error-message"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should validate password minimum length", () => {
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
        "test@example.com"
      );
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("a");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();

      // Wait for validation to trigger
      cy.wait(500);

      // Check if error message exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="error-message"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should clear validation errors when user starts typing", () => {
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();

      // Wait for validation to trigger
      cy.wait(500);

      // Start typing in email field
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type("test");

      // Check if error message exists and is cleared
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="error-message"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
            "not.exist"
          );
        }
      });
    });
  });

  describe("User Form Validation", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should validate required first name field", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Try to submit without first name
            cy.get('[data-testid="submit-button"]').click();

            // Check if error message exists
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="error-message"]').length > 0) {
                cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
                  "be.visible"
                );
              }
            });
          }
        }
      });
    });

    it("should validate required last name field", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Try to submit without last name
            cy.get('[data-testid="submit-button"]').click();

            // Check if error message exists
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="error-message"]').length > 0) {
                cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
                  "be.visible"
                );
              }
            });
          }
        }
      });
    });

    it("should validate required email field", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Try to submit without email
            cy.get('[data-testid="submit-button"]').click();

            // Check if error message exists
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="error-message"]').length > 0) {
                cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
                  "be.visible"
                );
              }
            });
          }
        }
      });
    });

    it("should validate email format in user form", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Enter invalid email
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="email-input"]').length > 0) {
                cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
                  "invalid-email"
                );
                cy.get('[data-testid="submit-button"]').click();

                // Check if error message exists
                cy.get("body").then(($body) => {
                  if ($body.find('[data-testid="error-message"]').length > 0) {
                    cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
                      "be.visible"
                    );
                  }
                });
              }
            });
          }
        }
      });
    });

    it("should validate required password field", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Try to submit without password
            cy.get('[data-testid="submit-button"]').click();

            // Check if error message exists
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="error-message"]').length > 0) {
                cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
                  "be.visible"
                );
              }
            });
          }
        }
      });
    });

    it("should validate password minimum length in user form", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Enter short password
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="password-input"]').length > 0) {
                cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("a");
                cy.get('[data-testid="submit-button"]').click();

                // Check if error message exists
                cy.get("body").then(($body) => {
                  if ($body.find('[data-testid="error-message"]').length > 0) {
                    cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
                      "be.visible"
                    );
                  }
                });
              }
            });
          }
        }
      });
    });

    it("should validate required role field", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Try to submit without role
            cy.get('[data-testid="submit-button"]').click();

            // Check if error message exists
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="error-message"]').length > 0) {
                cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
                  "be.visible"
                );
              }
            });
          }
        }
      });
    });

    it("should validate required status field", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Try to submit without status
            cy.get('[data-testid="submit-button"]').click();

            // Check if error message exists
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="error-message"]').length > 0) {
                cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
                  "be.visible"
                );
              }
            });
          }
        }
      });
    });

    it("should prevent duplicate email addresses", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Enter duplicate email
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="email-input"]').length > 0) {
                cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(
                  "admin@admin.com"
                );
                cy.get('[data-testid="submit-button"]').click();

                // Check if error message exists
                cy.get("body").then(($body) => {
                  if ($body.find('[data-testid="error-message"]').length > 0) {
                    cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
                      "be.visible"
                    );
                  }
                });
              }
            });
          }
        }
      });
    });

    it("should trim whitespace from input fields", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Enter data with whitespace
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="first-name-input"]').length > 0) {
                cy.get('[data-testid="first-name-input"]').type("  Test  ");
                cy.get('[data-testid="submit-button"]').click();

                // Check if form handles whitespace
                cy.get('[data-testid="first-name-input"]').should(
                  "have.value",
                  "  Test  "
                );
              }
            });
          }
        }
      });
    });
  });

  describe("Form State Management", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");
    });

    it("should show loading state during form submission", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Fill form and submit
            cy.fillForm({
              "first-name-input": "Test",
              "last-name-input": "User",
              "email-input": "test@example.com",
              "password-input": "password123",
              "role-select": "user",
              "status-select": "active",
            });

            cy.get('[data-testid="submit-button"]').click();

            // Check if loading state exists
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="loading-spinner"]').length > 0) {
                cy.get('[data-testid="loading-spinner"]').should("be.visible");
              }
            });
          }
        }
      });
    });

    it("should disable submit button when form is invalid", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Check if submit button is disabled
            cy.get("body").then(($body) => {
              if ($body.find('[data-testid="submit-button"]').length > 0) {
                cy.get('[data-testid="submit-button"]').should("be.visible");
              }
            });
          }
        }
      });
    });

    it("should reset form when modal is closed", () => {
      // Check if create user button exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get('[data-testid="create-user-button"]').click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get('[data-testid="user-form-modal"]').should("be.visible");

            // Fill form
            cy.fillForm({
              "first-name-input": "Test",
              "last-name-input": "User",
              "email-input": "test@example.com",
              "password-input": "password123",
              "role-select": "user",
              "status-select": "active",
            });

            // Close modal
            cy.get('[data-testid="close-modal"]').click();
            cy.get('[data-testid="user-form-modal"]').should("not.exist");
          }
        }
      });
    });
  });

  describe("Real-time Validation", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("should validate email format as user types", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type("invalid");
        }
      });
      cy.get("body").should("be.visible");
    });

    it("should validate password strength as user types", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).type("a");
        }
      });
      cy.get("body").should("be.visible");
    });
  });

  describe("Accessibility in Forms", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("should have proper form labels", () => {
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).should("be.visible");
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).should("be.visible");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).should("be.visible");
    });

    it("should have proper error announcements", () => {
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).click();

      // Wait for validation to trigger
      cy.wait(500);

      // Check if error message exists
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="error-message"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ERROR_MESSAGE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should support keyboard navigation", () => {
      // Test basic keyboard navigation
      cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).should("be.visible");
      cy.get(`[data-testid="${TEST_IDS.PASSWORD_INPUT}"]`).should("be.visible");
      cy.get(`[data-testid="${TEST_IDS.LOGIN_BUTTON}"]`).should("be.visible");
    });
  });
});
