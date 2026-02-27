/**
 * Stub implementations for @/components exports.
 * Use in tests to avoid requireActual("@/components") which causes circular init.
 * Example: jest.mock("@/components", () => ({ ...require("@/test/__mocks__/component-stubs").default, Dialog: ... }));
 */
import React from "react";

const Noop = () => null;
const Fragment = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

export default {
  Alert: Noop,
  Badge: Noop,
  Button: (p: { children?: React.ReactNode; [k: string]: unknown }) => <button type="button" {...p}>{p.children}</button>,
  Card: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Input: (p: { label?: string; [k: string]: unknown }) => <label>{p.label}<input {...p} /></label>,
  ConfirmationDialog: Noop,
  DangerZone: Fragment,
  Dialog: Fragment,
  ErrorBoundary: Fragment,
  Form: ({ children, ...p }: { children?: React.ReactNode; [k: string]: unknown }) => <form {...p}>{children}</form>,
  GridPage: () => <div />,
  List: Noop,
  LoadingSpinner: () => <div role="status" data-testid="loading-spinner">Loading...</div>,
  ModalPortal: Fragment,
  PageHeader: ({ title }: { title?: string }) => <h1>{title}</h1>,
  Pagination: Noop,
  Progress: Noop,
  SearchInput: (p: { placeholder?: string; [k: string]: unknown }) => <input {...p} />,
  EmptyState: Noop,
  Dropdown: Noop,
  TabNavigation: Noop,
  ThemeToggle: Noop,
  Toast: Noop,
  PaginatedGrid: () => <div />,
  QuickActions: Noop,
  AuditLogCard: Noop,
  AuditLogTimeline: Noop,
  AvatarUploader: Noop,
  BasePage: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  EntityToolbar: () => <div className="toolbar" />,
  PermissionGuard: Fragment,
  RoleGuard: Fragment,
  Layout: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  UserMenu: Noop,
};
