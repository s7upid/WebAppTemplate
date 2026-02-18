import React from "react";
import { LucideIcon } from "lucide-react";
import styles from "./DashboardCard.module.css";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  testId?: string;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon: Icon,
  children,
  testId,
  className = "",
}) => {
  return (
    <div className={`${styles.card} ${className}`} data-testid={testId}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <Icon className={styles.iconMedium} />
      </div>
      {children}
    </div>
  );
};

export default DashboardCard;
