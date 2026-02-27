import React from "react";
import { RoleResponse } from "@/models";
import { DangerZone, Card, QuickActions } from "@/components";
import { Edit, ShieldAlert, Zap } from "lucide-react";
import { RoleManagementPermissions, TEST_IDS } from "@/config";
import styles from "./RoleActions.module.css";

interface RoleActionsProps {
  permissions: RoleManagementPermissions;
  role: RoleResponse;
  onEditRole?: (user: RoleResponse) => void;
  onDeleteRole?: (user: RoleResponse) => void;
}

const RoleActions: React.FC<RoleActionsProps> = ({
  permissions,
  role,
  onEditRole,
  onDeleteRole,
}) => {
  const quickActions = [
    {
      id: "edit-role",
      title: "Edit Role",
      description: "Update role information",
      icon: Edit,
      testId: "edit-role-button",
      onClick: () => onEditRole?.(role),
      requiresPermission: permissions.canEditRoles,
    },
  ].filter((a) => a.requiresPermission);

  return (
    <div className={styles.container}>
      {permissions.canEditRoles && (
        <QuickActions
          title="Quick Actions"
          icon={Zap}
          iconSize="sm"
          actions={quickActions.map(({ requiresPermission: _, ...a }) => a)}
          testId="user-quick-actions"
        />
      )}

      {permissions.canDeleteRoles && !role.isSystem && (
        <Card title="Danger Zone" icon={ShieldAlert} iconSize="sm">
          <DangerZone
            title="Delete Role"
            description=" Permanently remove this role from the system. This action cannot be undone."
            buttonLabel="Delete Role"
            onConfirm={() => onDeleteRole?.(role)}
            testId={TEST_IDS.CONFIRM_DELETE_BUTTON}
          />
        </Card>
      )}
    </div>
  );
};

export default RoleActions;
