/* Re-exports from Solstice UI (https://github.com/s7upid/solstice-ui) */
export {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  ConfirmationDialog,
  DangerZone,
  Dialog,
  ErrorBoundary,
  Form,
  GridPage,
  List,
  LoadingSpinner,
  ModalPortal,
  PageHeader,
  Pagination,
  Progress,
  SearchInput,
  EmptyState,
  Dropdown,
  TabNavigation,
  ThemeToggle,
  Toast,
} from "solstice-ui";
export type {
  TabItem,
  TabNavigationProps,
  SelectOption,
  PageHeaderProps,
  ToastItem,
  GridPageProps,
} from "solstice-ui";

/* App-specific components (stay local) */
export { default as PaginatedGrid } from "./PaginatedGrid/PaginatedGrid";
export type { PaginatedGridProps, PaginatedGridHandlers } from "./PaginatedGrid/PaginatedGrid";
export { default as QuickActions } from "./QuickActions/QuickActions";
export type { QuickActionItem } from "./QuickActions/QuickActions";
export { default as AuditLogCard } from "./AuditLogCard/AuditLogCard";
export { default as AuditLogTimeline } from "./AuditLogTimeline/AuditLogTimeline";
export { default as AvatarUploader } from "./AvatarUploader/AvatarUploader";
export { default as BasePage } from "./BasePage/BasePage";
export { default as EntityToolbar } from "./EntityToolbar/EntityToolbar";
export { default as PermissionGuard } from "./Guards/PermissionGuard";
export { default as RoleGuard } from "./Guards/RoleGuard";
export { default as Layout } from "./Layout/Layout";
export { default as UserMenu } from "./Layout/UserMenu";
