import { useAuth } from "@/hooks";
import { PageHeader } from "solstice-ui";
import { TEST_IDS } from "@/config";
import { HelpCircle } from "lucide-react";

const SupportDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6" data-testid={TEST_IDS.SUPPORT_DASHBOARD}>
      <PageHeader
        title={`Support Dashboard`}
        description={`Welcome back, ${user?.firstName}! Customer support and user assistance.`}
        icon={HelpCircle}
      />
    </div>
  );
};

export default SupportDashboard;
