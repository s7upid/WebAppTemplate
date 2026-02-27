export * from "./types";
export * from "./dashboardModule";
export * from "./accessModule";
export * from "./usersModule";
export * from "./rolesModule";
export * from "./permissionsModule";
export * from "./auditModule";

export type { UserManagementPermissions } from "./usersModule";
export type { RoleManagementPermissions } from "./rolesModule";
export type { PermissionManagementPermissions } from "./permissionsModule";

import { DASHBOARD_MODULE, DASHBOARD_MANAGEMENT_MODULE } from "./dashboardModule";
import { ACCESS_MODULE } from "./accessModule";
import { USERS_MODULE } from "./usersModule";
import { ROLES_MODULE } from "./rolesModule";
import { PERMISSIONS_MODULE } from "./permissionsModule";
import { AUDIT_MODULE } from "./auditModule";
import { ModuleConfig, ModuleConfigMap, PageTabConfig, DetailTabConfig, SubmenuConfig } from "./types";

export const MODULES: ModuleConfigMap = {
  dashboard: DASHBOARD_MODULE,
  "dashboard-management": DASHBOARD_MANAGEMENT_MODULE,
  access: ACCESS_MODULE,
  users: USERS_MODULE,
  roles: ROLES_MODULE,
  permissions: PERMISSIONS_MODULE,
  audit: AUDIT_MODULE,
};

export const getModule = (moduleId: string): ModuleConfig | undefined => MODULES[moduleId];
export const getModuleRoutes = (moduleId: string) => MODULES[moduleId]?.routes;
export const getModulePermissions = (moduleId: string) => MODULES[moduleId]?.permissions;
export const getModuleLabels = (moduleId: string) => MODULES[moduleId]?.labels;
export const getModuleTestIds = (moduleId: string) => MODULES[moduleId]?.testIds;
export const getModulePageTabs = (moduleId: string): PageTabConfig[] | undefined => MODULES[moduleId]?.pageTabs;
export const getModuleDetailTabs = (moduleId: string): DetailTabConfig[] | undefined => MODULES[moduleId]?.detailTabs;
export const getModuleSubmenus = (moduleId: string): SubmenuConfig[] | undefined => MODULES[moduleId]?.submenus;

export type ModuleId = keyof typeof MODULES;
