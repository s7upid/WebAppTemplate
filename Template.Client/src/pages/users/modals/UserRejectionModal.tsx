import React from "react";
import { ModalPage, ModalPortal, Button } from "@/components";
import { UserResponse } from "@/models";
import { XCircle } from "lucide-react";

interface UserRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse;
  onReject: () => void;
  loading: boolean;
}

const UserRejectionModal: React.FC<UserRejectionModalProps> = ({
  isOpen,
  onClose,
  user,
  onReject,
  loading,
}) => {
  return (
    <ModalPortal>
      <ModalPage
        isOpen={isOpen}
        onClose={onClose}
        title="Reject User Registration"
        size="md"
      >
        <div className="user-rejection-space-y-4">
          <div className="rejection-warning-container">
            <h3 className="rejection-warning-title">
              Are you sure you want to reject this registration?
            </h3>
            <div className="rejection-warning-details">
              <p>
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <span className="user-rejection-modal-email-break">
                  {user.email}
                </span>
              </p>
              <p>
                <strong>Registration Date:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <p className="rejection-warning-description">
            This action will permanently remove the user registration and send a
            rejection email to the user.
          </p>

          <div className="modal-actions">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={onReject}
              loading={loading}
              icon={XCircle}
            >
              Reject Registration
            </Button>
          </div>
        </div>
      </ModalPage>
    </ModalPortal>
  );
};

export default UserRejectionModal;
