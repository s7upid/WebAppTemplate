import React, { useState, useMemo, memo } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils";
import styles from "./Card.module.css";
import { TEST_IDS } from "@/config/constants";
import StatusBadge from "../StatusBadge/StatusBadge";

type IconSize = "sm" | "md" | "lg";

interface Detail {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

interface Action {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  icon?: LucideIcon;
}

interface CardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  avatar?: string;
  stats?: Stat[];
  actions?: Action[];
  details?: Detail[];
  layout?: "default" | "vertical" | "horizontal";
  status?: string;
  detailsPerRow?: 1 | 2 | 3 | 4;
  iconSize?: IconSize;
  className?: string;
  testId?: string;
  children?: React.ReactNode;
}

const CardHeader = ({
  title,
  description,
  avatar,
  icon: Icon,
  iconSize = "md",
}: Pick<
  CardProps,
  "title" | "description" | "avatar" | "icon" | "iconSize"
>) => {
  const [imageFailed, setImageFailed] = useState(false);

  const iconSizeClass = {
    sm: styles.iconSm,
    md: styles.iconMd,
    lg: styles.iconLg,
  }[iconSize];

  const showAvatar = avatar && !imageFailed;

  return (
    <>
      {showAvatar ? (
        <img
          src={avatar}
          alt={`${title} avatar`}
          className={styles.avatar}
          onError={() => setImageFailed(true)}
        />
      ) : Icon ? (
        <Icon className={cn(styles.icon, iconSizeClass)} />
      ) : null}
      <div>
        <h3 className={styles.title} data-testid={TEST_IDS.ROLE_NAME}>
          {title}
        </h3>
        {description && (
          <p
            className={styles.description}
            data-testid={TEST_IDS.ROLE_DESCRIPTION}
          >
            {description}
          </p>
        )}
      </div>
    </>
  );
};

const CardDetails = ({
  details = [],
  detailsPerRow = 1,
}: Pick<CardProps, "details" | "detailsPerRow">) => {
  if (details.length === 0) return null;

  return (
    <div className={cn(styles.details, styles[`details-${detailsPerRow}`])}>
      {details.map((detail, index) => {
        const DetailIcon = detail.icon;
        return (
          <div key={index} className={styles.detailItem}>
            <DetailIcon className={styles.detailIcon} />
            <div>
              <p className={styles.detailLabel}>{detail.label}</p>
              <p className={styles.detailValue}>{detail.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CardStats = ({ stats = [] }: Pick<CardProps, "stats">) => {
  if (stats.length === 0) return null;

  const getStatTestId = (label: string) =>
    ({
      Users: TEST_IDS.ROLE_USER_COUNT,
      Permissions: TEST_IDS.ROLE_PERMISSION_COUNT,
    }[label] || `role-${label.toLowerCase()}-count`);

  return (
    <div className={styles.stats}>
      {stats.map((stat, index) => {
        const StatIcon = stat.icon;
        return (
          <div
            key={index}
            className={styles.statItem}
            data-testid={getStatTestId(stat.label)}
          >
            <StatIcon className={styles.statIcon} />
            <span>{stat.label}:</span>
            <span>{stat.value}</span>
          </div>
        );
      })}
    </div>
  );
};

const CardActions = ({ actions = [] }: Pick<CardProps, "actions">) => {
  if (actions.length === 0) return null;

  const getActionTestId = (label: string) =>
    ({
      "View Details": TEST_IDS.VIEW_DETAILS_BUTTON,
      Edit: TEST_IDS.EDIT_ROLE_BUTTON,
      Delete: TEST_IDS.DELETE_ROLE_BUTTON,
    }[label] || `${label.toLowerCase().replace(/\s+/g, "-")}-button`);

  return (
    <div className={styles.actions}>
      <div className={styles.actionRow}>
        {actions.map((action, index) => {
          const ActionIcon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={styles.actionButton}
              data-testid={getActionTestId(action.label)}
            >
              {ActionIcon && <ActionIcon className={styles.actionIcon} />}
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  avatar,
  stats,
  actions,
  details,
  layout = "default",
  status,
  detailsPerRow,
  iconSize,
  className,
  testId,
  children,
}) => {
  // Memoize layout class lookup
  const layoutClass = useMemo(
    () =>
      ({
        default: styles.header,
        vertical: styles.verticalHeader,
        horizontal: styles.horizontalHeader,
      }[layout]),
    [layout]
  );

  return (
    <div className={cn(styles.card, className)} data-testid={testId}>
      {status && (
        <div className={styles.cardStatusBadge}>
          <StatusBadge status={status} />
        </div>
      )}

      <div className={layoutClass}>
        <CardHeader
          title={title}
          description={description}
          avatar={avatar}
          icon={icon}
          iconSize={iconSize}
        />
      </div>

      {children}

      <CardDetails details={details} detailsPerRow={detailsPerRow} />
      <CardStats stats={stats} />
      <CardActions actions={actions} />
    </div>
  );
};

// Wrap with memo to prevent re-renders when props haven't changed
export default memo(Card);
