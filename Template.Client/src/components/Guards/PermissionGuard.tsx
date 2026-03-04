import type { ReactNode } from "react";
import { usePermissions } from "@/hooks";
import { PermissionKey } from "@/models";
import { Shield, AlertCircle } from "lucide-react";
import styles from "./PermissionGuard.module.css";

interface PermissionGuardProps {
  children: ReactNode;
  permissions?: PermissionKey[];
  permission?: PermissionKey;
  fallback?: ReactNode;
  requireAll?: boolean;
}

function PermissionGuard({
  children,
  permissions,
  permission,
  fallback,
  requireAll = false,
}: PermissionGuardProps) {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();

  const permissionList = permission ? [permission] : permissions || [];

  const hasAccess = requireAll
    ? hasAllPermissions(permissionList)
    : hasAnyPermission(permissionList);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconBg}>
            <Shield className={styles.icon} />
          </div>
          <h2 className={styles.title}>Access Denied</h2>
          <p className={styles.description}>
            You don't have permission to access this resource.
          </p>
          <div className={styles.details}>
            <AlertCircle className={styles.detailsIcon} />
            Required permissions: {permissions?.join(", ") || "Unknown"}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default PermissionGuard;
