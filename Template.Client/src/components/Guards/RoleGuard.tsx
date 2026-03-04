import type { ReactNode } from "react";
import { useAuth } from "@/hooks";

interface RoleGuardProps {
  role: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
}

function RoleGuard({ role, children, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  const required = Array.isArray(role) ? role : [role];

  const hasRole = required.some((r) => user?.role?.name === r);

  if (!hasRole) return <>{fallback ?? null}</>;
  return <>{children}</>;
}

export default RoleGuard;
