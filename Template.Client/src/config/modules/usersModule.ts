import { Users, Clock, User, Shield, Key } from "lucide-react";
import { ModuleConfig, PermissionConfig } from "./types";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

const PERMISSIONS: PermissionConfig = {
  view: PERMISSION_KEYS.USERS.VIEW,
  create: PERMISSION_KEYS.USERS.CREATE,
  edit: PERMISSION_KEYS.USERS.EDIT,
  delete: PERMISSION_KEYS.USERS.DELETE,
  assignRole: PERMISSION_KEYS.USERS.ASSIGN_ROLE,
  approve: PERMISSION_KEYS.USERS.APPROVE,
};

const PERMISSIONS_MODULE_PERMISSIONS = {
  assign: PERMISSION_KEYS.PERMISSIONS.ASSIGN,
};

export const USERS_MODULE: ModuleConfig = {
  id: "users",
  icon: Users,

  routes: {
    base: "/users",
    root: "/users/*",
    detail: "/users/:id",
    api: {
      list: (query: string) => `?${query}`,
      byId: (id: string) => `/${id}`,
      create: "",
      update: (id: string) => `/${id}`,
      remove: (id: string) => `/${id}`,
      profile: "/profile",
      approve: (userId: string) => `/${userId}/approve`,
      reject: (userId: string) => `/${userId}/reject`,
    },
  },

  permissions: PERMISSIONS,

  labels: {
    singular: "User",
    plural: "Users",
    menuLabel: "User Management",
    description: "Manage users, roles, and permissions",
    detailTitle: "User Details",
    detailDescription: "View and manage user information",
    createButton: "Create User",
    backButton: "Back to Users",
  },

  messages: {
    created: "User created successfully",
    updated: "User updated successfully",
    deleted: "User deleted successfully",
    approved: "User approved successfully",
    rejected: "User rejected successfully",
  },

  testIds: {
    nav: "nav-users",
    page: "user-page",
    grid: "user-grid",
    form: "user-form",
    formModal: "user-form-modal",
    detailsPage: "user-details-page",
    createButton: "create-user-button",
    backButton: "back-to-users-button",
    row: "user-row",
    tabs: "user-management-tabs",
    pendingPage: "pending-users-page",
    pendingCard: "pending-user-card",
    roleModal: "user-role-modal",
    permissionModal: "user-permission-modal",
    firstNameInput: "user-firstname-input",
    lastNameInput: "user-lastname-input",
    emailInput: "user-email-input",
    roleSelect: "user-role-select",
    editButton: "edit-user-button",
    deleteButton: "delete-user-button",
    manageRolesButton: "manage-roles-button",
    managePermissionsButton: "manage-permissions-button",
    approveButton: "approve-user-button",
  },

  pageTabs: [
    {
      id: "all",
      label: "All Users",
      icon: Users,
      path: "/users",
      testId: "all-tab",
    },
    {
      id: "pending",
      label: "Pending Approvals",
      icon: Clock,
      path: "/users/pending",
      permission: PERMISSIONS.approve,
      testId: "pending-tab",
      filter: { status: "pending" },
    },
  ],

  detailTabs: [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      testId: "user-profile-tab",
    },
    {
      id: "roles",
      label: "Roles",
      icon: Shield,
      permission: PERMISSIONS.assignRole,
      testId: "user-roles-tab",
    },
    {
      id: "permissions",
      label: "Permissions",
      icon: Key,
      permission: PERMISSIONS_MODULE_PERMISSIONS.assign,
      testId: "user-permissions-tab",
    },
  ],
};

export interface UserManagementPermissions {
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canApproveUsers: boolean;
  canRejectUsers: boolean;
  canViewPendingUsers: boolean;
}
