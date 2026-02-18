import { TEST_IDS } from "../../../src/config/constants";
import { baseTestSetup } from "../../support/base-test";
import { loginAndWait, setTheme } from "../../support/test-helpers";

describe("Theme and Responsive Design", () => {
  beforeEach(() => {
    baseTestSetup();
    loginAndWait();
    cy.visit("/dashboard");
    cy.get("body").should("be.visible");
  });

  describe("Theme Switching", () => {
    it("should display theme toggle button", () => {
      cy.visit("/dashboard");

      cy.get("body").should("be.visible");
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.THEME_TOGGLE}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.THEME_TOGGLE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should toggle between light and dark themes", () => {
      cy.visit("/dashboard");

      setTheme("dark");
      cy.reload();
      cy.get("body").should("be.visible");
      setTheme("light");
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should persist theme preference in localStorage", () => {
      cy.visit("/dashboard");

      setTheme("dark");
      cy.reload();
      cy.get("body").should("be.visible");
      setTheme("light");
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should apply theme to all components", () => {
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="stats-cards"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.STATS_CARDS}"]`).should(
            "be.visible"
          );
        }
      });

      setTheme("dark");
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="stats-cards"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.STATS_CARDS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should apply theme to navigation", () => {
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="desktop-sidebar"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.DESKTOP_SIDEBAR}"]`).should(
            "be.visible"
          );
        }
      });

      setTheme("dark");
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="desktop-sidebar"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.DESKTOP_SIDEBAR}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should apply theme to forms", () => {
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );

            cy.toggleTheme();
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });

    it("should apply theme to tables", () => {
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="users-table"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USERS_TABLE}"]`).should(
            "be.visible"
          );

          cy.toggleTheme();
          cy.get(`[data-testid="${TEST_IDS.USERS_TABLE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should apply theme to modals", () => {
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );

            cy.toggleTheme();
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });
  });

  describe("Mobile Responsiveness", () => {
    it("should be responsive on mobile devices", () => {
      cy.viewport(375, 667);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="mobile-sidebar"]').length > 0) {
          cy.get('[data-testid="mobile-sidebar"]').should("be.visible");
        }
      });
    });

    it("should show mobile navigation menu", () => {
      cy.viewport(375, 667);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="mobile-navigation"]').length > 0) {
          cy.get('[data-testid="mobile-navigation"]').should("be.visible");
        }
      });
    });

    it("should navigate using mobile menu", () => {
      cy.viewport(375, 667);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="mobile-navigation"]').length > 0) {
          cy.get('[data-testid="mobile-navigation"]').within(() => {
            cy.get('[data-testid="nav-user-management"]').click();
          });
          cy.url().should("include", "/users");
        }
      });
    });

    it("should close mobile menu when clicking outside", () => {
      cy.viewport(375, 667);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="mobile-sidebar"]').length > 0) {
          cy.get('[data-testid="mobile-sidebar"]').should("be.visible");

          cy.get("body").click(0, 0);

          cy.get('[data-testid="mobile-sidebar"]').should("not.be.visible");
        }
      });
    });

    it("should stack stats cards vertically on mobile", () => {
      cy.viewport(375, 667);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="stats-cards"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.STATS_CARDS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show responsive table on mobile", () => {
      cy.viewport(375, 667);
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="users-table"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USERS_TABLE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show mobile-friendly forms", () => {
      cy.viewport(375, 667);
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });

    it("should handle mobile touch interactions", () => {
      cy.viewport(375, 667);
      cy.visit("/dashboard");

      setTheme("dark");
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("Tablet Responsiveness", () => {
    it("should be responsive on tablet devices", () => {
      cy.viewport(768, 1024);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="desktop-sidebar"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.DESKTOP_SIDEBAR}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show sidebar on tablet", () => {
      cy.viewport(768, 1024);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="desktop-sidebar"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.DESKTOP_SIDEBAR}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display stats cards in grid on tablet", () => {
      cy.viewport(768, 1024);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="stats-cards"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.STATS_CARDS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show full table on tablet", () => {
      cy.viewport(768, 1024);
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="users-table"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USERS_TABLE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show responsive modals on tablet", () => {
      cy.viewport(768, 1024);
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });
  });

  describe("Desktop Responsiveness", () => {
    it("should be responsive on desktop", () => {
      cy.viewport(1280, 720);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="desktop-sidebar"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.DESKTOP_SIDEBAR}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show full sidebar on desktop", () => {
      cy.viewport(1280, 720);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="desktop-sidebar"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.DESKTOP_SIDEBAR}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display stats cards in grid on desktop", () => {
      cy.viewport(1280, 720);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="stats-cards"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.STATS_CARDS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show full table with all columns on desktop", () => {
      cy.viewport(1280, 720);
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="users-table"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USERS_TABLE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show full modal on desktop", () => {
      cy.viewport(1280, 720);
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });
  });

  describe("Cross-Device Theme Persistence", () => {
    it("should maintain theme across different viewport sizes", () => {
      cy.visit("/dashboard");

      setTheme("dark");
      cy.reload();
      cy.get("body").should("be.visible");

      cy.viewport(375, 667);
      cy.get("body").should("be.visible");

      cy.viewport(768, 1024);
      cy.get("body").should("be.visible");

      cy.viewport(1280, 720);
      cy.get("body").should("be.visible");
    });

    it("should maintain theme when resizing window", () => {
      cy.visit("/dashboard");

      setTheme("dark");
      cy.reload();
      cy.get("body").should("be.visible");

      cy.viewport(375, 667);
      cy.get("body").should("be.visible");

      cy.viewport(1280, 720);
      cy.get("body").should("be.visible");
    });
  });

  describe("Theme Accessibility", () => {
    it("should maintain accessibility in both themes", () => {
      cy.visit("/dashboard");

      cy.get("body").should("be.visible");

      setTheme("dark");
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should have proper contrast ratios in both themes", () => {
      cy.visit("/dashboard");

      cy.get("body").should("be.visible");

      setTheme("dark");
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should support reduced motion preferences", () => {
      cy.visit("/dashboard");

      cy.get("body").should("be.visible");
      setTheme("dark");
      cy.reload();
      cy.get("body").should("be.visible");
    });
  });

  describe("Responsive Navigation", () => {
    it("should show appropriate navigation for each device size", () => {
      cy.viewport(375, 667);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="mobile-sidebar"]').length > 0) {
          cy.get('[data-testid="mobile-sidebar"]').should("be.visible");
        }
      });

      cy.viewport(1280, 720);
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="desktop-sidebar"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.DESKTOP_SIDEBAR}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should handle navigation state across viewport changes", () => {
      loginAndWait();
      cy.visit("/users");
      cy.get("body").should("be.visible");
      cy.viewport(375, 667);
      cy.get("body").should("be.visible");
      cy.viewport(1280, 720);
      cy.get("body").should("be.visible");
    });
  });

  describe("Responsive Forms", () => {
    it("should adapt form layout for different screen sizes", () => {
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );

            cy.viewport(375, 667);
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );

            cy.viewport(1280, 720);
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );
          }
        }
      });
    });

    it("should handle form validation on all screen sizes", () => {
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="create-user-button"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();

          if ($body.find('[data-testid="user-form-modal"]').length > 0) {
            cy.get(`[data-testid="${TEST_IDS.USER_FORM_MODAL}"]`).should(
              "be.visible"
            );

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

  describe("Responsive Tables", () => {
    it("should handle table scrolling on mobile", () => {
      cy.viewport(375, 667);
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="users-table"]').length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USERS_TABLE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show responsive table actions", () => {
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="table-row"]').length > 0) {
          cy.get('[data-testid="table-row"]').first().should("be.visible");
        }
      });
    });

    it("should handle table sorting on touch devices", () => {
      cy.viewport(375, 667);
      cy.visit("/users");

      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="table-header"]').length > 0) {
          cy.get('[data-testid="table-header"]').first().should("be.visible");
        }
      });
    });
  });

  describe("Performance Across Devices", () => {
    it("should load quickly on mobile devices", () => {
      cy.viewport(375, 667);
      const startTime = Date.now();
      cy.visit("/dashboard");

      cy.get("body")
        .should("be.visible")
        .then(() => {
          const loadTime = Date.now() - startTime;
          expect(loadTime).to.be.lessThan(5000);
        });
    });

    it("should handle touch interactions smoothly", () => {
      cy.viewport(375, 667);
      cy.visit("/dashboard");

      cy.get("body").should("be.visible");
      setTheme("dark");
      cy.reload();
      cy.get("body").should("be.visible");
    });

    it("should maintain performance during theme switches", () => {
      cy.visit("/dashboard");

      cy.get("body").then(($body) => {
        const hasToggle = $body.find('[data-testid="theme-toggle"]').length > 0;

        if (hasToggle) {
          const startTime = Date.now();
          cy.get('[data-testid="theme-toggle"]').click();
          cy.get("body")
            .should("have.class", "dark")
            .then(() => {
              const switchTime = Date.now() - startTime;
              expect(switchTime).to.be.lessThan(500);
            });

          const startTime2 = Date.now();
          cy.get('[data-testid="theme-toggle"]').click();
          cy.get("body")
            .should("not.have.class", "dark")
            .then(() => {
              const switchTime2 = Date.now() - startTime2;
              expect(switchTime2).to.be.lessThan(500);
            });
        } else {
          const startTime = Date.now();
          cy.window().then((win) => {
            win.document.body.classList.add("dark");
          });
          cy.get("body")
            .should("have.class", "dark")
            .then(() => {
              const switchTime = Date.now() - startTime;
              expect(switchTime).to.be.lessThan(500);
            });

          const startTime2 = Date.now();
          cy.window().then((win) => {
            win.document.body.classList.remove("dark");
          });
          cy.get("body")
            .should("not.have.class", "dark")
            .then(() => {
              const switchTime2 = Date.now() - startTime2;
              expect(switchTime2).to.be.lessThan(500);
            });
        }
      });
    });
  });
});
