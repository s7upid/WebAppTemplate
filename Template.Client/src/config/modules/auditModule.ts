import { FileText, History, Search } from "lucide-react";
import { ModuleConfig, PermissionConfig } from "./types";

const PERMISSIONS: PermissionConfig = {
  view: "audit:view",
};

export const AUDIT_MODULE: ModuleConfig = {
  id: "audit",
  icon: FileText,

  routes: {
    base: "/audit-logs",
    root: "/audit-logs/*",
    api: { list: (query: string) => `?${query}` },
  },

  permissions: PERMISSIONS,

  labels: {
    singular: "Audit Log",
    plural: "Audit Logs",
    menuLabel: "Audit Logs",
    description: "View system audit logs and activity history",
  },

  testIds: {
    nav: "nav-audit-logs",
    page: "audit-logs-page",
    grid: "audit-logs-grid",
  },

  submenus: [
    {
      id: "audit-all",
      label: "All Logs",
      icon: History,
      path: "/audit-logs",
      permission: PERMISSIONS.view,
      testId: "nav-audit-all",
    },
    {
      id: "audit-search",
      label: "Search Logs",
      icon: Search,
      path: "/audit-logs/search",
      permission: PERMISSIONS.view,
      testId: "nav-audit-search",
    },
  ],

  pageTabs: [
    { id: "all", label: "All Logs", icon: History, path: "/audit-logs", testId: "audit-all-tab" },
    {
      id: "users",
      label: "User Activity",
      icon: FileText,
      path: "/audit-logs?category=users",
      testId: "audit-users-tab",
      filter: { category: "users" },
    },
    {
      id: "roles",
      label: "Role Changes",
      icon: FileText,
      path: "/audit-logs?category=roles",
      testId: "audit-roles-tab",
      filter: { category: "roles" },
    },
  ],
};
