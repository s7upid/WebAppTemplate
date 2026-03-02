/**
 * Stub implementations for @/components exports (app-specific only).
 * Solstice UI components are imported from "solstice-ui" and use that package's mock.
 * Example: jest.mock("@/components", () => ({ ...require("@/test/__mocks__/component-stubs").default, EntityToolbar: ... }));
 */
import React from "react";

const Noop = () => null;
const Fragment = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

export default {
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
