import { PERMISSIONS_MODULE } from "@/config/modules";
import { BaseService } from "../base/baseService";
import { mockPermission } from "@/mock";
import { ApiResponse } from "@/models/shared/api";
import { PermissionResponse, PageQuery, PagedResult, QueryBuilder } from "@/models";

const API = PERMISSIONS_MODULE.routes.api;

class PermissionService extends BaseService {
  constructor() {
    super("permissions");
  }

  async getPermissions(
    query: PageQuery
  ): Promise<ApiResponse<PagedResult<PermissionResponse>>> {
    if (this.useMockData) return mockPermission.getPermissions(query);

    const params = QueryBuilder.create(query).buildQueryParams();
    return this.request<PagedResult<PermissionResponse>>(API.list(params));
  }
}

export const permissionService = new PermissionService();
