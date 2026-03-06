import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { PermissionGridPage } from "@/pages";
import { BasePage, PermissionGuard } from "@/components";
import { usePermissionsQuery } from "@/hooks";
import { PageHeaderProps } from "@/models";
import {
  createPermissionManagementHeader,
  PERMISSION_KEYS,
} from "@/config";

function PermissionContainer() {
  const { paginationResult, paginationHandlers, isLoading, error, refetch } = usePermissionsQuery();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (paginationHandlers && !initializedRef.current) {
      initializedRef.current = true;
      paginationHandlers.refreshWithCurrentFilters();
    }
  }, [paginationHandlers]);

  const [headerProps] = useState<PageHeaderProps>(
    createPermissionManagementHeader()
  );

  return (
    <PermissionGuard permission={PERMISSION_KEYS.PERMISSIONS.VIEW}>
      <BasePage {...headerProps}>
        <Routes>
          <Route
            index
            element={
              <PermissionGridPage
                paginationResult={paginationResult!}
                paginationHandlers={paginationHandlers}
                isLoading={isLoading && paginationResult?.totalCount === 0}
                error={error ?? null}
                onRetry={refetch}
              />
            }
          />
        </Routes>
      </BasePage>
    </PermissionGuard>
  );
}

export default PermissionContainer;
