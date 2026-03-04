import { useGenericNavigationFunctions } from "@/utils";
import { DataPage, EmptyState } from "solstice-ui";
import { EntityToolbar } from "@/components";
import { PagedResult, UserResponse, createEmptyPagedResult } from "@/models";
import { TEST_IDS } from "@/config";
import { useGridFilters, usePaginationWithScroll, type GridListPaginationHandlers } from "@/hooks";
import {
  FILTERS,
  USER_GRID_CONFIG,
  renderUserGridItem,
  SORT_FIELDS,
} from "../shared";

interface UserGridPageProps {
  paginationResult: PagedResult<UserResponse>;
  paginationHandlers: GridListPaginationHandlers;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function UserGridPage({
  paginationResult,
  paginationHandlers,
  isLoading,
  error,
  onRetry,
}: UserGridPageProps) {
  const nav = useGenericNavigationFunctions();
  const handleUserClick = (user: UserResponse) => nav.goToUserDetail(user.id!);
  const { actionLoading, applyFilters, clearAll } =
    useGridFilters(paginationHandlers);
  const { onPageChange, onPageSizeChange } =
    usePaginationWithScroll(paginationHandlers);
  const result = isLoading
    ? createEmptyPagedResult<UserResponse>()
    : (paginationResult ?? createEmptyPagedResult<UserResponse>());
  const { items, pageNumber, totalPages, pageSize } = result;

  if (error && !isLoading) {
    return (
      <EmptyState
        title="Failed to load users"
        description={error}
        primaryAction={onRetry ? { label: "Retry", onClick: onRetry } : undefined}
      />
    );
  }

  const toolbar = (
    <EntityToolbar
      searchPlaceholder="Search users..."
      filters={FILTERS}
      sortFields={SORT_FIELDS}
      loading={actionLoading}
      onApply={applyFilters}
      onClear={clearAll}
    />
  );

  return (
    <div data-testid={`${TEST_IDS.USER_PAGE}-page`}>
      <DataPage<UserResponse>
        layout="grid"
        contentBetweenHeaderAndContent={toolbar}
        items={items}
        loading={isLoading}
        renderCard={(user: UserResponse) => renderUserGridItem(user, handleUserClick)}
        columns={3}
        emptyTitle={USER_GRID_CONFIG.emptyStateTitle ?? "No items found"}
        emptyDescription={USER_GRID_CONFIG.emptyStateDescription}
        keyExtractor={(user: UserResponse) => user.id ?? ""}
        currentPage={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}

export default UserGridPage;
