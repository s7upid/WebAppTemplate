import { Card } from "solstice-ui";
import { TEST_IDS } from "@/config";
import { KeyIcon, Shield, UserIcon } from "lucide-react";
import type {
  GridConfig,
  RoleResponse,
  ToolbarFilterConfig,
  ToolbarSortField,
} from "@/models";

export const ROLE_GRID_CONFIG: GridConfig = {
  gridContainerClass: "grid-container",
  gridItemClass: "grid-item",
  emptyStateIcon: Shield,
  emptyStateTitle: "No roles found",
  emptyStateDescription: "Try adjusting your search or filter criteria.",
};

export const FILTERS: ToolbarFilterConfig[] = [
  {
    key: "type",
    label: "Type",
    options: [
      { label: "All", value: "all" },
      { label: "System", value: "system" },
      { label: "Custom", value: "custom" },
    ],
  },
];

export const SORT_FIELDS: ToolbarSortField[] = [
  { key: "createdAt", label: "Created At" },
  { key: "name", label: "Name" },
  { key: "userCount", label: "Users" },
  { key: "permissionsCount", label: "Permissions" },
];

export type RenderRoleItemFn = (
  role: RoleResponse,
  handleRoleClick: (r: RoleResponse) => void
) => React.ReactNode;

export const renderRoleGridItem: RenderRoleItemFn = (role, handleRoleClick) => (
  <div onClick={() => handleRoleClick(role)} className="grid-page-item">
    <Card
      title={role.name!}
      description={role.description}
      icon={Shield}
      data-testid={TEST_IDS.ROLE_ROW}
      stats={[
        {
          label: "Users",
          value: role.users?.length || 0,
          icon: UserIcon,
        },
        {
          label: "Permissions",
          value: role.permissions?.length || 0,
          icon: KeyIcon,
        },
      ]}
    />
  </div>
);
