import React from "react";
import { useAuth } from "@/hooks";

interface RoleGuardProps {
  role: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ role, children, fallback }) => {
  const { user } = useAuth();

  const required = Array.isArray(role) ? role : [role];

  const hasRole = required.some((r) => user?.role?.name === r);

  if (!hasRole) return <>{fallback ?? null}</>;
  return <>{children}</>;
};

export default RoleGuard;
