import React from "react";
import { GridPage, LoadingSpinner, Pagination } from "solstice-ui";

export interface PaginatedGridHandlers {
  changePage?: (page: number) => void;
  changePageSize?: (size: number) => void;
}

export interface PaginatedGridProps<T> {
  /** Current page data */
  items: T[];
  /** Show loading spinner when true and items are empty */
  loading: boolean;
  /** Render each item as a card (or node) */
  renderCard: (item: T) => React.ReactNode;
  /** Grid columns 1–4. Default 3 */
  columns?: 1 | 2 | 3 | 4;
  /** Empty state title */
  emptyTitle?: string;
  /** Empty state description */
  emptyDescription?: string;
  /** Key for list items */
  keyExtractor: (item: T) => React.Key;
  /** Pagination state */
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  /** Handlers; when changePage is present and totalPages > 1, pagination is shown */
  paginationHandlers?: PaginatedGridHandlers;
  /** Optional wrapper data-testid */
  testId?: string;
}

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function PaginatedGrid<T>({
  items,
  loading,
  renderCard,
  columns = 3,
  emptyTitle = "No items found",
  emptyDescription,
  keyExtractor,
  pageNumber,
  totalPages,
  totalCount,
  pageSize,
  paginationHandlers,
  testId,
}: PaginatedGridProps<T>): React.ReactElement {
  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  const showPagination =
    totalPages > 1 &&
    paginationHandlers?.changePage &&
    paginationHandlers?.changePageSize;

  return (
    <div data-testid={testId ? `${testId}-page` : undefined}>
      <GridPage<T>
        items={items}
        renderCard={renderCard}
        columns={columns}
        loading={false}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        keyExtractor={keyExtractor}
      />
      {showPagination && (
        <div className="mt-4" data-testid="pagination">
          <Pagination
            currentPage={pageNumber}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={(page: number) => {
              scrollToTop();
              paginationHandlers.changePage?.(page);
            }}
            onPageSizeChange={(size: number) => {
              scrollToTop();
              paginationHandlers.changePageSize?.(size);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PaginatedGrid;
