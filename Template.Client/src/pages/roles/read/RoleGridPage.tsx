import { useGenericNavigationFunctions } from "@/utils";
import { GridPage, EntityToolbar } from "@/components";
import { PagedResult, RoleResponse } from "@/models";
import { GridCallbacks } from "@/models/shared/grid";
import { TEST_IDS } from "@/config";
import { useGridFilters } from "@/hooks";
import {
  FILTERS,
  renderRoleGridItem,
  ROLE_GRID_CONFIG,
  SORT_FIELDS,
} from "../shared";

interface RoleGridPageProps {
  paginationResult: PagedResult<RoleResponse>;
  paginationHandlers: any;
  isLoading: boolean;
}

const RoleGridPage: React.FC<RoleGridPageProps> = ({
  paginationResult,
  paginationHandlers,
  isLoading,
}) => {
  const nav = useGenericNavigationFunctions();

  const handleRoleClick = (role: RoleResponse) => {
    nav.goToRoleDetail(role.id);
  };

  const { actionLoading, applyFilters, clearAll } =
    useGridFilters(paginationHandlers);

  return (
    <>
      <EntityToolbar
        searchPlaceholder="Search roles..."
        filters={FILTERS}
        sortFields={SORT_FIELDS}
        loading={actionLoading}
        onApply={applyFilters}
        onClear={clearAll}
      />

      <GridPage<RoleResponse>
        pagedResult={paginationResult}
        gridConfig={ROLE_GRID_CONFIG}
        callbacks={
          {
            onPageChange: paginationHandlers?.changePage,
            onPageSizeChange: paginationHandlers?.changePageSize,
            renderItem: (user) => renderRoleGridItem(user, handleRoleClick),
          } as GridCallbacks<RoleResponse>
        }
        testid={TEST_IDS.ROLE_PAGE}
        loading={isLoading && paginationResult.totalCount === 0}
      />
    </>
  );
};

export default RoleGridPage;
