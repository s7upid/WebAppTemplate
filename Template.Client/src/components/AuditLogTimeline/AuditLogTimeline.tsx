import React from "react";
import { AuditLog } from "@/models";
import AuditLogCard from "../AuditLogCard/AuditLogCard";
import styles from "./AuditLogTimeline.module.css";

interface AuditLogTimelineProps {
  logs: AuditLog[];
  title?: string;
  emptyMessage?: string;
  maxItems?: number;
}

const AuditLogTimeline: React.FC<AuditLogTimelineProps> = ({
  logs,
  title,
  emptyMessage = "No recent activity",
  maxItems,
}) => {
  const displayLogs = maxItems ? logs.slice(0, maxItems) : logs;

  if (displayLogs.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.timelineContainer}>
        {displayLogs.map((log) => (
          <div key={log.id} className={styles.logWrapper}>
            <AuditLogCard log={log} variant="modern" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogTimeline;
