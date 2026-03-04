import type { CSSProperties } from "react";
import { AuditLog, AuditEventType } from "@/models";
import {
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Shield,
  Lock,
  Mail,
  KeyRound,
  Trash2,
  Edit,
  Plus,
  Settings,
  RefreshCw,
  Ban,
  Unlock,
  Activity,
} from "lucide-react";
import styles from "./AuditLogCard.module.css";
import { cn } from "@/utils";

interface AuditLogCardProps {
  log: AuditLog;
  variant?: "compact" | "modern";
  onClick?: () => void;
}

function AuditLogCard({
  log,
  variant = "modern",
  onClick,
}: AuditLogCardProps) {
  const getEventIcon = (eventType: AuditEventType) => {
    const iconProps = { size: 18, strokeWidth: 1.5 };
    switch (eventType) {
      case "Login":
      case "Logout":
        return <Shield {...iconProps} />;
      case "TokenRefresh":
        return <RefreshCw {...iconProps} />;
      case "PasswordChange":
      case "PasswordReset":
      case "PasswordResetRequested":
      case "PasswordResetCompleted":
        return <KeyRound {...iconProps} />;
      case "EmailConfirmed":
      case "EmailConfirmationResent":
        return <Mail {...iconProps} />;
      case "AccountLocked":
        return <Lock {...iconProps} />;
      case "AccountUnlocked":
        return <Unlock {...iconProps} />;
      case "PermissionChanged":
        return <Shield {...iconProps} />;
      case "RoleChanged":
        return <Settings {...iconProps} />;
      case "FailedLogin":
        return <Ban {...iconProps} />;
      case "TokenBlacklisted":
        return <Ban {...iconProps} />;
      case "Created":
        return <Plus {...iconProps} />;
      case "Updated":
        return <Edit {...iconProps} />;
      case "Deleted":
        return <Trash2 {...iconProps} />;
      default:
        return <Activity {...iconProps} />;
    }
  };

  const getEventColor = (eventType: AuditEventType) => {
    switch (eventType) {
      case "Login":
      case "TokenRefresh":
      case "Created":
        return "var(--success-color)";
      case "Logout":
      case "EmailConfirmed":
      case "PasswordReset":
        return "var(--info-color)";
      case "FailedLogin":
      case "AccountLocked":
      case "TokenBlacklisted":
      case "Deleted":
        return "var(--error-color)";
      case "PasswordChange":
      case "PasswordResetRequested":
      case "EmailConfirmationResent":
        return "var(--warning-color)";
      case "Updated":
        return "var(--primary-color)";
      default:
        return "var(--text-secondary)";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getUserDisplayName = () => {
    if (log.user) {
      return `${log.user.firstName} ${log.user.lastName}`;
    }
    if (log.userId) {
      return `ID: ${log.userId.substring(0, 8)}`;
    }
    return "System";
  };

  const eventColorVar = { "--event-color": getEventColor(log.eventType) } as CSSProperties;

  if (variant === "compact") {
    return (
      <div
        className={cn(styles.compact, !log.success && styles.error)}
        style={eventColorVar}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      >
        <div className={styles.compactMain}>
          <div className={styles.compactEventIcon}>
            {getEventIcon(log.eventType)}
          </div>
          <span className={styles.title}>{log.eventType}</span>
          {log.user && (
            <span className={styles.user}>{getUserDisplayName()}</span>
          )}
        </div>
        <div className={styles.compactMeta}>
          <span className={styles.timestamp}>
            {log.timestamp ? formatTimestamp(log.timestamp) : "N/A"}
          </span>
          {log.success ? (
            <CheckCircle2 size={14} className={styles.successIcon} />
          ) : (
            <XCircle size={14} className={styles.errorIcon} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.modern}
      style={eventColorVar}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          {getEventIcon(log.eventType)}
        </div>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{log.eventType}</h3>
          {(log.user || log.userId !== undefined) && (
            <div className={styles.metaItem}>
              <User size={14} />
              <span>{getUserDisplayName()}</span>
            </div>
          )}
        </div>
      </div>

      {log.description && (
        <p className={styles.description}>{log.description}</p>
      )}

      <div className={styles.footer}>
        <div className={styles.timestamp}>
          <Clock size={14} />
          <span>{log.timestamp ? formatTimestamp(log.timestamp) : "N/A"}</span>
        </div>
        <div
          className={cn(
            styles.statusBadge,
            log.success ? styles.success : styles.error
          )}
        >
          {log.success ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          <span>{log.success ? "Success" : "Failed"}</span>
        </div>
      </div>
    </div>
  );
}

export default AuditLogCard;
