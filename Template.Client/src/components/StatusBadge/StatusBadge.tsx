import React, { useMemo, memo } from "react";
import { cn } from "@/utils";
import { UserStatus } from "@/models/generated";
import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  status?: string | UserStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = UserStatus.Inactive,
  className = "",
}) => {
  // Memoize status config to avoid recalculation
  const config = useMemo(() => {
    const normalized = String(status || "").toLowerCase();
    switch (normalized) {
      case UserStatus.Active.toLowerCase():
      case "0":
        return { className: styles.active, label: UserStatus.Active };
      case UserStatus.Inactive.toLowerCase():
      case "1":
        return { className: styles.inactive, label: UserStatus.Inactive };
      case UserStatus.Pending.toLowerCase():
      case "2":
        return { className: styles.pending, label: UserStatus.Pending };
      case UserStatus.Suspended.toLowerCase():
      case "3":
        return { className: styles.suspended, label: UserStatus.Suspended };
      default:
        return { className: styles.inactive, label: UserStatus.Inactive };
    }
  }, [status]);

  return (
    <span className={cn(styles.base, config.className, className)}>
      {config.label}
    </span>
  );
};

export default memo(StatusBadge);
