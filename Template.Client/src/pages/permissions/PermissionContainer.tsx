import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { PermissionGridPage } from "@/pages";
import { BasePage, PermissionGuard } from "@/components";
import { usePermissionsQuery } from "@/hooks";
import { PageHeaderProps } from "@/models";
import {
  createPermissionManagementHeader,
  PERMISSION_KEYS,
} from "@/config";

const PermissionContainer: React.FC = () => {
  const { paginationResult, paginationHandlers, isLoading } = usePermissionsQuery();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (paginationHandlers && !initialized) {
      paginationHandlers.refreshWithCurrentFilters();
      setInitialized(true);
    }
  }, [paginationHandlers, initialized]);

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
              />
            }
          />
        </Routes>
      </BasePage>
    </PermissionGuard>
  );
};

export default PermissionContainer;
