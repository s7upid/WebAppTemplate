import React, { useState } from "react";
import { TablePage, EntityToolbar, ModalPage, PageHeader } from "@/components";
import RoleGuard from "@/components/Guards/RoleGuard";
import { useAuditQuery } from "@/hooks";
import { ROLE_NAMES as ROLE_KEYS } from "@/config/generated/permissionKeys.generated";
import type { AuditLog } from "@/models/generated";
import { Activity } from "lucide-react";
import { useAuditTableConfig } from "./useAuditTableConfig";
import { renderChangeValue } from "@/utils/auditLogUtils";
import { AUDIT_FILTERS, AUDIT_SORT_FIELDS } from "./auditConstants";

const AuditLogsPage: React.FC = () => {
  const { paginationResult, paginationHandlers, isLoading, error } = useAuditQuery();
  
  const [selectedChangeLog, setSelectedChangeLog] = useState<AuditLog | null>(null);
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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
      <TablePage
        loading={isLoading}
        pagedResult={paginationResult}
        sortField={sortField}
        sortDirection={sortDirection}
        tableConfig={tableConfig}
        callbacks={{
          onSort: handleSort,
          onPageChange: (page: number) => paginationHandlers?.changePage(page),
          onPageSizeChange: (size: number) => paginationHandlers?.changePageSize(size),
        }}
        error={error || null}
        testid="audit-logs"
      />

      <ModalPage
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
      </ModalPage>
    </RoleGuard>
  );
};

export default AuditLogsPage;
