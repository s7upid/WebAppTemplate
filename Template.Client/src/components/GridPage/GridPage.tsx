import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Pagination from "../Pagination/Pagination";
import { GridCallbacks, GridConfig, GridItem, PagedResult } from "@/models";
import { cn } from "@/utils";
import styles from "./GridPage.module.css";

interface GridPageProps<T extends GridItem> {
  pagedResult: PagedResult<T>;
  callbacks: GridCallbacks<T>;
  gridConfig?: GridConfig;
  testid?: string;
  loading?: boolean;
}

function GridPage<T extends GridItem>({
  pagedResult,
  callbacks,
  gridConfig,
  testid,
  loading = false,
}: GridPageProps<T>) {
  const { items, totalCount, pageNumber, totalPages, pageSize } = pagedResult;
  const { renderItem, onPageChange, onPageSizeChange } = callbacks;

  const [isPaging, setIsPaging] = useState(false);
  const prevPageRef = useRef(pageNumber);
  const prevSizeRef = useRef(pageSize);

  useEffect(() => {
    if (
      pageNumber !== prevPageRef.current ||
      pageSize !== prevSizeRef.current
    ) {
      prevPageRef.current = pageNumber;
      prevSizeRef.current = pageSize;
      setIsPaging(false);
    }
  }, [pageNumber, pageSize]);

  const handlePageChange = (page: number) => {
    setIsPaging(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPageChange?.(page);
  };

  const handlePageSizeChange = (size: number) => {
    setIsPaging(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPageSizeChange?.(size);
  };

  const showEmpty = items.length === 0;
  const EmptyIcon = gridConfig?.emptyStateIcon;
  const gridContainer = gridConfig?.gridContainerClass ?? styles.gridBase;
  const gridItem = gridConfig?.gridItemClass ?? styles.itemFullWidth;

  if (loading || isPaging) {
    return (
      <div className={styles.loading}>
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid={`${testid}-page`}>
      {!showEmpty ? (
        <>
          <div
            className={cn(styles.gridBase, gridContainer, styles.gridCols1To3)}
            data-testid={`${testid}-grid`}
          >
            {items.map((item, i) => (
              <div key={item.id} className={gridItem}>
                {renderItem(item, i)}
              </div>
            ))}
          </div>

          {onPageChange && (
            <div className={styles.gridMargin}>
              <Pagination
                currentPage={pageNumber}
                totalPages={totalPages}
                totalItems={totalCount}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className={styles.empty}>
          {EmptyIcon && <EmptyIcon className={styles.centerWithMargin} />}
          <h3>{gridConfig?.emptyStateTitle ?? "No items found"}</h3>
          <p className={styles.emptyText}>
            {gridConfig?.emptyStateDescription ?? "No items to display."}
          </p>
          {gridConfig?.emptyStateAction}
        </div>
      )}
    </div>
  );
}

export default GridPage;
