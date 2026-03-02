import { useAuth } from "@/hooks";
import { PageHeader } from "solstice-ui";
import { TEST_IDS } from "@/config";
import { Monitor } from "lucide-react";

const OperatorDashboard: React.FC = () => {
  const { user } = useAuth();

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
