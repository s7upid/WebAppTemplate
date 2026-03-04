import React, { useState } from "react";
import {
  Alert,
  Card,
  EmptyState,
  PageHeader,
  Dialog,
  LoadingSpinner,
  Pagination,
} from "solstice-ui";
import { EntityToolbar } from "@/components";
import RoleGuard from "@/components/Guards/RoleGuard";
import { useAuditQuery } from "@/hooks";
import { ROLE_NAMES as ROLE_KEYS } from "@/config/generated/permissionKeys.generated";
import { TEST_IDS } from "@/config";
import type { AuditLog } from "@/models/generated";
import { Activity } from "lucide-react";
import { useAuditTableConfig } from "./useAuditTableConfig";
import { renderChangeValue } from "@/utils/auditLogUtils";
import { scrollToTop, cn } from "@/utils";
import { AUDIT_FILTERS, AUDIT_SORT_FIELDS } from "./auditConstants";

function AuditLogsPage() {
  const { paginationResult, paginationHandlers, isLoading, error } = useAuditQuery();

  const [selectedChangeLog, setSelectedChangeLog] = useState<AuditLog | null>(null);
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isPaging, setIsPaging] = useState(false);

  const tableConfig = useAuditTableConfig(setSelectedChangeLog);

  const applyFilters = (args: {
    searchTerm: string;
    filters: Record<string, string>;
    sortColumn?: string;
    ascending?: boolean;
  }) => {
    if (args.sortColumn) {
      setSortField(args.sortColumn);
      setSortDirection(args.ascending ? "asc" : "desc");
    }
    paginationHandlers?.refreshWithParams({
      searchTerm: args.searchTerm,
      filters: args.filters,
      sortColumn: args.sortColumn || sortField,
      ascending: args.ascending ?? sortDirection === "asc",
    });
  };

  const clearAll = () => {
    setSortField("timestamp");
    setSortDirection("desc");
    paginationHandlers?.clearAll();
  };

  const handleSort = (field: string) => {
    const newDirection = field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    paginationHandlers?.refreshWithParams({
      sortColumn: field,
      ascending: newDirection === "asc",
    });
  };

  const handlePageChange = (page: number) => {
    setIsPaging(true);
    scrollToTop();
    paginationHandlers?.changePage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setIsPaging(true);
    scrollToTop();
    paginationHandlers?.changePageSize(size);
  };

  const items = paginationResult?.items ?? [];
  const totalCount = paginationResult?.totalCount ?? 0;
  const pageNumber = paginationResult?.pageNumber ?? 1;
  const totalPages = paginationResult?.totalPages ?? 1;
  const pageSize = paginationResult?.pageSize ?? 10;
  const { columns } = tableConfig;
  const emptyMessage = "No data available";

  const showLoading = isLoading || isPaging;

  React.useEffect(() => {
    if (paginationResult) {
      setIsPaging(false);
    }
  }, [paginationResult]);

  return (
    <RoleGuard role={[ROLE_KEYS.ADMINISTRATOR]}>
      <PageHeader
        title="Audit Events"
        description="Full system audit logs."
        icon={Activity}
      />
      <EntityToolbar
        searchPlaceholder="Search audit logs..."
        sortFields={AUDIT_SORT_FIELDS}
        filters={AUDIT_FILTERS}
        onApply={applyFilters}
        onClear={clearAll}
      />

      <div className="space-y-4" data-testid="audit-logs-page">
        {error ? (
          <Alert variant="error" data-testid="audit-logs-error">
            {error}
          </Alert>
        ) : showLoading ? (
          <div className="flex items-center justify-center min-h-96" data-testid={TEST_IDS.TABLE_LOADING}>
            <LoadingSpinner size="lg" text="Loading..." />
          </div>
        ) : (
          <>
            <Card>
              <div className="overflow-x-auto">
                {items.length === 0 ? (
                  <EmptyState
                    title={emptyMessage}
                    data-testid={TEST_IDS.TABLE_EMPTY}
                  />
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {columns.map((column, index) => (
                          <th
                            key={index}
                            className={cn(
                              "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider",
                              (column as { sortable?: boolean }).sortable && "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                            )}
                            onClick={() => (column as { sortable?: boolean }).sortable && handleSort(String(column.key))}
                            data-testid={`table-header-${String(column.key)}`}
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {items.map((item, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          data-testid={`table-row-${rowIndex}`}
                        >
                          {columns.map((column, colIndex) => {
                            const value =
                              typeof column.key === "string" && column.key.includes(".")
                                ? (column.key
                                    .split(".")
                                    .reduce(
                                      (acc: unknown, key: string) =>
                                        acc && typeof acc === "object"
                                          ? (acc as Record<string, unknown>)[key]
                                          : undefined,
                                      item as unknown
                                    ))
                                : (item as unknown as Record<string, unknown>)[String(column.key)];

                            return (
                              <td
                                key={colIndex}
                                className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                                data-testid={`table-cell-${rowIndex}-${String(column.key)}`}
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
                )}
              </div>
            </Card>

            {totalPages > 1 && (
              <div data-testid={TEST_IDS.PAGINATION}>
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
        )}
      </div>

      <Dialog
        isOpen={!!selectedChangeLog}
        onClose={() => setSelectedChangeLog(null)}
        title="Change Details"
        size="md"
      >
        {selectedChangeLog && (
          <div className="audit-change-details">
            <div className="audit-change-event-info">
              <span className="audit-change-event-type">
                {selectedChangeLog.eventType}
              </span>
              <span className="audit-change-event-time">
                {selectedChangeLog.timestamp
                  ? new Date(selectedChangeLog.timestamp).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            {selectedChangeLog.preChangeValue && (
              <div className="audit-change-section">
                <div className="audit-change-label-before">Before</div>
                <div className="audit-change-value-before">
                  {renderChangeValue(selectedChangeLog.preChangeValue)}
                </div>
              </div>
            )}
            {selectedChangeLog.postChangeValue && (
              <div className="audit-change-section">
                <div className="audit-change-label-after">After</div>
                <div className="audit-change-value-after">
                  {renderChangeValue(selectedChangeLog.postChangeValue)}
                </div>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </RoleGuard>
  );
}

export default AuditLogsPage;
