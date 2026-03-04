import type { ComponentType } from "react";
import { NavigationItem } from "@/models";
import AuditLogsPage from "@/pages/audit/AuditLogsPage";
import PermissionContainer from "@/pages/permissions/PermissionContainer";
import RoleContainer from "@/pages/roles/RoleContainer";
import UserContainer from "@/pages/users/UserContainer";
import DashboardContainer from "@/pages/dashboards/DashboardContainer";
import { ROLE_NAMES as ROLE_KEYS } from "@/config/generated/permissionKeys.generated";
import {
  DASHBOARD_MODULE,
  DASHBOARD_MANAGEMENT_MODULE,
  ACCESS_MODULE,
  AUDIT_MODULE,
} from "@/config/modules";
import { SubmenuConfig } from "@/config/modules/types";

const MODULE_COMPONENTS: Record<string, ComponentType> = {
  dashboard: DashboardContainer,
  "dashboard-management": DashboardContainer,
  "dashboard-administrator": DashboardContainer,
  "dashboard-support": DashboardContainer,
  "dashboard-regulator": DashboardContainer,
  "dashboard-operator": DashboardContainer,
  access: UserContainer,
  users: UserContainer,
  roles: RoleContainer,
  permissions: PermissionContainer,
  audit: AuditLogsPage,
};

const getComponentForModule = (moduleId: string): ComponentType => {
  return MODULE_COMPONENTS[moduleId] || DashboardContainer;
};

const createNavigationChildren = (
  submenus: SubmenuConfig[],
  defaultComponent?: ComponentType,
  skipRouteRegistration = false
): NavigationItem[] => {
  return submenus.map((submenu) => ({
    id: submenu.id,
    name: submenu.label,
    href: submenu.path,
    routePath: skipRouteRegistration ? undefined : `${submenu.path}/*`,
    icon: submenu.icon,
    permission: submenu.permission,
    component: getComponentForModule(submenu.id) || defaultComponent || DashboardContainer,
    testId: submenu.testId,
    showInNav: true,
  }));
};

const generateNavigationConfig = (): NavigationItem[] => {
  return [
    {
      id: DASHBOARD_MODULE.id,
      name: DASHBOARD_MODULE.labels.menuLabel,
      href: DASHBOARD_MODULE.routes.base,
      routePath: DASHBOARD_MODULE.routes.root,
      icon: DASHBOARD_MODULE.icon,
      permission: DASHBOARD_MODULE.permissions.view,
      component: getComponentForModule(DASHBOARD_MODULE.id),
      testId: DASHBOARD_MODULE.testIds.nav,
      showInNav: true,
    },
    {
      id: DASHBOARD_MANAGEMENT_MODULE.id,
      name: DASHBOARD_MANAGEMENT_MODULE.labels.menuLabel,
      href: DASHBOARD_MANAGEMENT_MODULE.routes.base,
      routePath: DASHBOARD_MANAGEMENT_MODULE.routes.root,
      icon: DASHBOARD_MANAGEMENT_MODULE.icon,
      permission: DASHBOARD_MANAGEMENT_MODULE.permissions.view,
      component: getComponentForModule(DASHBOARD_MANAGEMENT_MODULE.id),
      testId: DASHBOARD_MANAGEMENT_MODULE.testIds.nav,
      showInNav: true,
      devOnlySuperAdmin: true,
      children: DASHBOARD_MANAGEMENT_MODULE.submenus
        ? createNavigationChildren(DASHBOARD_MANAGEMENT_MODULE.submenus, DashboardContainer, true)
        : [],
    },
    {
      id: ACCESS_MODULE.id,
      name: ACCESS_MODULE.labels.menuLabel,
      href: ACCESS_MODULE.routes.base,
      routePath: ACCESS_MODULE.routes.root,
      icon: ACCESS_MODULE.icon,
      permission: ACCESS_MODULE.permissions.view,
      component: getComponentForModule(ACCESS_MODULE.id),
      testId: ACCESS_MODULE.testIds.nav,
      showInNav: true,
      children: ACCESS_MODULE.submenus ? createNavigationChildren(ACCESS_MODULE.submenus) : [],
    },
    {
      id: AUDIT_MODULE.id,
      name: AUDIT_MODULE.labels.menuLabel,
      href: AUDIT_MODULE.routes.base,
      routePath: AUDIT_MODULE.routes.root,
      icon: AUDIT_MODULE.icon,
      roles: [ROLE_KEYS.ADMINISTRATOR],
      component: getComponentForModule(AUDIT_MODULE.id),
      testId: AUDIT_MODULE.testIds.nav,
      showInNav: true,
    },
  ];
};

export const NAVIGATION_CONFIG: NavigationItem[] = generateNavigationConfig();

export const getNavigationByPermissions = (
  hasPermission: (permission: string) => boolean,
  hasRole: (roles: string[]) => boolean,
  options?: { isAdmin?: boolean; isDevelopment?: boolean }
) => {
  return NAVIGATION_CONFIG.filter((item) => {
    if (item.children && item.children.length > 0) {
      const hasAnyChildAccess = item.children.some((child) => {
        if (child.permission && hasPermission(child.permission)) return true;
        if (child.roles && hasRole(child.roles)) return true;
        if (!child.permission && !child.roles) return true;
        return false;
      });
      if (!hasAnyChildAccess) return false;
    } else {
      if (item.permission && !hasPermission(item.permission)) {
        if (!item.roles || !hasRole(item.roles)) return false;
      }
      if (!item.permission && item.roles && !hasRole(item.roles)) return false;
    }

    if (item.devOnlySuperAdmin) {
      if (!(options?.isAdmin && options?.isDevelopment)) return false;
    }

    return item.showInNav !== false;
  });
};

export const getNavigationItem = (id: string) => {
  return NAVIGATION_CONFIG.find((nav) => nav.id === id);
};

export const getNavigationItemByPath = (path: string) => {
  const topLevel = NAVIGATION_CONFIG.find((nav) => nav.href === path);
  if (topLevel) return topLevel;

  for (const nav of NAVIGATION_CONFIG) {
    if (nav.children) {
      const child = nav.children.find((c) => c.href === path);
      if (child) return child;
    }
  }

  return undefined;
};
