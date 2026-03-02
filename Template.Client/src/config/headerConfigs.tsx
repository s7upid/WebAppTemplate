import { Plus, ArrowLeft, Edit } from "lucide-react";
import { PageHeaderProps } from "@/models";
import {
  USERS_MODULE,
  ROLES_MODULE,
  PERMISSIONS_MODULE,
  UserManagementPermissions,
  RoleManagementPermissions,
} from "@/config/modules";
import { Button } from "solstice-ui";

export const createUserManagementHeader = (
  permissions: UserManagementPermissions,
  onCreateUser: () => void
): PageHeaderProps => ({
  title: USERS_MODULE.labels.menuLabel,
  description: USERS_MODULE.labels.description,
  icon: USERS_MODULE.icon,
  actions: permissions.canCreateUsers && (
    <div className="flex gap-2">
      <Button
        onClick={onCreateUser}
        variant="primary"
        data-testid={USERS_MODULE.testIds.createButton}
      >
        <Plus className="icon-size" />
        {USERS_MODULE.labels.createButton}
      </Button>
    </div>
  ),
});

export const createUserDetailsHeader = (
  firstName: string,
  lastName: string,
  onBackToUsers: () => void
): PageHeaderProps => ({
  title: USERS_MODULE.labels.detailTitle || "User Details",
  description: `${USERS_MODULE.labels.detailDescription || "View and manage user information"} ${firstName} ${lastName}`,
  icon: Edit,
  actions: (
    <div className="flex gap-2">
      <Button
        onClick={onBackToUsers}
        variant="secondary"
        data-testid={USERS_MODULE.testIds.backButton}
      >
        <ArrowLeft className="icon-size" />
        {USERS_MODULE.labels.backButton}
      </Button>
    </div>
  ),
});

export const createRoleManagementHeader = (
  permissions: RoleManagementPermissions,
  onCreateRole: () => void
): PageHeaderProps => ({
  title: ROLES_MODULE.labels.menuLabel,
  description: ROLES_MODULE.labels.description,
  icon: ROLES_MODULE.icon,
  actions: permissions.canCreateRoles && (
    <div className="flex gap-2">
      <Button
        onClick={onCreateRole}
        variant="primary"
        data-testid={ROLES_MODULE.testIds.createButton}
      >
        <Plus className="icon-size" />
        {ROLES_MODULE.labels.createButton}
      </Button>
    </div>
  ),
});

export const createRoleDetailsHeader = (
  name: string,
  onBackToRoles: () => void
): PageHeaderProps => ({
  title: ROLES_MODULE.labels.detailTitle || "Role Details",
  description: `${ROLES_MODULE.labels.detailDescription || "View and manage role information"} ${name}`,
  icon: Edit,
  actions: (
    <div className="flex gap-2">
      <Button
        onClick={onBackToRoles}
        variant="secondary"
        data-testid={ROLES_MODULE.testIds.backButton}
      >
        <ArrowLeft className="icon-size" />
        {ROLES_MODULE.labels.backButton}
      </Button>
    </div>
  ),
});

export const createPermissionManagementHeader = (): PageHeaderProps => ({
  title: PERMISSIONS_MODULE.labels.menuLabel,
  description: PERMISSIONS_MODULE.labels.description,
  icon: PERMISSIONS_MODULE.icon,
});

export const createPendingUsersHeader = (): PageHeaderProps => ({
  title: "Pending Approvals",
  description: "Review and approve pending user registrations",
  icon: USERS_MODULE.icon,
});
