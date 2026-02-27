import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUsersQuery, useRolesQuery, useToast } from "@/hooks";
import { Dialog, Button, LoadingSpinner, Dropdown } from "@/components";
import { Shield, XCircle } from "lucide-react";
import { RolePermissionsSection } from "@/pages";
import { UserResponse, UpdateUserRequest, RoleResponse } from "@/models";
import { TEST_IDS } from "@/config/constants";
import { USERS_MODULE, UserManagementPermissions } from "@/config/modules";

interface UserRoleModalProps {
  permissions: UserManagementPermissions;
  isOpen: boolean;
  onClose: () => void;
  user?: UserResponse;
}

const UserRoleModal: React.FC<UserRoleModalProps> = ({
  permissions,
  isOpen,
  onClose,
  user,
}) => {
  const { edit: editUser, refetch } = useUsersQuery();
  const { showSuccess } = useToast();
  const { roles, paginationHandlers, isLoading } = useRolesQuery();

  const {
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const [selectedRole, setSelectedRole] = useState("");
  const [originalRole, setOriginalRole] = useState("");

  if (!permissions.canEditUsers) {
    return null;
  }

  useEffect(() => {
    if (isOpen && user) {
      paginationHandlers?.refreshWithCurrentFilters?.();
      const currentRoleId = user.role?.id || "";
      setSelectedRole(currentRoleId);
      setOriginalRole(currentRoleId);
    } else if (!isOpen) {
      setSelectedRole("");
      setOriginalRole("");
    }
  }, [isOpen, user, paginationHandlers]);

  const hasChanges = () => {
    return selectedRole !== originalRole;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setError("root", {
        type: "manual",
        message: "User not found",
      });
      return;
    }
    if (!selectedRole) {
      setError("root", {
        type: "manual",
        message: "Role is required",
      });
      return;
    }
    try {
      const result = await editUser({
        id: user.id,
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          roleId: selectedRole,
        } as UpdateUserRequest,
      });
      if (result?.success) {
        const newRoleName =
          roles.find((r: RoleResponse) => r.id === selectedRole)?.name || "Role";
        showSuccess(
          USERS_MODULE.messages?.updated || "User updated successfully",
          `${user.firstName} ${user.lastName} role changed to ${newRoleName}.`
        );
        refetch();
      }
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while updating the user role";
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  if (!user) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Manage User Role"
      size="lg"
    >
      <div className="modal-user-info flex items-center gap-4">
        <div className="audit-user-avatar h-12 w-12 text-sm">
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <div className="audit-user-info flex-1">
          <div className="audit-user-name text-base">
            {user.firstName} {user.lastName}
          </div>
          <div className="audit-field mt-0.5">{user.email}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="audit-field">Role:</span>
            <span className="audit-user-name text-sm">
              {user.role?.name || "No role assigned"}
            </span>
          </div>
        </div>
      </div>

      <form id="user-role-form" onSubmit={handleSubmit}>
        {errors.root && (
          <div
            className="error-box"
            role="alert"
            data-testid={TEST_IDS.ERROR_MESSAGE}
          >
            <strong className="font-bold">Error:</strong>
            <span className="user-role-modal-error-text">
              {" "}
              {errors.root.message}
            </span>
          </div>
        )}

        <div className="user-role-modal-roles-section">
          <div>
            <Dropdown
              label="Select Role"
              value={selectedRole}
              onValueChange={setSelectedRole}
              required
              placeholderOption="Choose a role"
              options={roles.map((r: RoleResponse) => ({ value: r.id, label: r.name }))}
              loadingSlot={
                isLoading ? (
                  <div className="mt-2">
                    <LoadingSpinner size="sm" showMessage={false} />
                  </div>
                ) : undefined
              }
            />
          </div>

          {selectedRole &&
            roles.find((r: RoleResponse) => r.id === selectedRole)?.description && (
              <div className="modal-user-info-with-margin">
                <h5 className="form-section-header-small">Role Description</h5>
                <p className="text-sm-secondary-with-margin">
                  {roles.find((r: RoleResponse) => r.id === selectedRole)?.description}
                </p>
              </div>
            )}

          {selectedRole && (
            <div className="mt-4">
              {(() => {
                const role = roles.find((r: RoleResponse) => r.id === selectedRole);
                return (
                  <RolePermissionsSection role={role} showDescription={false} />
                );
              })()}
            </div>
          )}

          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              icon={XCircle}
            >
              Cancel
            </Button>
            {hasChanges() && (
              <Button
                type="submit"
                form="user-role-form"
                variant="primary"
                disabled={isSubmitting || !selectedRole}
                icon={Shield}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" showMessage={false} />
                ) : (
                  "Update Role"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default UserRoleModal;
