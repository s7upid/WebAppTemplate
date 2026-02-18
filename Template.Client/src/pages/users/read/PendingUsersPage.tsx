import React, { useState } from "react";
import { GridPage } from "@/components";
import { UserResponse, ApproveUserRequest, RoleResponse, PagedResult } from "@/models";
import { UserApprovalModal, UserRejectionModal } from "../modals";
import { TEST_IDS } from "@/config";
import { useUsersQuery } from "@/hooks";
import { PENDING_USER_GRID_CONFIG, renderPendingUserGridItem } from "../shared";

interface PendingUsersPageProps {
  paginationResult?: PagedResult<UserResponse>;
  paginationHandlers?: {
    changePage?: (page: number) => void;
    changePageSize?: (size: number) => void;
    refreshWithParams?: (params: { searchTerm: string; filters: Record<string, string> }) => void;
  };
  isLoading?: boolean;
}

const PendingUsersPage: React.FC<PendingUsersPageProps> = ({
  paginationResult: propsPaginationResult,
  paginationHandlers: propsPaginationHandlers,
  isLoading: propsIsLoading,
}) => {
  const {
    approveUser,
    rejectUser,
    paginationHandlers: hookPaginationHandlers,
    paginationResult: hookPaginationResult,
    isLoading: hookIsLoading,
  } = useUsersQuery();

  // Use props if provided, otherwise fallback to hook values
  const paginationResult = propsPaginationResult ?? hookPaginationResult;
  const paginationHandlers = propsPaginationHandlers ?? hookPaginationHandlers;
  const isLoading = propsIsLoading ?? hookIsLoading;

  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleResponse>();
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);
  const [modalActionLoading, setModalActionLoading] = useState(false);

  const openApprovalModal = (user: UserResponse) => {
    setSelectedUser(user);
    setSelectedRole(undefined);
    setModalType("approve");
  };

  const openRejectionModal = (user: UserResponse) => {
    setSelectedUser(user);
    setModalType("reject");
  };

  const handleApprovalConfirm = async () => {
    if (!selectedUser || !selectedRole) return;
    setModalActionLoading(true);
    try {
      const request: ApproveUserRequest = { roleId: selectedRole.id! };
      await approveUser(selectedUser.id!, request);
      setModalType(null);
      setSelectedUser(null);
      if (paginationHandlers?.refreshWithParams) {
        paginationHandlers.refreshWithParams({
          searchTerm: "",
          filters: { status: "pending" },
        });
      }
    } finally {
      setModalActionLoading(false);
    }
  };

  const handleRejectionConfirm = async () => {
    if (!selectedUser) return;
    setModalActionLoading(true);
    try {
      await rejectUser(selectedUser.id!);
      setModalType(null);
      setSelectedUser(null);
      if (paginationHandlers?.refreshWithParams) {
        paginationHandlers.refreshWithParams({
          searchTerm: "",
          filters: { status: "pending" },
        });
      }
    } finally {
      setModalActionLoading(false);
    }
  };

  // When loading, show empty result to prevent stale data flicker
  const emptyResult: PagedResult<UserResponse> = {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
  };

  return (
    <div className="p-6" data-testid={TEST_IDS.PENDING_USERS_PAGE}>
      <GridPage<UserResponse>
        pagedResult={isLoading ? emptyResult : (paginationResult ?? emptyResult)}
        gridConfig={PENDING_USER_GRID_CONFIG}
        callbacks={{
          renderItem: (user) =>
            renderPendingUserGridItem(
              user,
              openApprovalModal,
              openRejectionModal
            ),
          onPageChange: paginationHandlers?.changePage,
          onPageSizeChange: paginationHandlers?.changePageSize,
        }}
        testid={TEST_IDS.PENDING_USERS_PAGE}
        loading={isLoading}
      />

      {modalType === "approve" && selectedUser && (
        <UserApprovalModal
          isOpen
          user={selectedUser}
          selectedRole={selectedRole!}
          onRoleChange={setSelectedRole}
          onClose={() => setModalType(null)}
          onApprove={handleApprovalConfirm}
          loading={modalActionLoading}
        />
      )}

      {modalType === "reject" && selectedUser && (
        <UserRejectionModal
          isOpen
          user={selectedUser}
          onClose={() => setModalType(null)}
          onReject={handleRejectionConfirm}
          loading={modalActionLoading}
        />
      )}
    </div>
  );
};

export default PendingUsersPage;
