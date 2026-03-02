import { Eye } from "lucide-react";
import { getEventIcon } from "@/utils/auditLogUtils";
import type { AuditLog, AuditEventType } from "@/models/generated";

export const useAuditTableConfig = (
  setSelectedChangeLog: (log: AuditLog) => void
) => {
  return {
    columns: [
      {
        key: "timestamp",
        label: "Time",
        render: (_item: AuditLog, value: unknown) => {
          const date = new Date(value as string);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          let relativeTime = "";
          if (diffMins < 1) relativeTime = "Just now";
          else if (diffMins < 60) relativeTime = `${diffMins}m ago`;
          else if (diffHours < 24) relativeTime = `${diffHours}h ago`;
          else if (diffDays < 7) relativeTime = `${diffDays}d ago`;
          else relativeTime = date.toLocaleDateString();

          return (
            <div className="audit-timestamp-container">
              <span className="audit-timestamp-primary">{relativeTime}</span>
              <span className="audit-field">
                {date.toLocaleDateString()}{" "}
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        },
      },
      {
        key: "eventType",
        label: "Event",
        render: (item: AuditLog) => {
          const eventType = item.eventType as AuditEventType;
          const { Icon, colorClassName } = getEventIcon(eventType);
          return (
            <div className="audit-container">
              <Icon size={18} className={colorClassName} />
              <span className="audit-event-text">{String(eventType)}</span>
            </div>
          );
        },
      },
      {
        key: "description",
        label: "Description",
        render: (_item: AuditLog, value: unknown) => (
          <div className="audit-description-wrapper" title={String(value)}>
            {String(value)}
          </div>
        ),
      },
      {
        key: "userId",
        label: "User",
        render: (item: AuditLog) => {
          if (item.user) {
            return (
              <div className="audit-container">
                {item.user.avatar ? (
                  (() => {
                    const raw = String(item.user!.avatar);
                    const src = /^data:image\//i.test(raw)
                      ? raw
                      : `data:image/png;base64,${raw}`;
                    return (
                      <img
                        src={src}
                        alt={
                          `${item.user!.firstName ?? ""} ${
                            item.user!.lastName ?? ""
                          }`.trim() || "User avatar"
                        }
                        className="audit-user-avatar-img"
                      />
                    );
                  })()
                ) : (
                  <div className="audit-user-avatar">
                    {item.user.firstName?.[0] || ""}
                    {item.user.lastName?.[0] || ""}
                  </div>
                )}
                <div className="audit-user-info">
                  <span className="audit-user-name">
                    {item.user.firstName} {item.user.lastName}
                  </span>
                  {item.user.email && (
                    <span className="audit-field">{item.user.email}</span>
                  )}
                </div>
              </div>
            );
          }
          return <span className="audit-field">—</span>;
        },
      },
      {
        key: "changeValues",
        label: "Changes",
        render: (item: AuditLog) => {
          if (!item.preChangeValue && !item.postChangeValue) {
            return <span className="audit-field">—</span>;
          }
          return (
            <button
              type="button"
              className="audit-change-view-button"
              onClick={() => setSelectedChangeLog(item)}
              title="View changes"
            >
              <Eye size={16} /> View Changes
            </button>
          );
        },
      },
    ],
  };
};
