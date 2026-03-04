import { PageHeader, ErrorBoundary, Alert } from "solstice-ui";
import { TEST_IDS } from "@/config";
import styles from "./BasePage.module.css";
import type { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface BasePageProps {
  title: string;
  description?: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  tabs?: ReactNode;
  children: ReactNode;
  error?: string | null;
  className?: string;
  testId?: string;
}

function BasePage({
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
}: BasePageProps) {
  if (error) {
    return <Alert variant="error">{error}</Alert>;
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
}

export default BasePage;
