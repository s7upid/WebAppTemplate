import { useCallback } from "react";
import { scrollToTop } from "@/utils";

export interface PaginationHandlers {
  changePage?: (page: number) => void;
  changePageSize?: (size: number) => void;
}

/** Returns pagination callbacks that scroll to top then delegate. */
export function usePaginationWithScroll(handlers?: PaginationHandlers | null) {
  const onPageChange = useCallback(
    (page: number) => {
      scrollToTop();
      handlers?.changePage?.(page);
    },
    [handlers]
  );

  const onPageSizeChange = useCallback(
    (size: number) => {
      scrollToTop();
      handlers?.changePageSize?.(size);
    },
    [handlers]
  );

  return { onPageChange, onPageSizeChange };
}
