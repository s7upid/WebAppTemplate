import React from "react";
import { LucideIcon } from "lucide-react";
import styles from "./EmptyState.module.css";
import Button from "../Button/Button";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  primaryAction?: EmptyStateAction;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  primaryAction,
  className,
}) => {
  return (
    <div className={[styles.emptyState, className].filter(Boolean).join(" ")}>
      {Icon && (
        <div className={styles.iconWrapper} aria-hidden="true">
          <Icon size={36} />
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {primaryAction && (
        <Button variant="primary" onClick={primaryAction.onClick}>
          {primaryAction.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
