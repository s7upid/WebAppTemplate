import React from "react";
import { TEST_IDS } from "@/config";
import { cn } from "@/utils";
import { PageHeaderProps } from "@/models";
import styles from "./PageHeader.module.css";

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  subtitle,
  icon,
  actions,
  className = "",
}) => {
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.content}>
        {icon && (
          <div className={styles.icon}>
            {React.createElement(icon, { className: "w-6 h-6" })}
          </div>
        )}
        <div>
          <h1 className={styles.title} data-testid={TEST_IDS.PAGE_TITLE}>
            {title}
          </h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};

export default PageHeader;
