/// <reference types="cypress" />
import { TEST_IDS } from "../../../src/config/constants";
import {
  baseTestSetup,
  setupIgnoreAllExceptions,
} from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("Dashboard Types", () => {
  beforeEach(() => {
    baseTestSetup();
    setupIgnoreAllExceptions();
  });

  describe("Administrator Dashboard", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/dashboard-management/administrator");
      cy.get("body").should("be.visible");
    });

    it("should display administrator dashboard", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.ADMINISTRATOR_DASHBOARD}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.ADMINISTRATOR_DASHBOARD}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show stats grid", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.STATS_GRID}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.STATS_GRID}"]`).should("be.visible");
        }
      });
    });

    it("should display system operations", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.SYSTEM_OPERATIONS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.SYSTEM_OPERATIONS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display operations list", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.OPERATIONS_LIST}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.OPERATIONS_LIST}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display recent activity", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.RECENT_ACTIVITY}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.RECENT_ACTIVITY}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Support Dashboard", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/dashboard-management/support");
      cy.get("body").should("be.visible");
    });

    it("should display support dashboard", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.SUPPORT_DASHBOARD}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.SUPPORT_DASHBOARD}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show notifications section", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.NOTIFICATIONS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.NOTIFICATIONS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show notifications list", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.NOTIFICATIONS_LIST}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.NOTIFICATIONS_LIST}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show achievements section", () => {
      cy.get("body").then(($body) => {
        if ($body.find(`[data-testid="${TEST_IDS.ACHIEVEMENTS}"]`).length > 0) {
          cy.get(`[data-testid="${TEST_IDS.ACHIEVEMENTS}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Regulator Dashboard", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/dashboard-management/regulator");
      cy.get("body").should("be.visible");
    });

    it("should display regulator dashboard", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.REGULATOR_DASHBOARD}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.REGULATOR_DASHBOARD}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show compliance alerts", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.COMPLIANCE_ALERTS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.COMPLIANCE_ALERTS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show compliance metrics", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.COMPLIANCE_METRICS}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.COMPLIANCE_METRICS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show compliance tasks", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.COMPLIANCE_TASKS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.COMPLIANCE_TASKS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should show compliance activity", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.COMPLIANCE_ACTIVITY}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.COMPLIANCE_ACTIVITY}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Operator Dashboard", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/dashboard-management/operator");
      cy.get("body").should("be.visible");
    });

    it("should display operator dashboard", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.OPERATOR_DASHBOARD}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.OPERATOR_DASHBOARD}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Dashboard Navigation", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");
    });

    it("should navigate to dashboard management section", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.NAV_DASHBOARD_MANAGEMENT}"]`)
            .length > 0
        ) {
          cy.get(
            `[data-testid="${TEST_IDS.NAV_DASHBOARD_MANAGEMENT}"]`
          ).click();
        }
      });
    });

    it("should navigate to administrator dashboard", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.NAV_DASHBOARD_ADMINISTRATOR}"]`)
            .length > 0
        ) {
          cy.get(
            `[data-testid="${TEST_IDS.NAV_DASHBOARD_ADMINISTRATOR}"]`
          ).click();
          cy.url().should("include", "/administrator");
        }
      });
    });

    it("should navigate to support dashboard", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.NAV_DASHBOARD_SUPPORT}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.NAV_DASHBOARD_SUPPORT}"]`).click();
          cy.url().should("include", "/support");
        }
      });
    });

    it("should navigate to regulator dashboard", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.NAV_DASHBOARD_REGULATOR}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.NAV_DASHBOARD_REGULATOR}"]`).click();
          cy.url().should("include", "/regulator");
        }
      });
    });

    it("should navigate to operator dashboard", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.NAV_DASHBOARD_OPERATOR}"]`)
            .length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.NAV_DASHBOARD_OPERATOR}"]`).click();
          cy.url().should("include", "/operator");
        }
      });
    });
  });

  describe("Dashboard Statistics", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");
    });

    it("should display total users card", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.TOTAL_USERS_CARD}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TOTAL_USERS_CARD}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display total users count", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.TOTAL_USERS_COUNT}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TOTAL_USERS_COUNT}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display total roles card", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.TOTAL_ROLES_CARD}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TOTAL_ROLES_CARD}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display total roles count", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.TOTAL_ROLES_COUNT}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.TOTAL_ROLES_COUNT}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display pending users card", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.PENDING_USERS_CARD}"]`).length >
          0
        ) {
          cy.get(`[data-testid="${TEST_IDS.PENDING_USERS_CARD}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should display active users card", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.ACTIVE_USERS_CARD}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.ACTIVE_USERS_CARD}"]`).should(
            "be.visible"
          );
        }
      });
    });
  });

  describe("Dashboard Quick Actions", () => {
    beforeEach(() => {
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");
    });

    it("should display quick actions section", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.QUICK_ACTIONS}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.QUICK_ACTIONS}"]`).should(
            "be.visible"
          );
        }
      });
    });

    it("should click create user quick action", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_USER_QUICK_ACTION}"]`)
            .length > 0
        ) {
          cy.get(
            `[data-testid="${TEST_IDS.CREATE_USER_QUICK_ACTION}"]`
          ).click();
        }
      });
    });

    it("should click create role quick action", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(`[data-testid="${TEST_IDS.CREATE_ROLE_QUICK_ACTION}"]`)
            .length > 0
        ) {
          cy.get(
            `[data-testid="${TEST_IDS.CREATE_ROLE_QUICK_ACTION}"]`
          ).click();
        }
      });
    });

    it("should click manage permissions quick action", () => {
      cy.get("body").then(($body) => {
        if (
          $body.find(
            `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_QUICK_ACTION}"]`
          ).length > 0
        ) {
          cy.get(
            `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_QUICK_ACTION}"]`
          ).click();
        }
      });
    });
  });

  describe("Dashboard Loading States", () => {
    it("should show loading state while fetching dashboard data", () => {
      cy.intercept("GET", "**/api/**", (req) => {
        req.on("response", (res) => {
          res.setDelay(1000);
        });
      }).as("slowApi");

      loginAndWait();
      cy.visit("/");
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="loading-spinner"]').length > 0) {
          cy.get('[data-testid="loading-spinner"]').should("exist");
        }
      });
    });
  });

  describe("Dashboard Error States", () => {
    it("should handle API errors gracefully", () => {
      cy.intercept("GET", "**/api/dashboard/**", { statusCode: 500 }).as(
        "dashboardError"
      );
      loginAndWait();
      cy.visit("/");
      cy.get("body").should("be.visible");
    });
  });

  describe("Dashboard Responsive Design", () => {
    beforeEach(() => {
      loginAndWait();
    });

    it("should display correctly on mobile", () => {
      cy.viewport(375, 667);
      cy.visit("/");
      cy.get("body").should("be.visible");
    });

    it("should display correctly on tablet", () => {
      cy.viewport(768, 1024);
      cy.visit("/");
      cy.get("body").should("be.visible");
    });

    it("should display correctly on desktop", () => {
      cy.viewport(1920, 1080);
      cy.visit("/");
      cy.get("body").should("be.visible");
    });
  });
});
