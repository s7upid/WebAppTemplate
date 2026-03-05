import { useState } from "react";
import { DataPage } from "solstice-ui";
import {
  UserResponse,
  ApproveUserRequest,
  RoleResponse,
  PagedResult,
  createEmptyPagedResult,
} from "@/models";
import { UserApprovalModal, UserRejectionModal } from "../modals";
import { TEST_IDS } from "@/config";
import { useUsersQuery, usePaginationWithScroll } from "@/hooks";
import { PENDING_USER_GRID_CONFIG, renderPendingUserGridItem } from "../shared";

interface PendingUsersPageProps {
  paginationResult?: PagedResult<UserResponse>;
  paginationHandlers?: {
    changePage?: (page: number) => void;
    changePageSize?: (size: number) => void;
    refreshWithParams?: (params: {
      searchTerm: string;
      filters: Record<string, string>;
    }) => void;
  };
  isLoading?: boolean;
}

function PendingUsersPage({
  paginationResult: propsPaginationResult,
  paginationHandlers: propsPaginationHandlers,
  isLoading: propsIsLoading,
}: PendingUsersPageProps) {
  const {
    approveUser,
    rejectUser,
    paginationHandlers: hookPaginationHandlers,
    paginationResult: hookPaginationResult,
    isLoading: hookIsLoading,
  } = useUsersQuery();

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
      paginationHandlers?.refreshWithParams?.({
        searchTerm: "",
        filters: { status: "pending" },
      });
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
      paginationHandlers?.refreshWithParams?.({
        searchTerm: "",
        filters: { status: "pending" },
      });
    } finally {
      setModalActionLoading(false);
    }
  };

  const { onPageChange, onPageSizeChange } =
    usePaginationWithScroll(paginationHandlers);
  const result = isLoading
    ? createEmptyPagedResult<UserResponse>()
    : (paginationResult ?? createEmptyPagedResult<UserResponse>());
  const { items, pageNumber, totalPages, pageSize } = result;

  return (
    <div data-testid={TEST_IDS.PENDING_USERS_PAGE}>
      <DataPage<UserResponse>
        layout="grid"
        items={items}
        loading={isLoading}
        renderCard={(user: UserResponse) =>
          renderPendingUserGridItem(user, openApprovalModal, openRejectionModal)
        }
        columns={3}
        emptyTitle={PENDING_USER_GRID_CONFIG.emptyStateTitle ?? "No items"}
        emptyDescription={PENDING_USER_GRID_CONFIG.emptyStateDescription}
        keyExtractor={(user: UserResponse) => user.id ?? ""}
        currentPage={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
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
}

export default PendingUsersPage;
