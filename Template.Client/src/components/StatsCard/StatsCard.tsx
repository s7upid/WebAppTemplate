import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils";
import styles from "./StatsCard.module.css";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: string | number;
    type: "increase" | "decrease" | "neutral";
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  className = "",
}) => {
  const getChangeClass = (type: string) => {
    switch (type) {
      case "increase":
        return styles.changeIncrease;
      case "decrease":
        return styles.changeDecrease;
      default:
        return styles.changeNeutral;
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "increase":
        return "↗";
      case "decrease":
        return "↘";
      default:
        return "";
    }
  };

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            <Icon className={styles.iconSvg} />
          </div>
        </div>
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <div className={styles.valueRow}>
            <p className={styles.value}>{value}</p>
            {change && (
              <p className={getChangeClass(change.type)}>
                {getChangeIcon(change.type)} {change.value}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
