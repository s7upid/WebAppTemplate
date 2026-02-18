import React from "react";
import { useAuth, useDashboardQuery } from "@/hooks";
import {
  PageHeader,
  LoadingSpinner,
  DashboardCard,
  List,
  ActionButtons,
  AuditLogTimeline,
} from "@/components";
import { ActionButton } from "@/models/shared/actionButton";
import { Users, Shield, Key, Activity, Database, Settings } from "lucide-react";
import { TEST_IDS } from "@/config";
import { AuditLog } from "@/models";

const AdministratorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { recentLogs, isLoading, error, refetch } = useDashboardQuery();

  if (isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        className="dashboard-loading"
        text="Loading administrator dashboard..."
        data-testid={TEST_IDS.LOADING_SPINNER}
      />
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-500 text-lg">Failed to load dashboard data</div>
        <div className="text-gray-500 text-sm">{error}</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid={TEST_IDS.ADMINISTRATOR_DASHBOARD}>
      <PageHeader
        title={`Administrator Dashboard`}
        description={`Welcome back, ${user?.firstName}! Full system overview and control.`}
        icon={Shield}
      />

      <DashboardCard
        title="Recent Audit Events"
        icon={Activity}
        testId="recent-audit-logs"
      >
        <AuditLogTimeline
          logs={(recentLogs || []).filter(
            (log: AuditLog) => log.eventType !== "Login" && log.eventType !== "Logout"
          )}
          maxItems={10}
          emptyMessage="No recent activity logs"
        />
      </DashboardCard>

      <DashboardCard
        title="Quick Actions"
        icon={Settings}
        testId="quick-actions"
      >
        <ActionButtons
          actions={
            [
              {
                id: "manage-users",
                title: "Manage Users",
                description: "Users",
                onClick: () => {},
                icon: Users,
                testId: "manage-users",
              },
              {
                id: "manage-roles",
                title: "Manage Roles",
                description: "Roles",
                onClick: () => {},
                icon: Key,
                testId: "manage-roles",
              },
              {
                id: "system-settings",
                title: "System Settings",
                description: "Settings",
                onClick: () => {},
                icon: Settings,
                testId: "system-settings",
              },
            ] as ActionButton[]
          }
          columns={3}
          testId="quick-actions-list"
        />
      </DashboardCard>

      <DashboardCard
        title="Database Overview"
        icon={Database}
        testId="database-overview"
      >
        <List
          items={[]}
          renderItem={(metric) => (
            <div className="db-metric-item">{metric}</div>
          )}
          listClassName="metrics-list"
          testId="metrics-list"
        />
      </DashboardCard>
    </div>
  );
};

export default AdministratorDashboard;
