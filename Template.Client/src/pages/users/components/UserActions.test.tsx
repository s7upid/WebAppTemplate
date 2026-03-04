import { render, screen, fireEvent } from "@testing-library/react";
import UserActions from "./UserActions";
import {  UserResponse } from "@/models";
import { mockUsers } from "@/mock";
import { TEST_IDS } from "@/config";

jest.mock("@/components", () => ({
  QuickActions: ({ actions, testId }: any) => (
    <div data-testid={testId}>
      {actions.map((a: any) => (
        <button key={a.id} type="button" data-testid={a.testId} onClick={a.onClick}>
          {a.description ? `${a.title} — ${a.description}` : a.title}
        </button>
      ))}
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

    expect(screen.getByRole("button", { name: /edit user/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /manage roles/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /manage permissions/i })).toBeTruthy();
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

    fireEvent.click(screen.getByRole("button", { name: /edit user/i }));
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

    fireEvent.click(screen.getByRole("button", { name: /manage roles/i }));
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

    fireEvent.click(screen.getByRole("button", { name: /manage permissions/i }));
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

    expect(screen.queryByRole("button", { name: /edit user/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /manage roles/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /manage permissions/i })).toBeNull();
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

    expect(screen.getByTestId("card-title")).toHaveTextContent("Danger Zone");
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

    expect(screen.queryByTestId("card-title")).toBeNull();
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
