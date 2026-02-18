import { AUDIT_MODULE } from "@/config/modules";
import { BaseService } from "../base/baseService";
import { ApiResponse } from "@/models/shared/api";
import { PagedResult, AuditLog, PageQuery, QueryBuilder } from "@/models";

const API = AUDIT_MODULE.routes.api;

class AuditService extends BaseService {
  constructor() {
    super("audit");
  }

  async getLogs(query: PageQuery): Promise<ApiResponse<PagedResult<AuditLog>>> {
    if (query === undefined) {
      query = {
        page: 1,
        sortColumn: "Timestamp",
        ascending: false,
        pageSize: 50,
      } as PageQuery;
    }

    const params = QueryBuilder.create(query).buildQueryParams();
    return this.request<PagedResult<AuditLog>>(API.list(params));
  }
}

export const auditService = new AuditService();
