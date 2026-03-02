import React from "react";
import { useAuth } from "@/hooks";
import { UserResponse } from "@/models";
import { DangerZone, Card } from "solstice-ui";
import { QuickActions } from "@/components";
import { Edit, Shield, ShieldAlert, UserCheck, Zap } from "lucide-react";
import { TEST_IDS, UserManagementPermissions } from "@/config";
import styles from "./UserActions.module.css";

interface UserActionsProps {
  permissions: UserManagementPermissions;
  user: UserResponse;
  onEditUser?: (user: UserResponse) => void;
  onManageRoles?: (user: UserResponse) => void;
  onManagePermissions?: (user: UserResponse) => void;
  onDeleteUser?: (user: UserResponse) => void;
}

const UserActions: React.FC<UserActionsProps> = ({
  permissions,
  user,
  onEditUser,
  onManageRoles,
  onManagePermissions,
  onDeleteUser,
}) => {
  const { user: loggedInUser } = useAuth();
  const isSelf = loggedInUser?.id === user.id;
  const quickActions = [
    {
      id: "edit-user",
      title: "Edit User",
      description: "Update user information",
      icon: Edit,
      testId: "edit-user-button",
      onClick: () => onEditUser?.(user),
      requiresPermission: permissions.canEditUsers,
    },
    {
      id: "manage-roles",
      title: "Manage Roles",
      description: "Assign or change user role",
      icon: Shield,
      testId: "manage-roles-button",
      onClick: () => onManageRoles?.(user),
      requiresPermission: permissions.canEditUsers,
    },
    {
      id: "manage-permissions",
      title: "Manage Permissions",
      description: "Configure user permissions",
      icon: UserCheck,
      testId: "manage-permissions-button",
      onClick: () => onManagePermissions?.(user),
      requiresPermission: permissions.canEditUsers,
    },
  ].filter((a) => a.requiresPermission);

  return (
    <div className={styles.container}>
      {quickActions.length > 0 && (
        <QuickActions
          title="Quick Actions"
          icon={Zap}
          iconSize="sm"
          actions={quickActions.map(({ requiresPermission: _, ...a }) => a)}
          testId="user-quick-actions"
        />
      )}

      {permissions.canDeleteUsers && !isSelf && (
        <Card title="Danger Zone" icon={ShieldAlert} iconSize="sm">
          <DangerZone
            title="Delete User"
            description=" Permanently remove this user from the system. This action cannot be undone."
            buttonLabel="Delete User"
            onConfirm={() => onDeleteUser?.(user)}
            testId={TEST_IDS.DELETE_USER_BUTTON}
          />
        </Card>
      )}
    </div>
  );
};

export default UserActions;
