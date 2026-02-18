import {
  ToolbarFilterConfig,
  ToolbarSortField,
} from "@/models/shared/entityToolbar";

export const AUDIT_FILTERS: ToolbarFilterConfig[] = [
  {
    key: "eventType",
    label: "Event Type",
    options: [
      { label: "All", value: "" },
      { label: "Login", value: "Login" },
      { label: "Logout", value: "Logout" },
      { label: "TokenRefresh", value: "TokenRefresh" },
      { label: "PasswordChange", value: "PasswordChange" },
      { label: "PasswordReset", value: "PasswordReset" },
      { label: "EmailConfirmed", value: "EmailConfirmed" },
      { label: "Created", value: "Created" },
      { label: "Updated", value: "Updated" },
      { label: "Deleted", value: "Deleted" },
    ],
  },
  {
    key: "success",
    label: "Success",
    options: [
      { label: "All", value: "" },
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  },
];

export const AUDIT_SORT_FIELDS: ToolbarSortField[] = [
  { key: "timestamp", label: "Time" },
  { key: "eventType", label: "Event" },
];

