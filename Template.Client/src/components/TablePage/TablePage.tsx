import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { TEST_IDS } from "@/config";
import { PagedResult } from "@/models";
import Pagination from "../Pagination/Pagination";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import styles from "./TablePage.module.css";
import { cn } from "@/utils";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T, value: unknown) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface TableConfig<T> {
  columns: Column<T>[];
  emptyMessage?: string;
}

interface TableCallbacks<T> {
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRowClick?: (item: T) => void;
  onSort?: (field: string) => void;
}

interface TablePageProps<T> {
  pagedResult: PagedResult<T> | null | undefined;
  loading?: boolean;
  tableConfig: TableConfig<T>;
  callbacks?: TableCallbacks<T>;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  hideTable?: boolean;
  children?: React.ReactNode;
  error?: string | null;
  testid?: string;
}

function TablePage<T>({
  pagedResult,
  loading = false,
  tableConfig,
  callbacks,
  sortField,
  sortDirection,
  hideTable = false,
  children,
  error,
  testid,
}: TablePageProps<T>) {
  const [isPaging, setIsPaging] = useState(false);
  const prevPageRef = useRef<number | undefined>(undefined);
  const prevSizeRef = useRef<number | undefined>(undefined);

  const items = pagedResult?.items ?? ([] as T[]);
  const totalCount = pagedResult?.totalCount ?? 0;
  const pageNumber = pagedResult?.pageNumber ?? 1;
  const totalPages = pagedResult?.totalPages ?? 1;
  const pageSize = pagedResult?.pageSize ?? 10;
  const { columns, emptyMessage = "No data available" } = tableConfig;
  const { onPageChange, onPageSizeChange, onRowClick, onSort } =
    callbacks || {};

  useEffect(() => {
    if (
      prevPageRef.current !== undefined &&
      (pageNumber !== prevPageRef.current || pageSize !== prevSizeRef.current)
    ) {
      setIsPaging(false);
    }
    prevPageRef.current = pageNumber;
    prevSizeRef.current = pageSize;
  }, [pageNumber, pageSize]);

  const handlePageChange = useCallback(
    (page: number) => {
      setIsPaging(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      onPageChange?.(page);
    },
    [onPageChange]
  );

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setIsPaging(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      onPageSizeChange?.(size);
    },
    [onPageSizeChange]
  );

  if (error) {
    return (
      <div className={styles.loading} data-testid={`${testid}-error`}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!pagedResult || loading || isPaging) {
    return (
      <div className={styles.loading} data-testid={`${testid}-loading`}>
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid={`${testid}-page`}>
      {hideTable ? (
        children
      ) : (
        <>
          <div className={styles.card} data-testid={TEST_IDS.TABLE}>
            {items.length === 0 ? (
              <div
                className={styles.emptyContainer}
                data-testid={TEST_IDS.TABLE_EMPTY}
              >
                <p className={styles.empty}>{emptyMessage}</p>
              </div>
            ) : (
              <div className={styles.scroll}>
                <table className={styles.table}>
                  <thead className={styles.header}>
                    <tr>
                      {columns.map((column, index) => (
                        <th
                          key={index}
                          className={cn(
                            styles.headerCell,
                            column.sortable ? styles.headerCellHover : "",
                            column.className ?? ""
                          )}
                          onClick={() =>
                            column.sortable && onSort?.(String(column.key))
                          }
                          data-testid={`table-header-${String(column.key)}`}
                        >
                          <div className={styles.headerContent}>
                            <span>{column.label}</span>
                            {column.sortable && (
                              <div>
                                <svg
                                  className={cn(
                                    styles.iconSm,
                                    sortField === column.key &&
                                      sortDirection === "asc"
                                      ? styles.textPrimary
                                      : styles.iconGray
                                  )}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                                <svg
                                  className={cn(
                                    styles.iconSmOffset,
                                    sortField === column.key &&
                                      sortDirection === "desc"
                                      ? styles.textPrimary
                                      : styles.iconGray
                                  )}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={styles.body}>
                    {items.map((item, rowIndex) => (
                      <tr
                        key={rowIndex}
                        onClick={() => onRowClick?.(item)}
                        className={cn(
                          styles.row,
                          onRowClick ? "cursor-pointer" : ""
                        )}
                        data-testid={`table-row-${rowIndex}`}
                      >
                        {columns.map((column, colIndex) => {
                          const value =
                            typeof column.key === "string" &&
                            column.key.includes(".")
                              ? column.key
                                  .split(".")
                                  .reduce(
                                    (acc: unknown, key: string) =>
                                      acc && typeof acc === "object"
                                        ? (acc as Record<string, unknown>)[key]
                                        : undefined,
                                    item as unknown
                                  )
                              : (item as Record<string, unknown>)[
                                  String(column.key)
                                ];

                          return (
                            <td
                              key={colIndex}
                              className={cn(
                                styles.cell,
                                column.className ?? ""
                              )}
                              data-testid={`table-cell-${rowIndex}-${String(
                                column.key
                              )}`}
                            >
                              {column.render
                                ? column.render(item, value)
                                : (value as React.ReactNode)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && onPageChange && (
            <div
              className={styles.pagination}
              data-testid={TEST_IDS.PAGINATION}
            >
              <Pagination
                currentPage={pageNumber}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                totalItems={totalCount}
                pageSize={pageSize}
              />
            </div>
          )}
        </>
      )}
      {children}
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(TablePage) as typeof TablePage;
