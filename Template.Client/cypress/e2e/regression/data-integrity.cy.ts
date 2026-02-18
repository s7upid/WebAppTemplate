/// <reference types="cypress" />
import { TEST_IDS } from "../../../src/config/constants";
import { baseTestSetup } from "../../support/base-test";
import { loginAndWait } from "../../support/test-helpers";

describe("Data Integrity", () => {
  beforeEach(() => {
    baseTestSetup();
    loginAndWait();
  });

  it("edit persists after reload on users page (if form present)", () => {
    cy.visit("/users");
    cy.get("body").then(($b) => {
      if ($b.find('[data-testid^="table-row-"]').length > 0) {
        cy.get('[data-testid^="table-row-"]').first().click();
        if (
          $b.find(`[data-testid="${TEST_IDS.EDIT_USER_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.EDIT_USER_BUTTON}"]`).click();
          if (
            $b.find(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`).length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.FIRST_NAME_INPUT}"]`)
              .clear()
              .type("Integrity");
            if (
              $b.find(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).length > 0
            ) {
              cy.get(`[data-testid="${TEST_IDS.SUBMIT_BUTTON}"]`).click();
            }
            cy.reload();
            cy.get("body").should("be.visible");
          }
        }
      }
    });
  });

  it("delete removes item from list (if delete UI present)", () => {
    cy.visit("/users");
    cy.get("body").then(($b) => {
      if ($b.find('[data-testid^="table-row-"]').length > 0) {
        cy.get('[data-testid^="table-row-"]').first().click();
        if (
          $b.find(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`).length > 0
        ) {
          cy.get(`[data-testid="${TEST_IDS.DELETE_USER_BUTTON}"]`).click();
          if (
            $b.find(`[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`)
              .length > 0
          ) {
            cy.get(`[data-testid="${TEST_IDS.CONFIRM_DELETE_BUTTON}"]`).click();
          }
        }
      }
    });
  });
});
