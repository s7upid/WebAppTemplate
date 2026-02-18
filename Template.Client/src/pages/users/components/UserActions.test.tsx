import { render, screen, fireEvent } from "@testing-library/react";
import UserActions from "./UserActions";
import {  UserResponse } from "@/models";
import { mockUsers } from "@/mock";
import { TEST_IDS } from "@/config";

jest.mock("@/components", () => ({
  ActionButtons: ({ actions, testId }: any) => (
    <div data-testid={testId}>
      {actions.map((action: any) => (
        <button
          key={action.id}
          data-testid={action.testId}
          onClick={action.onClick}
        >
          {action.title}
        </button>
      ))}
    </div>
  ),
  DangerZone: ({ title, description, buttonLabel, onConfirm, testId }: any) => (
    <div>
      <h4>{title}</h4>
      <p>{description}</p>
      <button data-testid={testId} onClick={onConfirm}>
        {buttonLabel}
      </button>
    </div>
  ),
  Card: ({ children, title }: any) => (
    <div>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  ),
}));

const mockUser: UserResponse = { ...mockUsers[1] };

const mockPermissions = {
  canViewUsers: true,
  canCreateUsers: true,
  canEditUsers: true,
  canDeleteUsers: true,
  canEditUserRoles: true,
  canEditUserPermissions: true,
  canApproveUsers: true,
  canRejectUsers: true,
  canViewUserDetails: true,
  canViewRoles: true,
  canViewPermissions: true,
  canViewPendingUsers: true,
};

describe("UserActions", () => {
  it("renders all visible user action buttons", () => {
    render(
      <UserActions
        user={mockUser}
        onEditUser={jest.fn()}
        onDeleteUser={jest.fn()}
        onManageRoles={jest.fn()}
        onManagePermissions={jest.fn()}
        permissions={mockPermissions}
      />
    );

    expect(screen.getByText("Edit User")).toBeTruthy();
    expect(screen.getByText("Manage Roles")).toBeTruthy();
    expect(screen.getByText("Manage Permissions")).toBeTruthy();
    expect(screen.getByRole("button", { name: /delete user/i })).toBeTruthy();
  });

  it("calls onEditUser when Edit User is clicked", () => {
    const onEditUser = jest.fn();

    render(
      <UserActions
        user={mockUser}
        onEditUser={onEditUser}
        onDeleteUser={jest.fn()}
        onManageRoles={jest.fn()}
        onManagePermissions={jest.fn()}
        permissions={mockPermissions}
      />
    );

    fireEvent.click(screen.getByText("Edit User"));
    expect(onEditUser).toHaveBeenCalledWith(mockUser);
  });

  it("calls onDeleteUser when Delete User is clicked", () => {
    const onDeleteUser = jest.fn();

    render(
      <UserActions
        user={mockUser}
        onEditUser={jest.fn()}
        onDeleteUser={onDeleteUser}
        onManageRoles={jest.fn()}
        onManagePermissions={jest.fn()}
        permissions={mockPermissions}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete user/i });
    fireEvent.click(deleteButton);
    expect(onDeleteUser).toHaveBeenCalledWith(mockUser);
  });

  it("calls onManageRoles when Manage Roles is clicked", () => {
    const onManageRoles = jest.fn();

    render(
      <UserActions
        user={mockUser}
        onEditUser={jest.fn()}
        onDeleteUser={jest.fn()}
        onManageRoles={onManageRoles}
        onManagePermissions={jest.fn()}
        permissions={mockPermissions}
      />
    );

    fireEvent.click(screen.getByText("Manage Roles"));
    expect(onManageRoles).toHaveBeenCalledWith(mockUser);
  });

  it("calls onManagePermissions when Manage Permissions is clicked", () => {
    const onManagePermissions = jest.fn();

    render(
      <UserActions
        user={mockUser}
        onEditUser={jest.fn()}
        onDeleteUser={jest.fn()}
        onManageRoles={jest.fn()}
        onManagePermissions={onManagePermissions}
        permissions={mockPermissions}
      />
    );

    fireEvent.click(screen.getByText("Manage Permissions"));
    expect(onManagePermissions).toHaveBeenCalledWith(mockUser);
  });

  it("hides actions when permissions disallow them", () => {
    const limitedPermissions = {
      canViewUsers: true,
      canCreateUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canEditUserRoles: false,
      canEditUserPermissions: false,
      canApproveUsers: false,
      canRejectUsers: false,
      canViewUserDetails: true,
      canViewRoles: false,
      canViewPermissions: false,
      canViewPendingUsers: false,
    };

    render(
      <UserActions
        user={mockUser}
        onEditUser={jest.fn()}
        onDeleteUser={jest.fn()}
        onManageRoles={jest.fn()}
        onManagePermissions={jest.fn()}
        permissions={limitedPermissions}
      />
    );

    expect(screen.queryByText("Edit User")).not.toBeTruthy();
    expect(screen.queryByText("Manage Roles")).not.toBeTruthy();
    expect(screen.queryByText("Manage Permissions")).not.toBeTruthy();
    expect(screen.queryByText("Delete User")).not.toBeTruthy();
  });

  it("renders danger zone when canDeleteUsers is true", () => {
    render(
      <UserActions
        user={mockUser}
        onEditUser={jest.fn()}
        onDeleteUser={jest.fn()}
        onManageRoles={jest.fn()}
        onManagePermissions={jest.fn()}
        permissions={mockPermissions}
      />
    );

    expect(screen.getByText("Danger Zone")).toBeTruthy();
    expect(screen.getByRole("button", { name: /delete user/i })).toBeTruthy();
  });

  it("does not render danger zone when canDeleteUsers is false", () => {
    const noDeletePermissions = {
      ...mockPermissions,
      canDeleteUsers: false,
      canRejectUsers: true,
      canViewUserDetails: true,
    };

    render(
      <UserActions
        user={mockUser}
        onEditUser={jest.fn()}
        onDeleteUser={jest.fn()}
        onManageRoles={jest.fn()}
        onManagePermissions={jest.fn()}
        permissions={noDeletePermissions}
      />
    );

    expect(screen.queryByText("Danger Zone")).not.toBeTruthy();
    expect(screen.queryByRole("button", { name: /delete user/i })).toBeNull();
  });

  it("exposes correct test IDs for buttons", () => {
    render(
      <UserActions
        user={mockUser}
        onEditUser={jest.fn()}
        onDeleteUser={jest.fn()}
        onManageRoles={jest.fn()}
        onManagePermissions={jest.fn()}
        permissions={mockPermissions}
      />
    );

    expect(screen.getByTestId(TEST_IDS.EDIT_USER_BUTTON)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.MANAGE_ROLES_BUTTON)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.MANAGE_PERMISSIONS_BUTTON)).toBeTruthy();
    expect(screen.getByTestId(TEST_IDS.DELETE_USER_BUTTON)).toBeTruthy();
  });
});
