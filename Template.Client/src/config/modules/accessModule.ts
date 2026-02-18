import { Users, Shield, Key } from "lucide-react";
import { ModuleConfig } from "./types";
import { PERMISSION_KEYS } from "@/config/generated/permissionKeys.generated";

const CHILD_PERMISSIONS = {
  users: { view: PERMISSION_KEYS.USERS.VIEW },
  roles: { view: PERMISSION_KEYS.ROLES.VIEW },
  permissions: { view: PERMISSION_KEYS.PERMISSIONS.VIEW },
};

export const ACCESS_MODULE: ModuleConfig = {
  id: "access",
  icon: Users,

  routes: {
    base: "/users",
    root: "/users/*",
    api: { list: () => "" },
  },

  permissions: { view: "" },

  labels: {
    singular: "Access",
    plural: "Access",
    menuLabel: "Access Management",
    description: "Manage users, roles, and permissions",
  },

  testIds: {
    nav: "nav-access",
    page: "access-page",
  },

  submenus: [
    {
      id: "users",
      label: "User Management",
      icon: Users,
      path: "/users",
      permission: CHILD_PERMISSIONS.users.view,
      testId: "nav-users",
    },
    {
      id: "roles",
      label: "Role Management",
      icon: Shield,
      path: "/roles",
      permission: CHILD_PERMISSIONS.roles.view,
      testId: "nav-roles",
    },
    {
      id: "permissions",
      label: "Permission Management",
      icon: Key,
      path: "/permissions",
      permission: CHILD_PERMISSIONS.permissions.view,
      testId: "nav-permissions",
    },
  ],
};
