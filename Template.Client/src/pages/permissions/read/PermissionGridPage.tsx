import React from "react";
import { PaginatedGrid, EntityToolbar } from "@/components";
import { PagedResult, PermissionResponse } from "@/models";
import { TEST_IDS } from "@/config";
import {
  FILTERS,
  PERMISSION_GRID_CONFIG,
  renderPermissionGridItem,
  SORT_FIELDS,
} from "../shared";
import { useGridFilters } from "@/hooks";

interface PermissionGridPageProps {
  paginationResult: PagedResult<PermissionResponse>;
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

  const { items, totalCount, pageNumber, totalPages, pageSize } = paginationResult;

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
      <PaginatedGrid<PermissionResponse>
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
        paginationHandlers={paginationHandlers}
        testId={TEST_IDS.PERMISSION_PAGE}
      />
    </>
  );
};

export default PermissionGridPage;
