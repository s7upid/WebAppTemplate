import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useUsersQuery, useToast, useRoleQuery, useAllPermissions } from "@/hooks";
import { TEST_IDS } from "@/config/constants";
import { PERMISSIONS_MODULE, UserManagementPermissions } from "@/config/modules";
import { ModalPage, Button, LoadingSpinner } from "@/components";
import { Key, XCircle } from "lucide-react";
import {
  UserResponse,
  PermissionKey,
  UpdateUserRequest,
  UserStatus,
} from "@/models";
import { PermissionSelector } from "@/pages";

interface UserPermissionModalProps {
  permissions: UserManagementPermissions;
  isOpen: boolean;
  onClose: () => void;
  user?: UserResponse;
}

const userStatusToNumber = (status: UserStatus): number => {
  switch (status) {
    case UserStatus.Active:
      return 0;
    case UserStatus.Inactive:
      return 1;
    case UserStatus.Pending:
      return 2;
    case UserStatus.Suspended:
      return 3;
    default:
      return 0;
  }
};

const UserPermissionModal: React.FC<UserPermissionModalProps> = ({
  permissions,
  isOpen,
  onClose,
  user,
}) => {
  if (!permissions.canEditUsers) return null;

  const { edit: editUser } = useUsersQuery();
  const { showSuccess } = useToast();
  const { error: permissionsError } = useAllPermissions();
  const { role: selectedRole, isLoading: roleLoading } = useRoleQuery(user?.role?.id);

  const {
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const [selectedPermissions, setSelectedPermissions] = useState<
    PermissionKey[]
  >([]);
  const [originalPermissions, setOriginalPermissions] = useState<
    PermissionKey[]
  >([]);

  const rolePermissions = useMemo<PermissionKey[]>(() => {
    const loaded =
      selectedRole && user?.role?.id && selectedRole.id === user.role.id
        ? selectedRole.permissions || []
        : user?.role?.permissions || [];
    return (loaded || []).map((p: any) => p.key as PermissionKey);
  }, [user, selectedRole]);

  // Role is now fetched automatically by useRoleQuery when user?.role?.id changes

  useEffect(() => {
    if (!isOpen) {
      setSelectedPermissions([]);
      setOriginalPermissions([]);
      return;
    }

    if (!user) return;

    const userPerms = Array.isArray(user.permissions)
      ? user.permissions.map((p) => p.key)
      : [];
    const combined = [
      ...new Set([...rolePermissions, ...userPerms]),
    ] as PermissionKey[];

    setSelectedPermissions((prev) => {
      const prevSet = new Set(prev);
      const newSet = new Set(combined);
      if (
        prevSet.size === newSet.size &&
        Array.from(prevSet).every((p) => newSet.has(p))
      ) {
        return prev;
      }
      return combined;
    });

    setOriginalPermissions(combined);
  }, [isOpen, user, rolePermissions]);

  // Permissions are now fetched automatically by useAllPermissions

  const hasChanges = useMemo(() => {
    if (selectedPermissions.length !== originalPermissions.length) return true;
    const originalSet = new Set(originalPermissions);
    return selectedPermissions.some((p) => !originalSet.has(p));
  }, [selectedPermissions, originalPermissions]);

  const handlePermissionToggle = useCallback(
    (key: PermissionKey) => {
      if (rolePermissions.includes(key)) return;
      setSelectedPermissions((prev) => {
        const newPermissions = prev.includes(key)
          ? prev.filter((p) => p !== key)
          : [...prev, key];

        if (newPermissions.length > 0 && errors.root) {
          clearErrors("root");
        }

        return newPermissions;
      });
    },
    [rolePermissions, errors.root, clearErrors]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!user) {
        setError("root", {
          type: "manual",
          message: "User not found",
        });
        return;
      }

      if (selectedPermissions.length === 0) {
        setError("root", {
          type: "manual",
          message: "Please select at least one permission",
        });
        return;
      }

      try {
        const customPermissions = selectedPermissions.filter(
          (p) => !rolePermissions.includes(p)
        );
        const result = await editUser({
          id: user.id,
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            permissionKeys: customPermissions,
            status: userStatusToNumber(user.userStatus),
            roleId: user.role?.id,
          } as UpdateUserRequest,
        });
        if (result.success) {
          showSuccess(
            PERMISSIONS_MODULE.messages?.updated || "Permissions updated successfully",
            `Permissions updated for ${user.firstName} ${user.lastName}.`
          );
        }
        onClose();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred while updating permissions";
        setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    },
    [user, selectedPermissions, rolePermissions, editUser, onClose, setError, showSuccess]
  );

  if (!user) return null;

  return (
    <ModalPage
      isOpen={isOpen}
      onClose={onClose}
      title="Manage User Permissions"
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

      <form id="user-permission-form" onSubmit={handleSubmit}>
        {errors.root && (
          <div
            className="error-box"
            role="alert"
            data-testid={TEST_IDS.ERROR_MESSAGE}
          >
            <strong className="font-bold">Error:</strong>
            <span className="user-permission-modal-error-text">
              {" "}
              {errors.root.message}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="form-section-header">Select Permissions</h4>
          <p className="text-sm-secondary">
            <strong>Role Permissions:</strong> come from the user's role and
            cannot be removed.
            <br />
            <strong>Custom Permissions:</strong> can be added or removed.
          </p>

          {roleLoading && (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="sm" text="Loading role permissions..." />
            </div>
          )}

          {!roleLoading && (
            <PermissionSelector
              selectedPermissions={selectedPermissions}
              onPermissionToggle={handlePermissionToggle}
              onBulkPermissionChange={(permissions) => {
                const customPermissions = permissions.filter(
                  (permission) => !rolePermissions.includes(permission)
                );
                const newPermissions = [
                  ...rolePermissions,
                  ...customPermissions,
                ];

                if (newPermissions.length > 0 && errors.root) {
                  clearErrors("root");
                }

                setSelectedPermissions(newPermissions);
              }}
              disabled={false}
              disabledKeys={rolePermissions}
              error={permissionsError || errors.root?.message}
            />
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
            {hasChanges && (
              <Button
                type="submit"
                form="user-permission-form"
                variant="primary"
                disabled={isSubmitting}
                icon={Key}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" showMessage={false} />
                ) : (
                  "Update Permissions"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </ModalPage>
  );
};

export default UserPermissionModal;
