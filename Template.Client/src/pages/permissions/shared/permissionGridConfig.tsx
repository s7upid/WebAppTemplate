import { Card } from "solstice-ui";
import { TEST_IDS } from "@/config";
import { Key, Settings } from "lucide-react";
import type {
  GridConfig,
  PermissionResponse,
  ToolbarFilterConfig,
  ToolbarSortField,
} from "@/models";

export const PERMISSION_GRID_CONFIG: GridConfig = {
  gridContainerClass: "grid-container",
  gridItemClass: "grid-item",
  emptyStateIcon: Key,
  emptyStateTitle: "No permissions found",
  emptyStateDescription: "Try adjusting your search or filter criteria.",
};

export const FILTERS: ToolbarFilterConfig[] = [
  {
    key: "category",
    label: "Category",
    options: [
      { value: "all", label: "All Categories" },
      { value: "auth", label: "auth" },
      { value: "users", label: "users" },
      { value: "roles", label: "roles" },
      { value: "permissions", label: "permissions" },
    ],
  },
];

export const SORT_FIELDS: ToolbarSortField[] = [
  { key: "createdAt", label: "Created At" },
  { key: "name", label: "Name" },
  { key: "resource", label: "Resource" },
  { key: "action", label: "Action" },
];

export type RenderPermissionItemFn = (
  user: PermissionResponse
) => React.ReactNode;

export const renderPermissionGridItem: RenderPermissionItemFn = (
  permission
) => (
  <Card
    title={permission.name}
    description={permission.description}
    icon={permission.isSystem ? Settings : Key}
    data-testid={TEST_IDS.PERMISSION_ROW}
    stats={[
      {
        label: "Resource",
        value: permission.resource,
        icon: Settings,
      },
      {
        label: "Action",
        value: permission.action,
        icon: Key,
      },
    ]}
  />
);
