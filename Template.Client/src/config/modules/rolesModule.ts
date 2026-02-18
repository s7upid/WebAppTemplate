import { Shield } from "lucide-react";
import { ModuleConfig, PermissionConfig } from "./types";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

const PERMISSIONS: PermissionConfig = {
  view: PERMISSION_KEYS.ROLES.VIEW,
  create: PERMISSION_KEYS.ROLES.CREATE,
  edit: PERMISSION_KEYS.ROLES.EDIT,
  delete: PERMISSION_KEYS.ROLES.DELETE,
};

export const ROLES_MODULE: ModuleConfig = {
  id: "roles",
  icon: Shield,

  routes: {
    base: "/roles",
    root: "/roles/*",
    detail: "/roles/:id",
    api: {
      list: (query: string) => `?${query}`,
      byId: (id: string) => `/${id}`,
      create: "",
      update: (id: string) => `/${id}`,
      remove: (id: string) => `/${id}`,
    },
  },

  permissions: PERMISSIONS,

  labels: {
    singular: "Role",
    plural: "Roles",
    menuLabel: "Role Management",
    description: "Manage roles and their associated permissions",
    detailTitle: "Role Details",
    detailDescription: "View and manage role information",
    createButton: "Create Role",
    backButton: "Back to Role List",
  },

  messages: {
    created: "Role created successfully",
    updated: "Role updated successfully",
    deleted: "Role deleted successfully",
  },

  testIds: {
    nav: "nav-roles",
    page: "role-page",
    grid: "role-grid",
    form: "role-form",
    formModal: "role-form-modal",
    detailsPage: "role-details-page",
    createButton: "create-role-button",
    backButton: "back-to-roles-button",
    row: "role-row",
    nameInput: "role-name-input",
    descriptionInput: "role-description-input",
    cancelButton: "cancel-role-button",
    editButton: "edit-role-button",
    deleteButton: "delete-role-button",
    saveButton: "save-role-button",
    closeModal: "close-role-modal",
    name: "role-name",
    description: "role-description",
    userCount: "role-users-count",
    permissionCount: "role-permission-count",
    permissions: "role-permissions",
    actions: "role-actions",
    stats: "role-stats",
    users: "role-users",
    search: "role-search",
    table: "role-table",
    managementPage: "role-management-page",
  },
};

export interface RoleManagementPermissions {
  canViewRoles: boolean;
  canCreateRoles: boolean;
  canEditRoles: boolean;
  canDeleteRoles: boolean;
  canAssignRoles: boolean;
}
