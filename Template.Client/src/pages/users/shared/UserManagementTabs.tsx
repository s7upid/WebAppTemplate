import React from "react";
import { TabNavigation, TabItem } from "@/components";
import { USERS_MODULE, UserManagementPermissions } from "@/config/modules";

interface UserManagementTabsProps {
  permissions: UserManagementPermissions;
  activeTab: "all" | "pending";
  onTabChange: (tab: "all" | "pending") => void;
}

/**
 * User Management Tabs - Uses the reusable TabNavigation component
 * with configuration from the users module.
 */
const UserManagementTabs: React.FC<UserManagementTabsProps> = ({
  permissions,
  activeTab,
  onTabChange,
}) => {
  // Convert module page tabs to TabItem format with visibility based on permissions
  const tabs: TabItem[] = (USERS_MODULE.pageTabs ?? []).map((tab) => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
    testId: tab.testId,
    // Use isVisible to control tab visibility based on permissions
    isVisible: tab.id === "pending" ? permissions.canApproveUsers : true,
  }));

  return (
    <TabNavigation
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => onTabChange(tabId as "all" | "pending")}
      testId={USERS_MODULE.testIds.tabs}
    />
  );
};

export default UserManagementTabs;
