import { useAuth } from "@/hooks";
import { PageHeader, LoadingSpinner } from "@/components";
import { TEST_IDS } from "@/config";
import { Monitor } from "lucide-react";

const OperatorDashboard: React.FC = () => {
  const { user } = useAuth();

  if (false) {
    return (
      <LoadingSpinner
        size="lg"
        className="dashboard-loading"
        text="Loading operator dashboard..."
        data-testid={TEST_IDS.LOADING_SPINNER}
      />
    );
  }

  return (
    <div className="space-y-6" data-testid={TEST_IDS.OPERATOR_DASHBOARD}>
      <PageHeader
        title={`Operator Dashboard`}
        description={`Welcome back, ${user?.firstName}! System operations and monitoring.`}
        icon={Monitor}
      />
    </div>
  );
};

export default OperatorDashboard;
