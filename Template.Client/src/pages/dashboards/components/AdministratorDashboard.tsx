import React from "react";
import { useAuth, useDashboardQuery } from "@/hooks";
import {
  PageHeader,
  LoadingSpinner,
  Card,
  List,
  Button,
  AuditLogTimeline,
} from "@/components";
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
        <div className="text-red-500 dark:text-red-400 text-lg">Failed to load dashboard data</div>
        <div className="text-gray-500 dark:text-gray-400 text-sm">{error}</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
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

      <div data-testid="recent-audit-logs">
        <Card title="Recent Audit Events" icon={Activity}>
          <AuditLogTimeline
          logs={(recentLogs || []).filter(
            (log: AuditLog) => log.eventType !== "Login" && log.eventType !== "Logout"
          )}
          maxItems={10}
          emptyMessage="No recent activity logs"
          />
        </Card>
      </div>

      <div data-testid="quick-actions">
        <Card title="Quick Actions" icon={Settings}>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-testid="quick-actions-list"
          >
            <Button
              variant="secondary"
              icon={Users}
              onClick={() => {}}
              data-testid="manage-users"
              className="w-full justify-start"
            >
              Manage Users — Users
            </Button>
            <Button
              variant="secondary"
              icon={Key}
              onClick={() => {}}
              data-testid="manage-roles"
              className="w-full justify-start"
            >
              Manage Roles — Roles
            </Button>
            <Button
              variant="secondary"
              icon={Settings}
              onClick={() => {}}
              data-testid="system-settings"
              className="w-full justify-start"
            >
              System Settings — Settings
            </Button>
          </div>
        </Card>
      </div>

      <div data-testid="database-overview">
        <Card title="Database Overview" icon={Database}>
          <List
          items={[]}
          renderItem={(metric) => (
            <div className="db-metric-item">{metric}</div>
          )}
          listClassName="metrics-list"
          testId="metrics-list"
        />
        </Card>
      </div>
    </div>
  );
};

export default AdministratorDashboard;
