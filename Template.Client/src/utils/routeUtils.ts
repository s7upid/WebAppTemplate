import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MODULES, ModuleId } from "@/config/modules";

export interface RouteInfo {
  isCreatePage: boolean;
  isEditPage: boolean;
  isDetailPage: boolean;
  isPendingPage: boolean;
  isMainPage: boolean;
  entityId?: string;
  entityType: EntityType;
}

export interface NavigationUrls {
  main: string;
  create: string | null;
  edit: string | null;
  detail: string | null;
}

export type EntityType = ModuleId | string;

const buildRouteConfig = (moduleId: string) => {
  const module = MODULES[moduleId];
  if (!module) return null;
  return {
    basePath: module.routes.base,
    detailPath: module.routes.detail ?? null,
    mainPath: module.routes.base,
  };
};

const ROUTE_CONFIGS: Record<string, ReturnType<typeof buildRouteConfig>> = {};
for (const moduleId of Object.keys(MODULES)) {
  ROUTE_CONFIGS[moduleId] = buildRouteConfig(moduleId);
}

export function parseRouteInfo(pathname: string, entityType: EntityType): RouteInfo {
  const config = ROUTE_CONFIGS[entityType];

  if (!config) {
    return {
      isCreatePage: false,
      isEditPage: false,
      isDetailPage: false,
      isPendingPage: false,
      isMainPage: false,
      entityId: undefined,
      entityType,
    };
  }

  const idMatch = pathname.match(new RegExp(`${config.basePath}/([^/]+)$`));
  const entityId = idMatch ? idMatch[1] : undefined;
  const isCreatePage = false;
  const isEditPage = false;
  const isPendingPage = pathname.includes("/pending");
  const isDetailPage =
    config.detailPath && !isPendingPage
      ? !!(pathname.match(new RegExp(`${config.basePath}/[^/]+$`)) && !isEditPage)
      : false;
  const isMainPage = pathname === config.mainPath || pathname === `${config.mainPath}/`;

  return { isCreatePage, isEditPage, isDetailPage, isPendingPage, isMainPage, entityId, entityType };
}

export function useRouteInfo(entityType: EntityType): RouteInfo {
  const location = useLocation();
  return parseRouteInfo(location.pathname, entityType);
}

export function getNavigationUrls(entityType: EntityType, entityId?: string): NavigationUrls {
  const config = ROUTE_CONFIGS[entityType];

  if (!config) {
    return { main: "/", create: null, edit: null, detail: null };
  }

  return {
    main: config.mainPath,
    create: null,
    edit: null,
    detail: entityId && config.detailPath ? config.detailPath.replace(":id", entityId) : null,
  };
}

export function getActiveTab(routeInfo: RouteInfo): "pending" | "all" | null {
  const { entityType, isPendingPage } = routeInfo;
  if (entityType === "users") return isPendingPage ? "pending" : "all";
  return null;
}

export function isNavigationActive(pathname: string, navPath: string): boolean {
  if (navPath === "/") return pathname === "/";

  for (const moduleId of Object.keys(MODULES)) {
    const config = ROUTE_CONFIGS[moduleId];
    if (config && navPath === config.basePath) {
      const routeInfo = parseRouteInfo(pathname, moduleId);
      return routeInfo.isMainPage || routeInfo.isDetailPage || routeInfo.isPendingPage;
    }
  }

  if (navPath !== "/") {
    if (pathname === navPath) return true;
    if (pathname.startsWith(navPath + "/")) return true;
  }

  return false;
}

export function useGenericNavigationFunctions() {
  const navigate = useNavigate();

  const getModulePath = (moduleId: string) => {
    const config = ROUTE_CONFIGS[moduleId];
    return config?.basePath ?? "/";
  };

  return useMemo(
    () => ({
      goToUsers: () => navigate(getModulePath("users")),
      goToRoles: () => navigate(getModulePath("roles")),
      goToPermissions: () => navigate(getModulePath("permissions")),
      goToUserDetail: (userId: string) => navigate(`${getModulePath("users")}/${userId}`),
      goToRoleDetail: (roleId: string) => navigate(`${getModulePath("roles")}/${roleId}`),
      goToUsersPending: () => navigate(`${getModulePath("users")}/pending`),
      goToLogin: () => navigate("/login"),
      goToForgotPassword: () => navigate("/forgot-password"),
      goTo: (path: string) => navigate(path),
      goToHome: () => navigate("/"),
      goBack: () => navigate(-1),
      goToModule: (moduleId: string) => navigate(getModulePath(moduleId)),
      goToModuleDetail: (moduleId: string, entityId: string) =>
        navigate(`${getModulePath(moduleId)}/${entityId}`),
    }),
    [navigate]
  );
}

export function useEntityNavigation(entityType: EntityType, entityId?: string) {
  return { entityType, entityId };
}
