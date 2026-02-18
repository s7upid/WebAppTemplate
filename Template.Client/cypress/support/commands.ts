import { TEST_IDS } from "../../src/config/constants";
import {
  clickLogout,
  waitForLogin,
  waitForLoginRedirect,
  verifyTokenExists,
  verifyAuthDataCleared,
} from "./test-helpers";

// Mock user data for different roles
const MOCK_USERS: Record<
  string,
  {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  }
> = {
  "admin@admin.com": {
    id: "1",
    email: "admin@admin.com",
    role: "administrator",
    firstName: "Admin",
    lastName: "User",
  },
  "john.doe@example.com": {
    id: "2",
    email: "john.doe@example.com",
    role: "admin",
    firstName: "John",
    lastName: "Doe",
  },
  "jane.smith@example.com": {
    id: "3",
    email: "jane.smith@example.com",
    role: "manager",
    firstName: "Jane",
    lastName: "Smith",
  },
  "alice.johnson@example.com": {
    id: "4",
    email: "alice.johnson@example.com",
    role: "user",
    firstName: "Alice",
    lastName: "Johnson",
  },
  "user@example.com": {
    id: "5",
    email: "user@example.com",
    role: "user",
    firstName: "Test",
    lastName: "User",
  },
};

// Helper to set mock auth data in localStorage
function setMockAuthData(email: string) {
  const user = MOCK_USERS[email] || MOCK_USERS["admin@admin.com"];
  cy.window().then((win) => {
    win.localStorage.setItem("auth-token", `mock-token-${user.id}`);
    win.localStorage.setItem("auth-user", JSON.stringify(user));
  });
}

Cypress.Commands.add("loginAsAdmin", () => {
  setMockAuthData("admin@admin.com");
});

// Logs in as a regular user with limited permissions
Cypress.Commands.add("loginAsUser", () => {
  setMockAuthData("user@example.com");
});

// Mock-based login - sets localStorage directly without real API calls
Cypress.Commands.add("login", (email: string, _password: string) => {
  cy.session([email], () => {
    // Set mock auth data directly - no real API calls
    cy.window().then((win) => {
      const user = MOCK_USERS[email] || {
        id: "99",
        email: email,
        role: "user",
        firstName: "Test",
        lastName: "User",
      };
      win.localStorage.setItem("auth-token", `mock-token-${user.id}`);
      win.localStorage.setItem("auth-user", JSON.stringify(user));
    });
  });
});

Cypress.Commands.add("logout", () => {
  // Clear localStorage directly
  cy.window().then((win) => {
    win.localStorage.removeItem("auth-token");
    win.localStorage.removeItem("auth-user");
    win.localStorage.removeItem("refresh-token");
  });
  clickLogout();
});

Cypress.Commands.add("createUser", (userData: any) => {
  cy.visit("/users");
  cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).click();
  cy.get(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).type(
    userData.firstName
  );
  cy.get(`[data-testid="${TEST_IDS.LAST_NAME_INPUT}"]`).type(userData.lastName);
  cy.get(`[data-testid="${TEST_IDS.EMAIL_INPUT}"]`).type(userData.email);
  cy.get(`[data-testid="${TEST_IDS.ROLE_SELECT}"]`).select(userData.role);
  cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
  cy.get(`[data-testid="${TEST_IDS.SUCCESS_MESSAGE}"]`).should("be.visible");
});

Cypress.Commands.add("createRole", (roleData: any) => {
  cy.visit("/roles");
  cy.get(`[data-testid="${TEST_IDS.CREATE_ROLE_BUTTON}"]`).click();
  cy.get(`[data-testid="${TEST_IDS.ROLE_NAME_INPUT}"]`).type(roleData.name);
  cy.get(`[data-testid="${TEST_IDS.ROLE_DESCRIPTION_INPUT}"]`).type(
    roleData.description
  );
  cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
  cy.get(`[data-testid="${TEST_IDS.SUCCESS_MESSAGE}"]`).should("be.visible");
});

Cypress.Commands.add(
  "assignPermission",
  (userId: string, permission: string) => {
    cy.visit("/users");
    cy.get(`[data-testid="user-row-${userId}"]`).click();
    cy.get('[data-testid="manage-permissions-button"]').click();
    cy.get(`[data-testid="permission-checkbox-${permission}"]`).check();
    cy.get('[data-testid="save-permissions-button"]').click();
    cy.get(`[data-testid="${TEST_IDS.SUCCESS_MESSAGE}"]`).should("be.visible");
  }
);

Cypress.Commands.add("assignRole", (userId: string, roleId: string) => {
  cy.visit("/users");
  cy.get(`[data-testid="user-row-${userId}"]`).click();
  cy.get('[data-testid="manage-roles-button"]').click();
  cy.get(`[data-testid="role-option-${roleId}"]`).click();
  cy.get('[data-testid="save-role-button"]').click();
  cy.get(`[data-testid="${TEST_IDS.SUCCESS_MESSAGE}"]`).should("be.visible");
});

Cypress.Commands.add("toggleTheme", () => {
  cy.get(`[data-testid="${TEST_IDS.THEME_TOGGLE}"]`).click({ force: true });
});

Cypress.Commands.add("clickTableHeader", (headerText: string) => {
  cy.get("body").then(($body) => {
    // Try to find by test ID first
    const testIdMap: Record<string, string> = {
      Name: TEST_IDS.TABLE_HEADER_NAME,
      Role: TEST_IDS.TABLE_HEADER_ROLE,
      Status: TEST_IDS.TABLE_HEADER_STATUS,
      "Last Login": TEST_IDS.TABLE_HEADER_LAST_LOGIN,
    };

    if (
      testIdMap[headerText] &&
      $body.find(`[data-testid="${testIdMap[headerText]}"]`).length > 0
    ) {
      cy.get(`[data-testid="${testIdMap[headerText]}"]`).click();
    } else {
      // Fallback to finding by text content
      cy.contains("th", headerText).click();
    }
  });
});

Cypress.Commands.add("cancelDialog", () => {
  cy.get("body").then(($body) => {
    if (
      $body.find(`[data-testid="${TEST_IDS.CANCEL_DELETE_BUTTON}"]`).length > 0
    ) {
      cy.get(`[data-testid="${TEST_IDS.CANCEL_DELETE_BUTTON}"]`).click();
    } else if (
      $body.find(`[data-testid="${TEST_IDS.CANCEL_BUTTON}"]`).length > 0
    ) {
      cy.get(`[data-testid="${TEST_IDS.CANCEL_BUTTON}"]`).click();
    } else {
      // Fallback: look for button with "Cancel" text
      cy.contains("button", /cancel/i).click();
    }
  });
});

Cypress.Commands.add("confirmDialog", () => {
  cy.get("body").then(($body) => {
    if (
      $body.find(`[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`).length > 0
    ) {
      cy.get(`[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`).click();
    } else if (
      $body.find(`[data-testid="${TEST_IDS.CONFIRM_BUTTON}"]`).length > 0
    ) {
      cy.get(`[data-testid="${TEST_IDS.CONFIRM_BUTTON}"]`).click();
    } else {
      // Fallback: look for button with "Confirm" text
      cy.contains("button", /confirm/i).click();
    }
  });
});

Cypress.Commands.add("fillForm", (formData: Record<string, string>) => {
  cy.get("body").then(($body) => {
    const entries = Object.entries(formData);
    const fillField = (index: number) => {
      if (index >= entries.length) {
        return;
      }
      const [fieldId, value] = entries[index];
      const selector = `[data-testid="${fieldId}"]`;
      if ($body.find(selector).length > 0) {
        const $element = $body.find(selector);
        // Check if it's a select element
        const isSelect =
          $element.is("select") || $element.closest("select").length > 0;
        if (isSelect) {
          cy.get(selector)
            .select(value, { force: true })
            .then(() => fillField(index + 1));
        } else {
          cy.get(selector)
            .clear()
            .type(value)
            .then(() => fillField(index + 1));
        }
      } else {
        fillField(index + 1);
      }
    };
    fillField(0);
  });
});

// Enhanced login command that waits for completion
Cypress.Commands.add(
  "loginAndWait",
  (email: string = "admin@admin.com", password: string = "admin123") => {
    cy.login(email, password);
    waitForLogin();
  }
);

// Command to verify authentication state
Cypress.Commands.add("verifyAuthenticated", () => {
  waitForLogin();
  verifyTokenExists();
});

// Command to verify logged out state
Cypress.Commands.add("verifyLoggedOut", () => {
  waitForLoginRedirect();
  verifyAuthDataCleared();
});
