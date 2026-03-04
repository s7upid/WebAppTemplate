import type { ReactNode } from "react";
import { useAuth, useDashboardQuery } from "@/hooks";
import { PageHeader, LoadingSpinner, Card, List, Button, EmptyState } from "solstice-ui";
import { AuditLogTimeline } from "@/components";
import { Users, Shield, Key, Activity, Database, Settings } from "lucide-react";
import { TEST_IDS } from "@/config";
import { AuditLog } from "@/models";

function AdministratorDashboard() {
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
      <EmptyState
        title="Failed to load dashboard data"
        description={error}
        primaryAction={{ label: "Retry", onClick: () => refetch() }}
      />
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
          renderItem={(metric: ReactNode) => (
            <div className="db-metric-item">{metric}</div>
          )}
          listClassName="metrics-list"
          testId="metrics-list"
        />
        </Card>
      </div>
    </div>
  );
}

export default AdministratorDashboard;
