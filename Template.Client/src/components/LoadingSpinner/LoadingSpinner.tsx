import React, { useMemo, memo } from "react";
import { cn } from "@/utils";
import styles from "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  showMessage?: boolean;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  text,
  showMessage = true,
  color = "border-primary",
}) => {
  // Memoize size class lookup
  const sizeClass = useMemo(
    () =>
      ({
        sm: styles.sizeSm,
        md: styles.sizeMd,
        lg: styles.sizeLg,
      }[size]),
    [size]
  );

  return (
    <div
      className={cn(styles.container, className)}
      role="status"
      aria-label={text || "Loading"}
    >
      <div
        className={cn(styles.spinnerBase, color, sizeClass)}
        aria-hidden="true"
      ></div>
      {text && showMessage && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default memo(LoadingSpinner);
