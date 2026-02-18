import { Home, BarChart3, Settings, UserCheck, Shield, Monitor } from "lucide-react";
import { ModuleConfig, PermissionConfig } from "./types";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

const PERMISSIONS: PermissionConfig = {
  view: PERMISSION_KEYS.DASHBOARD.VIEW,
};

export const DASHBOARD_MODULE: ModuleConfig = {
  id: "dashboard",
  icon: Home,

  routes: {
    base: "/",
    root: "/dashboard/*",
    api: {
      list: () => "",
      recentLogs: () => `/recent-logs`,
    },
  },

  permissions: PERMISSIONS,

  labels: {
    singular: "Dashboard",
    plural: "Dashboards",
    menuLabel: "Dashboard",
    description: "View system overview and statistics",
  },

  testIds: {
    nav: "nav-dashboard",
    page: "dashboard",
  },
};

export const DASHBOARD_MANAGEMENT_MODULE: ModuleConfig = {
  id: "dashboard-management",
  icon: BarChart3,

  routes: {
    base: "/dashboard-management",
    root: "/dashboard-management/*",
    api: { list: () => "" },
  },

  permissions: PERMISSIONS,

  labels: {
    singular: "Dashboard",
    plural: "Dashboards",
    menuLabel: "Dashboard Management",
    description: "Manage role-specific dashboards",
  },

  testIds: {
    nav: "nav-dashboard-management",
    page: "dashboard-management",
  },

  submenus: [
    {
      id: "dashboard-administrator",
      label: "Administrator Dashboard",
      icon: Settings,
      path: "/dashboard-management/administrator",
      permission: PERMISSIONS.view,
      testId: "nav-dashboard-administrator",
    },
    {
      id: "dashboard-support",
      label: "Support Dashboard",
      icon: UserCheck,
      path: "/dashboard-management/support",
      permission: PERMISSIONS.view,
      testId: "nav-dashboard-support",
    },
    {
      id: "dashboard-regulator",
      label: "Regulator Dashboard",
      icon: Shield,
      path: "/dashboard-management/regulator",
      permission: PERMISSIONS.view,
      testId: "nav-dashboard-regulator",
    },
    {
      id: "dashboard-operator",
      label: "Operator Dashboard",
      icon: Monitor,
      path: "/dashboard-management/operator",
      permission: PERMISSIONS.view,
      testId: "nav-dashboard-operator",
    },
  ],
};
