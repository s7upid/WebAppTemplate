import { Button, Card } from "solstice-ui";
import { TEST_IDS } from "@/config";
import {
  Calendar,
  CheckCircle,
  Key,
  Mail,
  UserCheck,
  UserIcon,
  Users,
  XCircle,
} from "lucide-react";
import type {
  GridConfig,
  ToolbarFilterConfig,
  ToolbarSortField,
  UserResponse,
} from "@/models";

export const USER_GRID_CONFIG: GridConfig = {
  gridContainerClass: "grid-container",
  gridItemClass: "grid-item",
  emptyStateIcon: UserCheck,
  emptyStateTitle: "No users found",
  emptyStateDescription: "Try adjusting your search or filter criteria.",
};

export const PENDING_USER_GRID_CONFIG: GridConfig = {
  gridContainerClass: "grid-container",
  gridItemClass: "grid-item",
  emptyStateIcon: UserCheck,
  emptyStateTitle: "No pending user registrations",
  emptyStateDescription: "You're all caught up.",
};

export const FILTERS: ToolbarFilterConfig[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "All", value: "all" },
      { label: "Active", value: "active" },
      { label: "Pending", value: "pending" },
      { label: "Suspended", value: "suspended" },
    ],
  },
];

export const SORT_FIELDS: ToolbarSortField[] = [
  { key: "createdAt", label: "Created At" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
];

export type RenderPendingUserItemFn = (
  user: UserResponse,
  openApprovalModal: (u: UserResponse) => void,
  openRejectionModal: (u: UserResponse) => void
) => React.ReactNode;

export const renderPendingUserGridItem: RenderPendingUserItemFn = (
  user,
  openApprovalModal,
  openRejectionModal
) => (
  <div className="pending-user-item">
    <Card
      title={`${user.firstName} ${user.lastName}`}
      description={user.email}
      icon={UserIcon}
      layout="horizontal"
      status={user.userStatus}
      detailsPerRow={2}
      details={[
        {
          label: "Role",
          value:
            (user.role?.name || "") +
            (() => {
              return "";
            })(),
          icon: Key,
        },
        {
          label: "Permissions",
          value: `${user.permissionKeys?.length || 0} assigned`,
          icon: Users,
        },
        {
          label: "Login",
          value: user.lastLogin
            ? new Date(user.lastLogin).toLocaleDateString()
            : "Never",
          icon: Calendar,
        },
        {
          label: "Created",
          value: new Date(user.createdAt).toLocaleDateString(),
          icon: Mail,
        },
      ]}
      data-testid={TEST_IDS.PENDING_USER_CARD}
    />
    <div className="pending-user-actions">
      <Button
        variant="success"
        size="md"
        icon={CheckCircle}
        className="w-full sm:w-auto"
        onClick={() => openApprovalModal(user)}
      >
        Approve
      </Button>
      <Button
        variant="danger"
        size="md"
        icon={XCircle}
        className="w-full sm:w-auto"
        onClick={() => openRejectionModal(user)}
      >
        Reject
      </Button>
    </div>
  </div>
);

export type RenderUserItemFn = (
  user: UserResponse,
  handleClick: (u: UserResponse) => void
) => React.ReactNode;

export const renderUserGridItem: RenderUserItemFn = (user, handleClick) => (
  <div
    onClick={() => handleClick(user)}
    className="grid-page-item"
    data-testid={TEST_IDS.USER_ROW}
  >
    <Card
      title={`${user.firstName} ${user.lastName}`}
      description={user.email}
      icon={UserIcon}
      avatar={user.avatar}
      layout="vertical"
      status={user.userStatus}
      detailsPerRow={2}
      details={[
        {
          label: "Role",
          value: user.role?.name || "No role",
          icon: Key,
        },
        {
          label: "Custom Permissions",
          value: `${user.customPermissionsCount} assigned`,
          icon: Users,
        },
        {
          label: "Login",
          value: user.lastLogin
            ? new Date(user.lastLogin).toLocaleDateString()
            : "Never",
          icon: Calendar,
        },
        {
          label: "Created",
          value: new Date(user.createdAt!).toLocaleDateString(),
          icon: Mail,
        },
      ]}
    />
  </div>
);
