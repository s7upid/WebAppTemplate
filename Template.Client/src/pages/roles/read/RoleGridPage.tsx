import { useGenericNavigationFunctions } from "@/utils";
import { GridPage } from "solstice-ui";
import { EntityToolbar } from "@/components";
import { PagedResult, RoleResponse } from "@/models";
import { TEST_IDS } from "@/config";
import { useGridFilters, usePaginationWithScroll, type GridPaginationHandlers } from "@/hooks";
import {
  FILTERS,
  renderRoleGridItem,
  ROLE_GRID_CONFIG,
  SORT_FIELDS,
} from "../shared";

interface RoleGridPageProps {
  paginationResult: PagedResult<RoleResponse>;
  paginationHandlers: GridPaginationHandlers;
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
  const { onPageChange, onPageSizeChange } =
    usePaginationWithScroll(paginationHandlers);
  const { items, totalCount, pageNumber, totalPages, pageSize } =
    paginationResult;

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
      <GridPage<RoleResponse>
        content={toolbar}
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
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        testId={TEST_IDS.ROLE_PAGE}
      />
    </div>
  );
};

export default RoleGridPage;
