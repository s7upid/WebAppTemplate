import { useEffect } from "react";
import { Button, Dialog, Dropdown } from "solstice-ui";
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

function UserApprovalModal({
  isOpen,
  onClose,
  user,
  selectedRole,
  onRoleChange,
  onApprove,
  loading,
}: UserApprovalModalProps) {
  const { roles, paginationHandlers, isLoading } = useRolesQuery();

  useEffect(() => {
    if (isOpen && paginationHandlers) {
      paginationHandlers.refreshWithCurrentFilters?.();
    }
  }, [isOpen, paginationHandlers]);

  return (
    <Dialog
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

          <Dropdown
            label="Assign Role"
            placeholderOption="Choose a role"
            options={roles.map((r: RoleResponse) => ({ value: r.id, label: r.name }))}
            value={selectedRole?.id ?? ""}
            onValueChange={(value: string) => {
              const next = roles.find((r: RoleResponse) => r.id === value);
              if (next) onRoleChange(next);
            }}
            disabled={isLoading || roles.length === 0}
            helperText={
              isLoading
                ? "Loading roles..."
                : roles.length === 0
                  ? "No roles available"
                  : undefined
            }
          />

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
    </Dialog>
  );
}

export default UserApprovalModal;
