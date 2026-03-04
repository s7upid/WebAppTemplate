import { useState, useCallback } from "react";

export interface GridPaginationHandlers {
  refreshWithParams?: (args: {
    searchTerm: string;
    filters: Record<string, string>;
    sortColumn?: string;
    ascending?: boolean;
  }) => Promise<void> | void;
  clearAll?: () => void;
}

export const useGridFilters = (paginationHandlers?: GridPaginationHandlers) => {
  const [actionLoading, setActionLoading] = useState(false);

  const applyFilters = useCallback(
    async (args: {
      searchTerm: string;
      filters: Record<string, string>;
      sortColumn?: string;
      ascending?: boolean;
    }) => {
      if (!paginationHandlers?.refreshWithParams) return;
      setActionLoading(true);
      try {
        await paginationHandlers.refreshWithParams({
          searchTerm: args.searchTerm,
          filters: args.filters,
          sortColumn: args.sortColumn,
          ascending: args.ascending,
        });
      } finally {
        setActionLoading(false);
      }
    },
    [paginationHandlers]
  );

  const clearAll = useCallback(() => {
    paginationHandlers?.clearAll?.();
  }, [paginationHandlers]);

  return { actionLoading, applyFilters, clearAll };
};
