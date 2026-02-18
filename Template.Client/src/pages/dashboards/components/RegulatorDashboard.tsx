import { useAuth } from "@/hooks";
import { PageHeader, LoadingSpinner } from "@/components";
import { TEST_IDS } from "@/config";
import { Shield } from "lucide-react";

const RegulatorDashboard: React.FC = () => {
  const { user } = useAuth();

  if (false) {
    return (
      <LoadingSpinner
        size="lg"
        className="dashboard-loading"
        text="Loading regulator dashboard..."
        data-testid={TEST_IDS.LOADING_SPINNER}
      />
    );
  }

  return (
    <div className="space-y-6" data-testid={TEST_IDS.REGULATOR_DASHBOARD}>
      <PageHeader
        title={`Regulator Dashboard`}
        description={`Welcome back, ${user?.firstName}! Monitor compliance and regulatory oversight.`}
        icon={Shield}
      />
    </div>
  );
};

export default RegulatorDashboard;
