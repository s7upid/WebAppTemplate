import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { LoadingSpinner } from "@/components";
import { TEST_IDS, ROLE_KEYS } from "@/config";

const RoleBasedDashboardRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        className="dashboard-loading"
        text="Loading dashboard..."
        data-testid={TEST_IDS.LOADING_SPINNER}
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin =
    user.role?.name?.toLowerCase() === ROLE_KEYS.ADMINISTRATOR.toLowerCase();

  if (isAdmin) {
    return <Navigate to="/dashboard/administrator" replace />;
  }

  switch (user.role?.name) {
    case ROLE_KEYS.ADMINISTRATOR:
      return <Navigate to="/dashboard/administrator" replace />;
    case ROLE_KEYS.SUPPORT:
      return <Navigate to="/dashboard/support" replace />;
    case ROLE_KEYS.REGULATOR:
      return <Navigate to="/dashboard/regulator" replace />;
    case ROLE_KEYS.OPERATOR:
    default:
      return <Navigate to="/dashboard/operator" replace />;
  }
};

export default RoleBasedDashboardRedirect;
