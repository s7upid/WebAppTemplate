import { DataPage } from "solstice-ui";
import { EntityToolbar } from "@/components";
import { PagedResult, PermissionResponse } from "@/models";
import { TEST_IDS } from "@/config";
import {
  FILTERS,
  PERMISSION_GRID_CONFIG,
  renderPermissionGridItem,
  SORT_FIELDS,
} from "../shared";
import { useGridFilters, usePaginationWithScroll, type GridListPaginationHandlers } from "@/hooks";

interface PermissionGridPageProps {
  paginationResult: PagedResult<PermissionResponse>;
  paginationHandlers: GridListPaginationHandlers;
  isLoading: boolean;
}

function PermissionGridPage({
  paginationResult,
  paginationHandlers,
  isLoading,
}: PermissionGridPageProps) {
  const { actionLoading, applyFilters, clearAll } =
    useGridFilters(paginationHandlers);
  const { onPageChange, onPageSizeChange } =
    usePaginationWithScroll(paginationHandlers);
  const { items, pageNumber, totalPages, pageSize } = paginationResult;

  const toolbar = (
    <EntityToolbar
      searchPlaceholder="Search permissions..."
      filters={FILTERS}
      sortFields={SORT_FIELDS}
      loading={actionLoading}
      onApply={applyFilters}
      onClear={clearAll}
    />
  );

  return (
    <div data-testid={`${TEST_IDS.PERMISSION_PAGE}-page`}>
      <DataPage<PermissionResponse>
        layout="grid"
        contentBetweenHeaderAndContent={toolbar}
        items={items}
        loading={isLoading}
        renderCard={(permission: PermissionResponse) => renderPermissionGridItem(permission)}
        columns={3}
        emptyTitle={PERMISSION_GRID_CONFIG.emptyStateTitle ?? "No items found"}
        emptyDescription={PERMISSION_GRID_CONFIG.emptyStateDescription}
        keyExtractor={(p: PermissionResponse) => p.id ?? p.key ?? ""}
        currentPage={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}

export default PermissionGridPage;
