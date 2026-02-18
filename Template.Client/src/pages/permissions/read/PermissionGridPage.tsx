import { GridPage, EntityToolbar } from "@/components";
import { PagedResult, Permission, PermissionResponse } from "@/models";
import { GridCallbacks } from "@/models/shared/grid";
import { TEST_IDS } from "@/config";
import {
  FILTERS,
  PERMISSION_GRID_CONFIG,
  renderPermissionGridItem,
  SORT_FIELDS,
} from "../shared";
import { useGridFilters } from "@/hooks";

interface PermissionGridPageProps {
  paginationResult: PagedResult<Permission>;
  paginationHandlers: any;
  isLoading: boolean;
}

const PermissionGridPage: React.FC<PermissionGridPageProps> = ({
  paginationResult,
  paginationHandlers,
  isLoading,
}) => {
  const { actionLoading, applyFilters, clearAll } =
    useGridFilters(paginationHandlers);

  return (
    <>
      <EntityToolbar
        searchPlaceholder="Search permissions..."
        filters={FILTERS}
        sortFields={SORT_FIELDS}
        loading={actionLoading}
        onApply={applyFilters}
        onClear={clearAll}
      />

      <GridPage<PermissionResponse>
        pagedResult={paginationResult}
        gridConfig={PERMISSION_GRID_CONFIG}
        callbacks={
          {
            renderItem: (permission) => renderPermissionGridItem(permission),
            onPageChange: paginationHandlers?.changePage,
            onPageSizeChange: paginationHandlers?.changePageSize,
          } as GridCallbacks<PermissionResponse>
        }
        testid={TEST_IDS.PERMISSION_PAGE}
        loading={isLoading && paginationResult.totalCount === 0}
      />
    </>
  );
};

export default PermissionGridPage;
