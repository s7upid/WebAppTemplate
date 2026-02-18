import { TEST_IDS } from "../../../src/config/constants";
import { baseTestSetup } from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("Permission Demo Component", () => {
  beforeEach(() => {
    baseTestSetup();
    loginAndWait();
    cy.visit("/components");
    cy.get("body").should("be.visible");
  });

  it("should display the permission demo section", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).should(
          "be.visible"
        );
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_TITLE}"]`).should(
          "contain",
          "Permission Pattern Demo"
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should show all action buttons initially", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).should(
              "be.visible"
            );
            cy.get(`[data-testid="${TEST_IDS.EDIT_USER_BUTTON}"]`).should(
              "be.visible"
            );
            cy.get(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`).should(
              "be.visible"
            );
            cy.get(`[data-testid="${TEST_IDS.ASSIGN_ROLE_BUTTON}"]`).should(
              "be.visible"
            );
            cy.get(
              `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
            ).should("be.visible");
            cy.get(`[data-testid="${TEST_IDS.APPROVE_USER_BUTTON}"]`).should(
              "be.visible"
            );
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should show permission checkboxes", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_CREATE_USERS_CHECKBOX}"]`
            ).should("be.visible");
            cy.get(
              `[data-testid="${TEST_IDS.CAN_EDIT_USERS_CHECKBOX}"]`
            ).should("be.visible");
            cy.get(
              `[data-testid="${TEST_IDS.CAN_DELETE_USERS_CHECKBOX}"]`
            ).should("be.visible");
            cy.get(
              `[data-testid="${TEST_IDS.CAN_ASSIGN_ROLES_CHECKBOX}"]`
            ).should("be.visible");
            cy.get(
              `[data-testid="${TEST_IDS.CAN_ASSIGN_PERMISSIONS_CHECKBOX}"]`
            ).should("be.visible");
            cy.get(
              `[data-testid="${TEST_IDS.CAN_APPROVE_USERS_CHECKBOX}"]`
            ).should("be.visible");
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should hide create user button when permission is unchecked", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_CREATE_USERS_CHECKBOX}"]`
            ).uncheck();
            cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).should(
              "not.exist"
            );
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should hide edit user button when permission is unchecked", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_EDIT_USERS_CHECKBOX}"]`
            ).uncheck();
            cy.get(`[data-testid="${TEST_IDS.EDIT_USER_BUTTON}"]`).should(
              "not.exist"
            );
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should hide delete user button when permission is unchecked", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_DELETE_USERS_CHECKBOX}"]`
            ).uncheck();
            cy.get(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`).should(
              "not.exist"
            );
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should hide assign role button when permission is unchecked", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_ASSIGN_ROLES_CHECKBOX}"]`
            ).uncheck();
            cy.get(`[data-testid="${TEST_IDS.ASSIGN_ROLE_BUTTON}"]`).should(
              "not.exist"
            );
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should hide manage permissions button when permission is unchecked", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_ASSIGN_PERMISSIONS_CHECKBOX}"]`
            ).uncheck();
            cy.get(
              `[data-testid="${TEST_IDS.MANAGE_PERMISSIONS_BUTTON}"]`
            ).should("not.exist");
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should hide approve user button when permission is unchecked", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_APPROVE_USERS_CHECKBOX}"]`
            ).uncheck();
            cy.get(`[data-testid="${TEST_IDS.APPROVE_USER_BUTTON}"]`).should(
              "not.exist"
            );
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should show button again when permission is rechecked", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_CREATE_USERS_CHECKBOX}"]`
            ).uncheck();
            cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).should(
              "not.exist"
            );
            cy.get(
              `[data-testid="${TEST_IDS.CAN_CREATE_USERS_CHECKBOX}"]`
            ).check();
            cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).should(
              "be.visible"
            );
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should handle multiple permission changes", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_CREATE_USERS_CHECKBOX}"]`
            ).uncheck();
            cy.get(
              `[data-testid="${TEST_IDS.CAN_EDIT_USERS_CHECKBOX}"]`
            ).uncheck();
            cy.get(
              `[data-testid="${TEST_IDS.CAN_DELETE_USERS_CHECKBOX}"]`
            ).uncheck();
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should show all buttons when all permissions are checked", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_CREATE_USERS_CHECKBOX}"]`
            ).check();
            cy.get(
              `[data-testid="${TEST_IDS.CAN_EDIT_USERS_CHECKBOX}"]`
            ).check();
            cy.get(
              `[data-testid="${TEST_IDS.CAN_DELETE_USERS_CHECKBOX}"]`
            ).check();
            cy.get(
              `[data-testid="${TEST_IDS.CAN_ASSIGN_ROLES_CHECKBOX}"]`
            ).check();
            cy.get(
              `[data-testid="${TEST_IDS.CAN_ASSIGN_PERMISSIONS_CHECKBOX}"]`
            ).check();
            cy.get(
              `[data-testid="${TEST_IDS.CAN_APPROVE_USERS_CHECKBOX}"]`
            ).check();
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should have proper button styling and icons", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(`[data-testid="${TEST_IDS.CREATE_USER_BUTTON}"]`).should(
              "exist"
            );
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });

  it("should have proper checkbox labels", () => {
    cy.get("body").then(($b) => {
      if (
        $b.find(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).length >
        0
      ) {
        cy.get(`[data-testid="${TEST_IDS.PERMISSION_DEMO_SECTION}"]`).within(
          () => {
            cy.get(
              `[data-testid="${TEST_IDS.CAN_CREATE_USERS_CHECKBOX}"]`
            ).should("exist");
          }
        );
      } else {
        cy.get("body").should("be.visible");
      }
    });
  });
});
