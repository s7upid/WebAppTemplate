import { useGenericNavigationFunctions } from "@/utils";
import {
  PaginatedGrid,
  EntityToolbar,
  EmptyState,
} from "@/components";
import { PagedResult, UserResponse } from "@/models";
import { TEST_IDS } from "@/config";
import { useGridFilters } from "@/hooks";
import {
  FILTERS,
  USER_GRID_CONFIG,
  renderUserGridItem,
  SORT_FIELDS,
} from "../shared";

const emptyResult: PagedResult<UserResponse> = {
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
};

interface UserGridPageProps {
  paginationResult: PagedResult<UserResponse>;
  paginationHandlers: any;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const UserGridPage: React.FC<UserGridPageProps> = ({
  paginationResult,
  paginationHandlers,
  isLoading,
  error,
  onRetry,
}) => {
  const nav = useGenericNavigationFunctions();
  const handleUserClick = (user: UserResponse) => nav.goToUserDetail(user.id!);
  const { actionLoading, applyFilters, clearAll } =
    useGridFilters(paginationHandlers);

  const result = isLoading ? emptyResult : (paginationResult ?? emptyResult);
  const { items, totalCount, pageNumber, totalPages, pageSize } = result;

  if (error && !isLoading) {
    return (
      <EmptyState
        title="Failed to load users"
        description={error}
        primaryAction={onRetry ? { label: "Retry", onClick: onRetry } : undefined}
      />
    );
  }

  return (
    <>
      <EntityToolbar
        searchPlaceholder="Search users..."
        filters={FILTERS}
        sortFields={SORT_FIELDS}
        loading={actionLoading}
        onApply={applyFilters}
        onClear={clearAll}
      />
      <PaginatedGrid<UserResponse>
        items={items}
        loading={isLoading}
        renderCard={(user) => renderUserGridItem(user, handleUserClick)}
        columns={3}
        emptyTitle={USER_GRID_CONFIG.emptyStateTitle ?? "No items found"}
        emptyDescription={USER_GRID_CONFIG.emptyStateDescription}
        keyExtractor={(user) => user.id ?? ""}
        pageNumber={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        paginationHandlers={paginationHandlers}
        testId={TEST_IDS.USER_PAGE}
      />
    </>
  );
};

export default UserGridPage;
