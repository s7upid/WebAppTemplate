import { useAuth } from "@/hooks";
import AdministratorDashboard from "./components/AdministratorDashboard";
import SupportDashboard from "./components/SupportDashboard";
import RegulatorDashboard from "./components/RegulatorDashboard";
import OperatorDashboard from "./components/OperatorDashboard";
import { LoadingSpinner } from "solstice-ui";
import { TEST_IDS, ROLE_KEYS } from "@/config";

function DashboardFactory() {
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
    return (
      <div className="space-y-6" data-testid={TEST_IDS.NO_USER}>
        <h2>Access Denied</h2>
        <p>Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div data-testid={TEST_IDS.DASHBOARD}>
      {(() => {
        switch (user.role?.name) {
          case ROLE_KEYS.ADMINISTRATOR:
            return <AdministratorDashboard />;
          case ROLE_KEYS.SUPPORT:
            return <SupportDashboard />;
          case ROLE_KEYS.REGULATOR:
            return <RegulatorDashboard />;
          case ROLE_KEYS.OPERATOR:
          default:
            return <OperatorDashboard />;
        }
      })()}
    </div>
  );
}

export default DashboardFactory;
