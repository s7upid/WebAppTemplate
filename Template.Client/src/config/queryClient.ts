import { QueryClient } from "@tanstack/react-query";
import { PageQuery } from "@/models";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/* ---------- Helper functions ---------- */
const rolesAll = ["roles"] as const;
const usersAll = ["users"] as const;
const permissionsAll = ["permissions"] as const;
const auditAll = ["audit"] as const;
const dashboardAll = ["dashboard"] as const;

export const queryKeys = {
  roles: {
    all: rolesAll,
    lists: () => [...rolesAll, "list"] as const,
    list: (query: PageQuery) => [...rolesAll, "list", query] as const,
    details: () => [...rolesAll, "detail"] as const,
    detail: (id: string) => [...rolesAll, "detail", id] as const,
  },

  users: {
    all: usersAll,
    lists: () => [...usersAll, "list"] as const,
    list: (query: PageQuery) => [...usersAll, "list", query] as const,
    details: () => [...usersAll, "detail"] as const,
    detail: (id: string) => [...usersAll, "detail", id] as const,
  },

  permissions: {
    all: permissionsAll,
    list: (query?: PageQuery) => [...permissionsAll, "list", query] as const,
  },

  audit: {
    all: auditAll,
    list: (query: PageQuery) => [...auditAll, "list", query] as const,
  },

  dashboard: {
    stats: () => [...dashboardAll, "stats"] as const,
    recentLogs: () => [...dashboardAll, "recentLogs"] as const,
  },
};
