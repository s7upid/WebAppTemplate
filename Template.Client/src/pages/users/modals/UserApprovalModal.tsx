import React, { useEffect } from "react";
import { ModalPortal, Button, ModalPage } from "@/components";
import { RoleResponse, UserResponse } from "@/models";
import { useRolesQuery } from "@/hooks";
import { CheckCircle } from "lucide-react";

interface UserApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse;
  selectedRole: RoleResponse;
  onRoleChange: (role: RoleResponse) => void;
  onApprove: () => void;
  loading: boolean;
}

const UserApprovalModal: React.FC<UserApprovalModalProps> = ({
  isOpen,
  onClose,
  user,
  selectedRole,
  onRoleChange,
  onApprove,
  loading,
}) => {
  const { roles, paginationHandlers, isLoading } = useRolesQuery();

  useEffect(() => {
    if (isOpen && paginationHandlers) {
      paginationHandlers.refreshWithCurrentFilters?.();
    }
  }, [isOpen, paginationHandlers]);

  return (
    <ModalPortal>
      <ModalPage
        isOpen={isOpen}
        onClose={onClose}
        title="Approve User Registration"
        size="md"
      >
        <div className="user-approval-space-y-4">
          <div className="modal-user-info">
            <h3 className="user-info-title">User Information</h3>
            <div className="pending-modal-user-info">
              <p>
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <span className="user-approval-modal-email-break">
                  {user.email}
                </span>
              </p>
              <p>
                <strong>Registration Date:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <label className="input-label">Assign Role</label>
            <select
              value={selectedRole?.id}
              onChange={(e) => {
                const next = roles.find((r: RoleResponse) => r.id === e.target.value);
                if (next) onRoleChange(next);
              }}
              className="input-field"
              disabled={isLoading || roles.length === 0}
            >
              <option value="">Choose a role</option>
              {roles.map((role: RoleResponse) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {isLoading && (
              <p className="text-sm text-gray-500 mt-1">Loading roles...</p>
            )}
            {!isLoading && roles.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">No roles available</p>
            )}
          </div>

          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={onApprove}
              loading={loading}
              icon={CheckCircle}
            >
              Approve User
            </Button>
          </div>
        </div>
      </ModalPage>
    </ModalPortal>
  );
};

export default UserApprovalModal;
