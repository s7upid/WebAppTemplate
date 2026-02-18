import PageHeader from "../PageHeader/PageHeader";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";
import { TEST_IDS } from "@/config";
import styles from "./BasePage.module.css";
import React from "react";
import { LucideIcon } from "lucide-react";

interface BasePageProps {
  title: string;
  description?: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  children: React.ReactNode;
  error?: string | null;
  className?: string;
  testId?: string;
}

const BasePage: React.FC<BasePageProps> = ({
  title,
  description,
  subtitle,
  icon,
  actions,
  tabs,
  children,
  error = null,
  className = "",
  testId,
}) => {
  if (error) {
    return (
      <div className={styles.errorBox}>
        <div className={styles.errorBoxText}>{error}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={className} data-testid={testId ?? TEST_IDS.PAGE_CONTENT}>
        {title && title.trim() !== "" && (
          <PageHeader
            title={title}
            description={description}
            subtitle={subtitle}
            icon={icon}
            actions={actions}
          />
        )}
        {tabs && <div className={styles.pageTabsContainer}>{tabs}</div>}
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default BasePage;
