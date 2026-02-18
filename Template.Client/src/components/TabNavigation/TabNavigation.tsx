import React, { useMemo, memo } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils";
import styles from "./TabNavigation.module.css";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  permission?: string;
  testId?: string;
  disabled?: boolean;
  badge?: string | number;
  isVisible?: boolean;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  hasPermission?: (permission: string) => boolean;
  className?: string;
  testId?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "pills" | "underline";
}

const SIZE_CLASSES = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

const VARIANT_CLASSES = {
  default: {
    base: styles.tab,
    active: styles.tabActive,
  },
  pills: {
    base: styles.tabPill,
    active: styles.tabPillActive,
  },
  underline: {
    base: styles.tabUnderline,
    active: styles.tabUnderlineActive,
  },
} as const;

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  hasPermission = () => true,
  className,
  testId,
  size = "md",
  variant = "default",
}) => {
  const visibleTabs = useMemo(
    () =>
      tabs.filter((tab) => {
        if (tab.isVisible !== undefined) return tab.isVisible;
        if (tab.permission) return hasPermission(tab.permission);
        return true;
      }),
    [tabs, hasPermission]
  );

  if (visibleTabs.length === 0) {
    return null;
  }

  if (visibleTabs.length === 1) {
    return null;
  }

  const variantStyle = VARIANT_CLASSES[variant];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div className={cn(styles.container, className)} data-testid={testId}>
      <div className={styles.content}>
        <div className={styles.tabList}>
          {visibleTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && onTabChange(tab.id)}
                disabled={tab.disabled}
                className={cn(
                  variantStyle.base,
                  sizeClass,
                  isActive && variantStyle.active,
                  tab.disabled && styles.tabDisabled
                )}
                data-testid={tab.testId || `${tab.id}-tab`}
              >
                {TabIcon && <TabIcon className={styles.icon} />}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={styles.badge}>{tab.badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(TabNavigation);
