import { Card, Button } from "solstice-ui";
import { LucideIcon } from "lucide-react";

export interface QuickActionItem {
  id: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  testId: string;
  onClick: () => void;
}

interface QuickActionsProps {
  title?: string;
  icon?: LucideIcon;
  iconSize?: "sm" | "md";
  actions: QuickActionItem[];
  testId?: string;
}

/**
 * Renders a Card with a responsive grid of secondary Buttons (solstice-ui).
 * Use for detail-page "Quick Actions" (e.g. Edit, Manage Roles).
 */
function QuickActions({
  title = "Quick Actions",
  icon,
  iconSize = "sm",
  actions,
  testId,
}: QuickActionsProps) {
  if (actions.length === 0) return null;

  return (
    <Card title={title} icon={icon} iconSize={iconSize}>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        data-testid={testId}
      >
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="secondary"
            icon={action.icon}
            onClick={action.onClick}
            data-testid={action.testId}
            className="w-full justify-start"
          >
            {action.description
              ? `${action.title} — ${action.description}`
              : action.title}
          </Button>
        ))}
      </div>
    </Card>
  );
}

export default QuickActions;
