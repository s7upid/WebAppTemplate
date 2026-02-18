import React from "react";
import { PermissionGuard } from "@/components";
import { PERMISSION_KEYS } from "@/config";
import RoleBasedDashboardRedirect from "./RoleBasedDashboardRedirect";

const HomePage: React.FC = () => {
  return (
    <PermissionGuard permissions={[PERMISSION_KEYS.DASHBOARD.VIEW]}>
      <RoleBasedDashboardRedirect />
    </PermissionGuard>
  );
};

export default HomePage;
