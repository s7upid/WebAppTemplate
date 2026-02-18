import { Key } from "lucide-react";
import { ModuleConfig, PermissionConfig } from "./types";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

const PERMISSIONS: PermissionConfig = {
  view: PERMISSION_KEYS.PERMISSIONS.VIEW,
  assign: PERMISSION_KEYS.PERMISSIONS.ASSIGN,
};

export const PERMISSIONS_MODULE: ModuleConfig = {
  id: "permissions",
  icon: Key,

  routes: {
    base: "/permissions",
    root: "/permissions/*",
    api: { list: (query: string) => `?${query}` },
  },

  permissions: PERMISSIONS,

  labels: {
    singular: "Permission",
    plural: "Permissions",
    menuLabel: "Permission Management",
    description: "Manage system permissions",
    createButton: "Create Permission",
    backButton: "Back to Permission List",
  },

  messages: {
    created: "Permission created successfully",
    updated: "Permission updated successfully",
    deleted: "Permission deleted successfully",
  },

  testIds: {
    nav: "nav-permissions",
    page: "permission-page",
    grid: "permission-grid-page",
    form: "permission-form",
    createButton: "create-permission-button",
    backButton: "back-to-permissions-button",
    row: "permission-row",
    stats: "permission-stats",
    categories: "permission-categories",
    list: "permission-list",
    item: "permission-item",
    category: "permission-category",
    name: "permission-name",
    description: "permission-description",
    count: "permission-count",
    checkbox: "permission-checkbox",
    selector: "permission-selector",
    saveButton: "save-permissions-button",
    exportButton: "export-config-button",
    importButton: "import-config-button",
  },
};

export interface PermissionManagementPermissions {
  canViewPermissions: boolean;
}
