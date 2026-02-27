import { useGenericNavigationFunctions } from "@/utils";
import { PaginatedGrid, EntityToolbar } from "@/components";
import { PagedResult, RoleResponse } from "@/models";
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
  const handleRoleClick = (role: RoleResponse) => nav.goToRoleDetail(role.id);
  const { actionLoading, applyFilters, clearAll } =
    useGridFilters(paginationHandlers);

  const { items, totalCount, pageNumber, totalPages, pageSize } = paginationResult;

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
      <PaginatedGrid<RoleResponse>
        items={items}
        loading={isLoading}
        renderCard={(role) => renderRoleGridItem(role, handleRoleClick)}
        columns={3}
        emptyTitle={ROLE_GRID_CONFIG.emptyStateTitle ?? "No items found"}
        emptyDescription={ROLE_GRID_CONFIG.emptyStateDescription}
        keyExtractor={(role) => role.id ?? ""}
        pageNumber={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        paginationHandlers={paginationHandlers}
        testId={TEST_IDS.ROLE_PAGE}
      />
    </>
  );
};

export default RoleGridPage;
