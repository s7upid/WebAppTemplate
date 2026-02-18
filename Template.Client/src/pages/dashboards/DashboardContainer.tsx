import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdministratorDashboard from "./components/AdministratorDashboard";
import SupportDashboard from "./components/SupportDashboard";
import RegulatorDashboard from "./components/RegulatorDashboard";
import OperatorDashboard from "./components/OperatorDashboard";
import DashboardFactory from "./DashboardFactory";
import { RoleGuard } from "@/components";
import { ROLE_NAMES as ROLE_KEYS } from "@/config/generated/permissionKeys.generated";

const DashboardContainer: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DashboardFactory />} />
      <Route
        path="administrator"
        element={
          <RoleGuard role={[ROLE_KEYS.ADMINISTRATOR]}>
            <AdministratorDashboard />
          </RoleGuard>
        }
      />
      <Route
        path="support"
        element={
          <RoleGuard role={[ROLE_KEYS.SUPPORT, ROLE_KEYS.ADMINISTRATOR]}>
            <SupportDashboard />
          </RoleGuard>
        }
      />
      <Route
        path="regulator"
        element={
          <RoleGuard role={[ROLE_KEYS.REGULATOR, ROLE_KEYS.ADMINISTRATOR]}>
            <RegulatorDashboard />
          </RoleGuard>
        }
      />
      <Route
        path="operator"
        element={
          <RoleGuard role={[ROLE_KEYS.OPERATOR, ROLE_KEYS.ADMINISTRATOR]}>
            <OperatorDashboard />
          </RoleGuard>
        }
      />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default DashboardContainer;
