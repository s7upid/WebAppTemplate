/**
 * Type declarations for solstice-ui (local package or mock).
 * Resolves when the package is linked via file:../../solstice-ui or in tests.
 */
declare module "solstice-ui" {
  import type { ComponentType, FormEvent, ReactNode, ReactElement } from "react";

  export type TabItem = {
    id: string;
    label: string;
    testId?: string;
    icon?: ComponentType<{ className?: string }>;
    isVisible?: boolean;
  };

  export interface DialogFooterAction {
    label: string;
    onClick: () => void;
    variant?: string;
    loading?: boolean;
  }

  export function DataPage<T = unknown>(props: {
    items: T[];
    renderCard?: (item: T) => ReactNode;
    keyExtractor?: (item: T) => React.Key;
    emptyTitle?: string;
    emptyDescription?: string;
    loading?: boolean;
    contentBetweenHeaderAndContent?: ReactNode;
    currentPage?: number;
    totalPages?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    layout?: "grid" | "list";
    columns?: number;
  }): ReactElement;

  export const LoadingSpinner: ComponentType<{
    text?: string;
    size?: string;
    className?: string;
    showMessage?: boolean;
    "data-testid"?: string;
    [key: string]: unknown;
  }>;
  export const Card: ComponentType<Record<string, unknown>>;
  export const Pagination: ComponentType<Record<string, unknown>>;
  export const Button: ComponentType<Record<string, unknown>>;
  export const Alert: ComponentType<Record<string, unknown>>;
  export const Badge: ComponentType<Record<string, unknown>>;
  export const Input: ComponentType<Record<string, unknown>>;
  export const DangerZone: ComponentType<Record<string, unknown>>;
  export const Dialog: ComponentType<{
    children?: ReactNode;
    isOpen?: boolean;
    title?: string;
    onClose?: () => void;
    size?: string;
    footerActions?: DialogFooterAction[];
  }>;
  export const ErrorBoundary: ComponentType<{ children: ReactNode }>;
  export const Form: ComponentType<{ onSubmit?: (e: FormEvent) => void; children?: ReactNode }>;
  export const List: ComponentType<Record<string, unknown>>;
  export const ModalPortal: ComponentType<{ children?: ReactNode }>;
  export const PageHeader: ComponentType<Record<string, unknown>>;
  export const Progress: ComponentType<Record<string, unknown>>;
  export const SearchInput: ComponentType<Record<string, unknown>>;
  export const EmptyState: ComponentType<Record<string, unknown>>;
  export const Dropdown: ComponentType<Record<string, unknown>>;
  export const TabNavigation: ComponentType<Record<string, unknown>>;
  export const ThemeToggle: ComponentType<Record<string, unknown>>;
  export const Toast: ComponentType<Record<string, unknown>>;
}
