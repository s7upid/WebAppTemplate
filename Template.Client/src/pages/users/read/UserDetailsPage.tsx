import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useUserQuery,
  useUsersQuery,
  useConfirmation,
  useToast,
  useDetailPageHeader,
} from "@/hooks";
import { handleEntityDelete, useGenericNavigationFunctions } from "@/utils";
import { UserActions } from "@/pages";
import {
  PageHeaderProps,
  UserResponse,
  PermissionResponse,
  RoleResponse,
} from "@/models";
import { Calendar, Key, Shield, UserIcon } from "lucide-react";
import { ConfirmationDialog } from "@/components";
import { Card, LoadingSpinner, EmptyState } from "solstice-ui";
import {
  BUTTON_LABELS,
  ERROR_MESSAGES,
  createUserManagementHeader,
  createUserDetailsHeader,
  UserManagementPermissions,
} from "@/config";

interface UserDetailsPageProps {
  permissions: UserManagementPermissions;
  onEditUser?: (user: UserResponse) => void;
  onManageRoles?: (user: UserResponse) => void;
  onManagePermissions?: (user: UserResponse) => void;
  setHeaderProps: React.Dispatch<React.SetStateAction<PageHeaderProps>>;
  handleCreateUser: () => void;
}

function UserDetailsPage({
  permissions,
  onEditUser,
  onManageRoles,
  onManagePermissions,
  setHeaderProps,
  handleCreateUser,
}: UserDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const nav = useGenericNavigationFunctions();
  const { user, isLoading, error } = useUserQuery(id);
  const { remove: removeUser } = useUsersQuery();
  const confirmation = useConfirmation();
  const { showSuccess, showError } = useToast();

  const handleBackToUsers = useCallback(() => nav.goToUsers(), [nav]);

  const userDetailsHeader = useMemo(() => {
    if (user) {
      return createUserDetailsHeader(
        user.firstName,
        user.lastName,
        handleBackToUsers,
      );
    }
    return null;
  }, [user, handleBackToUsers]);

  const defaultHeader = useMemo(
    () => createUserManagementHeader(permissions, handleCreateUser),
    [permissions, handleCreateUser]
  );
  useDetailPageHeader(userDetailsHeader, defaultHeader, setHeaderProps);

  const handleDeleteUser = useCallback(
    (userToDelete: UserResponse) =>
      handleEntityDelete({
        entity: userToDelete,
        id: userToDelete.id,
        remove: removeUser,
        entityName: "User",
        successMessage: `${userToDelete.firstName} ${userToDelete.lastName} deleted successfully`,
        errorMessages: {
          notFound: "User not found",
          deleteFailed: "Delete failed",
        },
        onDeleted: handleBackToUsers,
        confirm: confirmation.showConfirmation,
        hideConfirmation: confirmation.hideConfirmation,
        showSuccess,
        showError,
      }),
    [removeUser, handleBackToUsers, confirmation, showSuccess, showError],
  );

  if (isLoading) return <LoadingSpinner text="Loading user..." />;

  if (!user)
    return (
      <EmptyState
        title={error?.message || ERROR_MESSAGES.NOT_FOUND}
        primaryAction={{
          label: BUTTON_LABELS.BACK_TO_USERS,
          onClick: handleBackToUsers,
        }}
      />
    );

  const userPermissions = (user.permissions || []) as PermissionResponse[];
  const rolePermissions = ((user.role as RoleResponse)?.permissions ||
    []) as PermissionResponse[];

  const roleString =
    ((user.role as RoleResponse)?.name || user.role || "No role") +
    (userPermissions.some(
      (p: PermissionResponse) =>
        !rolePermissions.map((r: PermissionResponse) => r.key).includes(p.key),
    )
      ? " + custom"
      : "");

  return (
    <>
      <div className="gap">
        <Card
          title={`${user.firstName} ${user.lastName}`}
          description={user.email}
          icon={UserIcon}
          avatar={user.avatar}
          layout="horizontal"
          status={user.userStatus}
          detailsPerRow={4}
          details={[
            { label: "Role", value: roleString, icon: Shield },
            {
              label: "Permissions",
              value: `${userPermissions.length} assigned`,
              icon: Key,
            },
            {
              label: "Login",
              value: user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString()
                : "Never",
              icon: Calendar,
            },
            {
              label: "Created",
              value: new Date(user.createdAt).toLocaleDateString(),
              icon: Calendar,
            },
          ]}
        />
        <UserActions
          permissions={permissions}
          user={user}
          onEditUser={onEditUser}
          onManageRoles={onManageRoles}
          onManagePermissions={onManagePermissions}
          onDeleteUser={handleDeleteUser}
        />
      </div>
      <ConfirmationDialog {...confirmation.dialogProps} />
    </>
  );
}

export default UserDetailsPage;
