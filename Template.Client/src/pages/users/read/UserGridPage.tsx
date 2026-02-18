import { useGenericNavigationFunctions } from "@/utils";
import { GridPage, EntityToolbar, EmptyState } from "@/components";
import { GridCallbacks, PagedResult, UserResponse } from "@/models";
import { TEST_IDS } from "@/config";
import { useGridFilters } from "@/hooks";
import {
  FILTERS,
  USER_GRID_CONFIG,
  renderUserGridItem,
  SORT_FIELDS,
} from "../shared";

interface UserGridPageProps {
  paginationResult: PagedResult<UserResponse>;
  paginationHandlers: any;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

// Empty result to show when loading to prevent stale data flicker
const emptyResult: PagedResult<UserResponse> = {
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
};

const UserGridPage: React.FC<UserGridPageProps> = ({
  paginationResult,
  paginationHandlers,
  isLoading,
  error,
  onRetry,
}) => {
  const nav = useGenericNavigationFunctions();

  const handleUserClick = (user: UserResponse) => {
    nav.goToUserDetail(user.id!);
  };

  const { actionLoading, applyFilters, clearAll } =
    useGridFilters(paginationHandlers);

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

      <GridPage<UserResponse>
        pagedResult={isLoading ? emptyResult : (paginationResult ?? emptyResult)}
        gridConfig={USER_GRID_CONFIG}
        callbacks={
          {
            onPageChange: paginationHandlers?.changePage,
            onPageSizeChange: paginationHandlers?.changePageSize,
            renderItem: (user) => renderUserGridItem(user, handleUserClick),
          } as GridCallbacks<UserResponse>
        }
        testid={TEST_IDS.USER_PAGE}
        loading={isLoading}
      />
    </>
  );
};

export default UserGridPage;
