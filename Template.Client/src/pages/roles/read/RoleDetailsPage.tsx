import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useRoleQuery,
  useRolesQuery,
  useConfirmation,
  useToast,
  useDetailPageHeader,
} from "@/hooks";
import { handleEntityDelete, useGenericNavigationFunctions } from "@/utils";
import { PageHeaderProps, RoleResponse } from "@/models";
import { ConfirmationDialog } from "@/components";
import { LoadingSpinner, EmptyState } from "solstice-ui";
import {
  RoleActions,
  RolePermissionsSection,
  RoleStatsSection,
  RoleUsersSection,
} from "../components";
import {
  BUTTON_LABELS,
  createRoleDetailsHeader,
  createRoleManagementHeader,
  ERROR_MESSAGES,
  RoleManagementPermissions,
} from "@/config";

interface RoleDetailsPageProps {
  permissions: RoleManagementPermissions;
  onEditRole?: (role: RoleResponse) => void;
  setHeaderProps: React.Dispatch<React.SetStateAction<PageHeaderProps>>;
  handleCreateRole: () => void;
}

function RoleDetailsPage({
  permissions,
  onEditRole,
  setHeaderProps,
  handleCreateRole,
}: RoleDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const nav = useGenericNavigationFunctions();
  const { role, isLoading, error } = useRoleQuery(id);
  const { remove: removeRole } = useRolesQuery();
  const confirmation = useConfirmation();
  const { showSuccess, showError } = useToast();

  const handleBackToRoles = useCallback(() => nav.goToRoles(), [nav]);

  const roleDetailsHeader = useMemo(() => {
    if (role) return createRoleDetailsHeader(role.name, handleBackToRoles);
    return null;
  }, [role, handleBackToRoles]);

  const defaultHeader = useMemo(
    () => createRoleManagementHeader(permissions, handleCreateRole),
    [permissions, handleCreateRole]
  );
  useDetailPageHeader(roleDetailsHeader, defaultHeader, setHeaderProps);

  const handleDeleteRole = useCallback(
    (roleToDelete: RoleResponse) =>
      handleEntityDelete({
        entity: roleToDelete,
        id: roleToDelete.id,
        remove: removeRole,
        entityName: "Role",
        successMessage: `${roleToDelete.name} deleted successfully`,
        errorMessages: {
          notFound: "Role not found",
          deleteFailed: "Delete failed",
        },
        onDeleted: () => nav.goToRoles(),
        confirm: confirmation.showConfirmation,
        hideConfirmation: confirmation.hideConfirmation,
        showSuccess,
        showError,
      }),
    [removeRole, nav, confirmation, showSuccess, showError]
  );

  const handleUserClick = (userId: string) => nav.goToUserDetail(userId);

  if (isLoading) return <LoadingSpinner text="Loading role..." />;

  if (!role)
    return (
      <EmptyState
        title={error || ERROR_MESSAGES.NOT_FOUND}
        primaryAction={{
          label: BUTTON_LABELS.BACK_TO_ROLES,
          onClick: handleBackToRoles,
        }}
      />
    );

  return (
    <>
      <div className="gap">
        <RoleStatsSection role={role} />
        <RolePermissionsSection role={role} />
        <RoleUsersSection
          users={role.users || []}
          usersLoading={false}
          onUserClick={handleUserClick}
        />
        <RoleActions
          permissions={permissions}
          role={role}
          onEditRole={onEditRole}
          onDeleteRole={handleDeleteRole}
        />
      </div>
      <ConfirmationDialog {...confirmation.dialogProps} />
    </>
  );
}

export default RoleDetailsPage;
