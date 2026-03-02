import React from "react";
import { GridPage } from "solstice-ui";
import { EntityToolbar } from "@/components";
import { PagedResult, PermissionResponse } from "@/models";
import { TEST_IDS } from "@/config";
import {
  FILTERS,
  PERMISSION_GRID_CONFIG,
  renderPermissionGridItem,
  SORT_FIELDS,
} from "../shared";
import { useGridFilters, usePaginationWithScroll, type GridPaginationHandlers } from "@/hooks";

interface PermissionGridPageProps {
  paginationResult: PagedResult<PermissionResponse>;
  paginationHandlers: GridPaginationHandlers;
  isLoading: boolean;
}

const PermissionGridPage: React.FC<PermissionGridPageProps> = ({
  paginationResult,
  paginationHandlers,
  isLoading,
}) => {
  const { actionLoading, applyFilters, clearAll } =
    useGridFilters(paginationHandlers);
  const { onPageChange, onPageSizeChange } =
    usePaginationWithScroll(paginationHandlers);
  const { items, totalCount, pageNumber, totalPages, pageSize } =
    paginationResult;

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
      <GridPage<PermissionResponse>
        content={toolbar}
        items={items}
        loading={isLoading}
        renderCard={(permission) => renderPermissionGridItem(permission)}
        columns={3}
        emptyTitle={PERMISSION_GRID_CONFIG.emptyStateTitle ?? "No items found"}
        emptyDescription={PERMISSION_GRID_CONFIG.emptyStateDescription}
        keyExtractor={(p) => p.id ?? p.key ?? ""}
        pageNumber={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        testId={TEST_IDS.PERMISSION_PAGE}
      />
    </div>
  );
};

export default PermissionGridPage;
