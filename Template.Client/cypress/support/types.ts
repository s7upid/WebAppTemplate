declare global {
  namespace Cypress {
    interface Chainable {
      // Authentication commands
      login(email: string, password: string): Chainable<void>;
      loginAsAdmin(): Chainable<void>;
      loginAsSuperAdmin(): Chainable<void>;
      loginAsUser(): Chainable<void>;
      loginAndWait(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      verifyAuthenticated(): Chainable<void>;
      verifyLoggedOut(): Chainable<void>;

      // User management commands
      createUser(userData: {
        firstName: string;
        lastName: string;
        email: string;
        role: string;
      }): Chainable<void>;
      assignPermission(userId: string, permission: string): Chainable<void>;
      assignRole(userId: string, roleId: string): Chainable<void>;

      // Role management commands
      createRole(roleData: {
        name: string;
        description: string;
      }): Chainable<void>;

      // Form commands
      fillForm(formData: Record<string, string>): Chainable<void>;
      submitForm(): Chainable<void>;

      // Dialog commands
      confirmDialog(): Chainable<void>;
      cancelDialog(): Chainable<void>;

      // Table commands
      clickTableHeader(headerText: string): Chainable<void>;
      clickTableRow(rowIndex: number): Chainable<void>;

      // Pagination commands
      goToNextPage(): Chainable<void>;
      goToPreviousPage(): Chainable<void>;
      goToPage(pageNumber: number): Chainable<void>;

      // Theme commands
      toggleTheme(): Chainable<void>;

      // Validation commands
      shouldHaveValidationError(
        field: string,
        message: string
      ): Chainable<void>;
      shouldHaveErrorMessage(message: string): Chainable<void>;
      shouldHaveSuccessMessage(message: string): Chainable<void>;

      // Utility commands
      tab(): Chainable<void>;
      waitForLoading(): Chainable<void>;
      waitForTable(): Chainable<void>;

      // Viewport commands
      testMobile(): Chainable<void>;
      testTablet(): Chainable<void>;
      testDesktop(): Chainable<void>;

      // Accessibility commands
      injectAxe(): Chainable<void>;
      checkA11y(context?: any, options?: any): Chainable<void>;

      // API mock commands
      mockApi(method: string, url: string, response: any): Chainable<void>;
      mockUsersApi(users: any[]): Chainable<void>;
      mockRolesApi(roles: any[]): Chainable<void>;
    }
  }
}

export {};
