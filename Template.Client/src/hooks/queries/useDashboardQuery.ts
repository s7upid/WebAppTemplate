import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { dashboardService } from "@/services/entities/dashboardService";
import { queryKeys } from "@/config/queryClient";
import { AuditLog } from "@/models";

export const useDashboardQuery = () => {
  const {
    data: logsResponse,
    isLoading: isLogsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: queryKeys.dashboard.recentLogs(),
    queryFn: () => dashboardService.getRecentAuditLogs(),
    staleTime: 30 * 1000,
  });

  return useMemo(
    () => ({
      recentLogs: (logsResponse?.data?.items ?? []) as AuditLog[],
      isLoading: isLogsLoading,
      error: logsError?.message ?? null,
      refetchLogs,
      refetch: refetchLogs,
    }),
    [logsResponse?.data?.items, isLogsLoading, logsError?.message, refetchLogs]
  );
};
