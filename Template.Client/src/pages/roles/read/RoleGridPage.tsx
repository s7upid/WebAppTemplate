import { useGenericNavigationFunctions } from "@/utils";
import { DataPage } from "solstice-ui";
import { EntityToolbar } from "@/components";
import { PagedResult, RoleResponse } from "@/models";
import { TEST_IDS } from "@/config";
import { useGridFilters, usePaginationWithScroll, type GridListPaginationHandlers } from "@/hooks";
import {
  FILTERS,
  renderRoleGridItem,
  ROLE_GRID_CONFIG,
  SORT_FIELDS,
} from "../shared";

interface RoleGridPageProps {
  paginationResult: PagedResult<RoleResponse>;
  paginationHandlers: GridListPaginationHandlers;
  isLoading: boolean;
}

function RoleGridPage({
  paginationResult,
  paginationHandlers,
  isLoading,
}: RoleGridPageProps) {
  const nav = useGenericNavigationFunctions();
  const handleRoleClick = (role: RoleResponse) => nav.goToRoleDetail(role.id);
  const { actionLoading, applyFilters, clearAll } =
    useGridFilters(paginationHandlers);
  const { onPageChange, onPageSizeChange } =
    usePaginationWithScroll(paginationHandlers);
  const { items, pageNumber, totalPages, pageSize } = paginationResult;

  const toolbar = (
    <EntityToolbar
      searchPlaceholder="Search roles..."
      filters={FILTERS}
      sortFields={SORT_FIELDS}
      loading={actionLoading}
      onApply={applyFilters}
      onClear={clearAll}
    />
  );

  return (
    <div data-testid={`${TEST_IDS.ROLE_PAGE}-page`}>
      <DataPage<RoleResponse>
        layout="grid"
        contentBetweenHeaderAndContent={toolbar}
        items={items}
        loading={isLoading}
        renderCard={(role: RoleResponse) => renderRoleGridItem(role, handleRoleClick)}
        columns={3}
        emptyTitle={ROLE_GRID_CONFIG.emptyStateTitle ?? "No items found"}
        emptyDescription={ROLE_GRID_CONFIG.emptyStateDescription}
        keyExtractor={(role: RoleResponse) => role.id ?? ""}
        currentPage={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}

export default RoleGridPage;
