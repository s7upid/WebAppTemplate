import { Mail, UserIcon, Users } from "lucide-react";
import { cn } from "@/utils";
import { UserResponse, UserStatus } from "@/models";
import { LoadingSpinner, Card } from "solstice-ui";
import styles from "./RoleUsersSection.module.css";

interface RoleUsersSectionProps {
  users: UserResponse[];
  usersLoading: boolean;
  onUserClick: (userId: string) => void;
}

function RoleUsersSection({
  users,
  usersLoading,
  onUserClick,
}: RoleUsersSectionProps) {
  return (
    <Card
      title={`Users with this Role (${users.length})`}
      icon={Users}
      iconSize="sm"
    >
      <div className={styles.header}></div>

      {usersLoading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner size="lg" text="Loading users..." />
        </div>
      ) : users.length === 0 ? (
        <div className={styles.emptyContainer}>
          <UserIcon className={styles.emptyIcon} />
          <p className={styles.emptyText}>No users assigned to this role</p>
        </div>
      ) : (
        <div className={styles.usersGrid}>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onUserClick(user.id)}
              className={styles.userCard}
            >
              <div className={styles.cardContent}>
                <div className={styles.avatar}>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName} avatar`}
                      className={styles.avatarImage}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const iconElement =
                          target.nextElementSibling as HTMLElement;
                        if (iconElement) iconElement.style.display = "block";
                      }}
                    />
                  ) : null}
                  <UserIcon
                    className={cn(
                      styles.avatarIcon,
                      user.avatar ? styles.avatarIconHidden : styles.avatarIconVisible
                    )}
                  />
                </div>
                <div className={styles.info}>
                  <p className={styles.name}>
                    {user.firstName} {user.lastName}
                  </p>
                  <div className={styles.emailRow}>
                    <Mail className={styles.emailIcon} />
                    <span className={styles.emailTruncate}>{user.email}</span>
                  </div>
                  <div className={styles.actions}>
                    <span
                      className={cn(
                        styles.statusBadge,
                        user.userStatus === UserStatus.Active
                          ? styles.statusActive
                          : styles.statusInactive
                      )}
                    >
                      {user.userStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RoleUsersSection;
