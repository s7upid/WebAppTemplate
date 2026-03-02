export { cn } from "./cn";
export { scrollToTop } from "./scroll";
export { env } from "./env";
export { logger } from "./logger";
export { Portal } from "./portal";
export { SecureStorage } from "./storage";

export {
  handleEntitySave,
  handleEntityDelete,
  handleSubmitForm,
  extractErrorMessage,
  inferFieldFromError,
} from "./entityOperations";

export type {
  EntitySaveOptions,
  EntityDeleteOptions,
  FormSubmitOptions,
  SaveResult,
} from "./entityOperations";

export type { RouteInfo, NavigationUrls, EntityType } from "./routeUtils";
export {
  useGenericNavigationFunctions,
  useRouteInfo,
  parseRouteInfo,
  getNavigationUrls,
  getActiveTab,
  isNavigationActive,
  useEntityNavigation,
} from "./routeUtils";

export {
  isRateLimitError,
  isTokenRevocationError,
  getErrorMessage,
  getErrorToastType,
  getErrorTitle,
} from "./errorHandling";

export {
  getEventIcon,
  formatValue,
  isJson,
  isDataUrlImage,
  isProbablyBase64,
  renderChangeValue,
} from "./auditLogUtils";

export type { PermissionKey } from "@/models/shared/api";
