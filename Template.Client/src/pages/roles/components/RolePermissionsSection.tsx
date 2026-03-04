import { CheckCircle, Shield } from "lucide-react";
import { cn } from "@/utils";
import styles from "./RolePermissionsSection.module.css";
import { Permission, RoleResponse } from "@/models";
import { Card } from "solstice-ui";

interface RolePermissionsSectionProps {
  role?: RoleResponse;
  showDescription?: boolean;
}

function RolePermissionsSection({
  role,
  showDescription = false,
}: RolePermissionsSectionProps) {
  if (!role) {
    return <div className="card">Loading role...</div>;
  }

  return (
    <Card
      title={`Permissions (${role.permissions?.length || 0})`}
      icon={Shield}
      iconSize="sm"
    >
      <div className={styles.header}>
        <span
          className={cn(
            styles.badge,
            role.isSystem ? styles.badgeSystem : styles.badgeCustom
          )}
        >
          {role.isSystem ? "System Role" : "Custom Role"}
        </span>
      </div>

      <div className={styles.grid}>
        {role.permissions && role.permissions.length > 0 ? (
          role.permissions.map((permission) => {
            const p: Permission = permission as Permission;
            return (
              <div key={p.id || p.key} className={styles.item}>
                <CheckCircle className={styles.checkIcon} />
                <div className={styles.itemContent}>
                  <p className={styles.permName}>{p.name || p.key}</p>
                  <p className={styles.permKey}>{p.key}</p>
                  {showDescription && p.description && (
                    <p className={styles.permDescription}>{p.description}</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            No permissions assigned to this role
          </div>
        )}
      </div>
    </Card>
  );
}

export default RolePermissionsSection;
