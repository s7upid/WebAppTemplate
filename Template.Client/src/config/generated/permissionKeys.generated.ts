/**
 * AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 * 
 * Generated from: Template.Data/Constants/PermissionKeys.cs
 * Generated at: 2026-01-12T08:45:09.811Z
 * 
 * To regenerate: node generate-constants.js
 */

/**
 * Permission Keys - Single source of truth for all permission constants.
 * These match the backend C# PermissionKeys class exactly.
 */
export const PERMISSION_KEYS = {
  DASHBOARD: {
    VIEW: "dashboard:view",
  },
  USERS: {
    VIEW: "users:view",
    CREATE: "users:create",
    EDIT: "users:edit",
    DELETE: "users:delete",
    ASSIGN_ROLE: "users:assign-role",
    APPROVE: "users:approve",
  },
  ROLES: {
    VIEW: "roles:view",
    CREATE: "roles:create",
    EDIT: "roles:edit",
    DELETE: "roles:delete",
  },
  PERMISSIONS: {
    VIEW: "permissions:view",
    ASSIGN: "permissions:assign",
  },
  SETTINGS: {
    VIEW: "settings:view",
    EDIT: "settings:edit",
  },
  REPORTS: {
    VIEW: "reports:view",
    EXPORT: "reports:export",
  },
} as const;

/**
 * Role Names - Single source of truth for all role name constants.
 */
export const ROLE_NAMES = {
  ADMINISTRATOR: "administrator",
  SUPPORT: "support",
  REGULATOR: "regulator",
  OPERATOR: "operator",
} as const;

/**
 * Type helpers for type-safe permission checking
 */
export type PermissionKey = typeof PERMISSION_KEYS[keyof typeof PERMISSION_KEYS][keyof typeof PERMISSION_KEYS[keyof typeof PERMISSION_KEYS]];
export type RoleName = typeof ROLE_NAMES[keyof typeof ROLE_NAMES];

/**
 * Flat array of all permission keys (for validation)
 */
export const ALL_PERMISSION_KEYS: PermissionKey[] = Object.values(PERMISSION_KEYS).flatMap(
  category => Object.values(category)
) as PermissionKey[];
