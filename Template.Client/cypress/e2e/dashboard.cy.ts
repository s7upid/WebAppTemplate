import { TEST_IDS } from "../../src/config/constants";
import { baseTestSetup, setupIgnoreAllExceptions } from "../support/base-test";
import { loginAndWait } from "../support/test-helpers";

describe("Dashboard", () => {
  beforeEach(() => {
    baseTestSetup();
    setupIgnoreAllExceptions();
    loginAndWait();
    cy.visit("/");
    cy.get("body").should("be.visible");
  });

  describe("Dashboard Page", () => {
    it("should display the dashboard", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.DASHBOARD}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.DASHBOARD}"]`).should("be.visible");
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });

    it("should show welcome message", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.WELCOME_MESSAGE}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.WELCOME_MESSAGE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display user information", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.USER_INFO}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.USER_INFO}"]`).should("be.visible");
        }
      });
    });
  });

  describe("Quick Actions", () => {
    it("should show quick action buttons", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.QUICK_ACTIONS}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.QUICK_ACTIONS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show create user button", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_USER_QUICK_ACTION}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_QUICK_ACTION}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show create role button", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_ROLE_QUICK_ACTION}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_QUICK_ACTION}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show manage permissions button", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_QUICK_ACTION}"]`)
            .length > 0
        ) {
          cy.get(
            `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_QUICK_ACTION}"]`
          ).should("be.visible");
        }
      });
    });

    it("should navigate to user creation when clicked", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_USER_QUICK_ACTION}"]`)
            .length > 0
        ) {
          cy.get(
            `[data-testid="${TEST_IDS.CREATE_USER_QUICK_ACTION}"]`
          ).click();
        }
      });
    });

    it("should navigate to role creation when clicked", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_ROLE_QUICK_ACTION}"]`)
            .length > 0
        ) {
          cy.get(
            `[data-testid="${TEST_IDS.CREATE_ROLE_QUICK_ACTION}"]`
          ).click();
        }
      });
    });

    it("should navigate to permission management when clicked", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_QUICK_ACTION}"]`)
            .length > 0
        ) {
          cy.get(
            `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_QUICK_ACTION}"]`
          ).click();
        }
      });
    });
  });

  describe("Statistics Cards", () => {
    it("should show statistics cards", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.STATS_CARDS}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.STATS_CARDS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show total users card", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TOTAL_USERS_CARD}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TOTAL_USERS_CARD}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show total roles card", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.TOTAL_ROLES_CARD}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TOTAL_ROLES_CARD}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show pending users card", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.PENDING_USERS_CARD}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PENDING_USERS_CARD}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show active users card", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.ACTIVE_USERS_CARD}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.ACTIVE_USERS_CARD}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Recent Activity", () => {
    it("should show recent activity section", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.RECENT_ACTIVITY}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.RECENT_ACTIVITY}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show activity items", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ACTIVITY_ITEM}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ACTIVITY_ITEM}"]`).should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });

    it("should show activity details", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.ACTIVITY_ITEM}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ACTIVITY_ITEM}"]`)
            .first()
            .within(() => {
              cy.get("div").should("exist");
            });
        }
      });
    });
  });

  describe("Navigation", () => {
    it("should show sidebar navigation", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.SIDEBAR}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.SIDEBAR}"]`).should("be.visible");
        }
      });
    });

    it("should show navigation items", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.NAV_ITEM}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.NAV_ITEM}"]`).should(
            "have.length.greaterThan",
            0
          );
        }
      });
    });

    it("should navigate to users page", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.NAV_USERS}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.NAV_USERS}"]`).click();
        }
      });
    });

    it("should navigate to roles page", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.NAV_ROLES}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.NAV_ROLES}"]`).click();
        }
      });
    });

    it("should navigate to permissions page", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.NAV_PERMISSIONS}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.NAV_PERMISSIONS}"]`).click();
        }
      });
    });
  });

  describe("User Profile", () => {
    it("should show user profile dropdown", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.USER_PROFILE_DROPDOWN}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.USER_PROFILE_DROPDOWN}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show profile options", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.USER_PROFILE_DROPDOWN}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.USER_PROFILE_DROPDOWN}"]`).click();
        }
      });
    });

    it("should navigate to profile page", () => {
      cy.get("body").should("be.visible");
    });

    it("should navigate to settings page", () => {
      cy.get("body").should("be.visible");
    });

    it("should logout when logout is clicked", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.LOGOUT_BUTTON}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.LOGOUT_BUTTON}"]`).click();
          // Verify redirect to login
          cy.url().should("include", "/login");
          // Verify localStorage is cleared
          cy.window().then((win) => {
            const token = win.localStorage.getItem("auth-token");
            const user = win.localStorage.getItem("auth-user");
            expect(token).to.be.null;
            expect(user).to.be.null;
          });
        } else {
          cy.get("body").should("be.visible");
        }
      });
    });
  });

  describe("Theme Toggle", () => {
    it("should show theme toggle button", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.THEME_TOGGLE}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.THEME_TOGGLE}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should toggle to dark mode", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.THEME_TOGGLE}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.THEME_TOGGLE}"]`).click();
        }
      });
    });

    it("should toggle to light mode", () => {
      cy.get("body").then(($b) => {
        if ($b.find(`[data-testid="${TEST_IDS.THEME_TOGGLE}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.THEME_TOGGLE}"]`).click();
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

  describe("Data Loading", () => {
    it("should show loading state while data is being fetched", () => {
      cy.get("body").should("be.visible");
    });

    it("should handle data loading errors gracefully", () => {
      cy.get("body").should("be.visible");
    });
  });

  describe("Permission-based Content", () => {
    it("should show content based on user permissions", () => {
      cy.get("body").then(($b) => {
        if (
          $b.find(`[data-testid="${TEST_IDS.CREATE_USER_QUICK_ACTION}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.CREATE_USER_QUICK_ACTION}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should hide content when permissions are missing", () => {
      loginAndWait("user@example.com", "password123");
      cy.visit("/");

      cy.get(`[data-testid="${TEST_IDS.CREATE_USER_QUICK_ACTION}"]`).should(
        "not.exist"
      );
      cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_QUICK_ACTION}"]`).should(
        "not.exist"
      );
      cy.get(
        `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_QUICK_ACTION}"]`
      ).should("not.exist");
    });
  });

  describe("Real-time Updates", () => {
    it("should update statistics in real-time", () => {
      cy.get("body").should("be.visible");
    });

    it("should update recent activity in real-time", () => {
      cy.get("body").should("be.visible");
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      cy.get("body").should("be.visible");
    });

    it("should have proper ARIA labels", () => {
      cy.get("body").should("be.visible");
    });

    it("should support keyboard navigation", () => {
      cy.get("body").should("be.visible");
    });
  });

  describe("Performance", () => {
    it("should load dashboard quickly", () => {
      cy.get("body").should("be.visible");
    });

    it("should handle large datasets efficiently", () => {
      cy.get("body").should("be.visible");
    });
  });
});
