export * from "./constants";
export * from "./headerConfigs";
export * from "./navigation";
export * from "./modules";
export * from "./queryClient";

export {
  PERMISSION_KEYS,
  ROLE_NAMES,
  ALL_PERMISSION_KEYS,
  type PermissionKey,
  type RoleName,
} from "./generated/permissionKeys.generated";

import { ROLE_NAMES } from "./generated/permissionKeys.generated";

export const ROLE_KEYS = ROLE_NAMES;

export const ROLE_GROUPS = {
  ADMIN: [ROLE_NAMES.ADMINISTRATOR],
  MANAGEMENT: [ROLE_NAMES.ADMINISTRATOR, ROLE_NAMES.OPERATOR],
  STAFF: [ROLE_NAMES.SUPPORT, ROLE_NAMES.REGULATOR],
  ALL: [ROLE_NAMES.ADMINISTRATOR, ROLE_NAMES.OPERATOR, ROLE_NAMES.SUPPORT, ROLE_NAMES.REGULATOR],
} as const;

export type RoleKey = (typeof ROLE_KEYS)[keyof typeof ROLE_KEYS];
export type RoleGroup = (typeof ROLE_GROUPS)[keyof typeof ROLE_GROUPS];
