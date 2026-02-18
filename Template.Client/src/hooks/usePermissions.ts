import { useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import { RootState } from "@/store";
import { PERMISSION_KEYS, ROLE_NAMES } from "@/config/generated/permissionKeys.generated";

export const usePermissions = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const permissions = useMemo(() => user?.permissionKeys ?? [], [user?.permissionKeys]);
  const role = useMemo(() => user?.role?.name ?? null, [user?.role?.name]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!permission) return true;
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (permsOrFirst: string[] | string, ...rest: string[]): boolean => {
      const perms = Array.isArray(permsOrFirst) ? permsOrFirst : [permsOrFirst, ...rest];
      if (perms.length === 0) return true;
      return perms.some((p) => permissions.includes(p));
    },
    [permissions]
  );

  const hasAllPermissions = useCallback(
    (permsOrFirst: string[] | string, ...rest: string[]): boolean => {
      const perms = Array.isArray(permsOrFirst) ? permsOrFirst : [permsOrFirst, ...rest];
      if (perms.length === 0) return true;
      return perms.every((p) => permissions.includes(p));
    },
    [permissions]
  );

  const hasRole = useCallback(
    (rolesOrFirst: string[] | string, ...rest: string[]): boolean => {
      const roles = Array.isArray(rolesOrFirst) ? rolesOrFirst : [rolesOrFirst, ...rest];
      if (roles.length === 0) return true;
      if (!role) return false;
      return roles.some((r) => r.toLowerCase() === role.toLowerCase());
    },
    [role]
  );

  const isAdmin = useMemo(() => role?.toLowerCase() === ROLE_NAMES.ADMINISTRATOR, [role]);

  return useMemo(
    () => ({
      permissions,
      role,
      user,
      isAdmin,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasRole,
    }),
    [permissions, role, user, isAdmin, hasPermission, hasAnyPermission, hasAllPermissions, hasRole]
  );
};

export const useUserManagementPermissions = () => {
  const { hasPermission, hasRole, isAdmin } = usePermissions();

  return useMemo(
    () => ({
      canViewUsers: hasPermission(PERMISSION_KEYS.USERS.VIEW),
      canCreateUsers: hasPermission(PERMISSION_KEYS.USERS.CREATE),
      canEditUsers: hasPermission(PERMISSION_KEYS.USERS.EDIT),
      canDeleteUsers: hasPermission(PERMISSION_KEYS.USERS.DELETE),
      canApproveUsers: hasPermission(PERMISSION_KEYS.USERS.APPROVE),
      canRejectUsers: hasPermission(PERMISSION_KEYS.USERS.APPROVE),
      canViewPendingUsers: hasPermission(PERMISSION_KEYS.USERS.APPROVE),
      canAssignRoles: hasPermission(PERMISSION_KEYS.USERS.ASSIGN_ROLE),
      canAssignPermissions: hasPermission(PERMISSION_KEYS.PERMISSIONS.ASSIGN),
      hasRole,
      isAdmin,
    }),
    [hasPermission, hasRole, isAdmin]
  );
};

export const useRoleManagementPermissions = () => {
  const { hasPermission, isAdmin } = usePermissions();

  return useMemo(
    () => ({
      canViewRoles: hasPermission(PERMISSION_KEYS.ROLES.VIEW),
      canCreateRoles: hasPermission(PERMISSION_KEYS.ROLES.CREATE),
      canEditRoles: hasPermission(PERMISSION_KEYS.ROLES.EDIT),
      canDeleteRoles: hasPermission(PERMISSION_KEYS.ROLES.DELETE),
      canAssignRoles: hasPermission(PERMISSION_KEYS.ROLES.EDIT),
      canAssignPermissions: hasPermission(PERMISSION_KEYS.PERMISSIONS.ASSIGN),
      isAdmin,
    }),
    [hasPermission, isAdmin]
  );
};

export const usePermissionManagementPermissions = () => {
  const { hasPermission, isAdmin } = usePermissions();

  return useMemo(
    () => ({
      canViewPermissions: hasPermission(PERMISSION_KEYS.PERMISSIONS.VIEW),
      canAssignPermissions: hasPermission(PERMISSION_KEYS.PERMISSIONS.ASSIGN),
      isAdmin,
    }),
    [hasPermission, isAdmin]
  );
};
