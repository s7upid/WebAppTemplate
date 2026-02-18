import { ApiResponse } from "@/models/shared/api";
import { AuditLog, PagedResult } from "@/models";
import { BaseService } from "../base/baseService";
import { DASHBOARD_MODULE } from "@/config/modules";

const API = DASHBOARD_MODULE.routes.api;

class DashboardService extends BaseService {
  constructor() {
    super("dashboard");
  }

  async getRecentAuditLogs(): Promise<ApiResponse<PagedResult<AuditLog>>> {
    if (this.useMockData) {
      return {
        success: true,
        data: {
          items: [],
          totalCount: 0,
          pageNumber: 1,
          pageSize: 50,
          totalPages: 0,
        },
        message: "Recent audit logs retrieved successfully",
        fieldErrors: {},
      };
    }

    return this.request<PagedResult<AuditLog>>(
      (API.recentLogs as () => string)()
    );
  }
}

export const dashboardService = new DashboardService();
