import { Shield } from "lucide-react";
import { useAllPermissions } from "@/hooks";
import { LoadingSpinner } from "solstice-ui";
import { cn } from "@/utils/cn";
import styles from "./PermissionSelector.module.css";
import { PermissionResponse } from "@/models";

interface PermissionSelectorProps {
  selectedPermissions: string[];
  onPermissionToggle: (permission: string) => void;
  onBulkPermissionChange?: (permissions: string[]) => void;
  pageSize?: number;
  disabled?: boolean;
  error?: string;
  disabledKeys?: string[];
}

function PermissionSelector({
  selectedPermissions,
  onPermissionToggle,
  onBulkPermissionChange,
  disabled = false,
  error,
  disabledKeys = [],
}: PermissionSelectorProps) {
  const {
    permissions: permissionsData,
    isLoading,
    error: permissionsError,
  } = useAllPermissions();

  const handleSelectAll = () => {
    if (disabled) return;
    const allPermissionKeys = permissionsData
      .map((p: PermissionResponse) => p.key)
      .filter((k: string) => !disabledKeys.includes(k));

    if (onBulkPermissionChange) {
      onBulkPermissionChange(allPermissionKeys);
    } else {
      allPermissionKeys.forEach((key: string) => {
        if (!selectedPermissions.includes(key)) {
          onPermissionToggle(key);
        }
      });
    }
  };

  const handleSelectNone = () => {
    if (disabled) return;

    if (onBulkPermissionChange) {
      onBulkPermissionChange([]);
    } else {
      selectedPermissions.forEach((permission: string) => {
        onPermissionToggle(permission);
      });
    }
  };

  const isAllSelected = () => {
    const nonDisabled = permissionsData.filter(
      (p: PermissionResponse) => !disabledKeys.includes(p.key)
    );
    return nonDisabled.every((permission: PermissionResponse) =>
      selectedPermissions.includes(permission.key)
    );
  };

  const isNoneSelected = () => {
    return permissionsData
      .filter((p: PermissionResponse) => !disabledKeys.includes(p.key))
      .every((p: PermissionResponse) => !selectedPermissions.includes(p.key));
  };

  const groupedPermissions = permissionsData.reduce((acc: Record<string, Array<{ key: string; value: string; description: string }>>, permission: PermissionResponse) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push({
      key: permission.key,
      value: permission.name,
      description: permission.description,
    });
    return acc;
  }, {} as Record<string, Array<{ key: string; value: string; description: string }>>);

  const hasError = Boolean(error || permissionsError);

  return (
    <div className={cn(styles.container, hasError && styles.containerError)}>
      <div className={styles.header}>
        <h3 className={styles.sectionHeader}>Permissions</h3>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={disabled || isAllSelected()}
            className={styles.primaryBtn}
          >
            Select All
          </button>
          <button
            type="button"
            onClick={handleSelectNone}
            disabled={disabled || isNoneSelected()}
            className={styles.secondaryBtn}
          >
            Select None
          </button>
        </div>
      </div>

      <div
        className={cn(
          styles.permissionsList,
          hasError && styles.permissionsListError
        )}
      >
        {isLoading && permissionsData.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <LoadingSpinner size="sm" text="Loading permissions..." />
          </div>
        ) : permissionsError && permissionsData.length === 0 ? (
          <div className="text-center text-red-500 dark:text-red-400 py-4">
            <p className="font-semibold">Error loading permissions</p>
            <p className="text-sm mt-1">{permissionsError}</p>
          </div>
        ) : permissionsData.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No permissions available
          </div>
        ) : Object.keys(groupedPermissions).length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No permissions available
          </div>
        ) : (
          Object.entries(groupedPermissions).map(([resource, perms]) => (
            <div key={resource} className={styles.group}>
              <h5 className={styles.groupTitle}>
                <Shield className={styles.shieldIcon} />
                {resource.charAt(0).toUpperCase() + resource.slice(1)}
              </h5>
              <div className={styles.grid}>
                {perms.map(({ key, value }: { key: string; value: string }) => {
                  const isDisabledItem = disabled || disabledKeys.includes(key);
                  return (
                    <label
                      key={key}
                      className={`${styles.itemLabel}${
                        isDisabledItem ? " " + styles.itemDisabled : ""
                      }`}
                      title={
                        isDisabledItem ? "Inherited / read-only" : undefined
                      }
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedPermissions.includes(key) ||
                          disabledKeys.includes(key)
                        }
                        onChange={() => {
                          if (!isDisabledItem) onPermissionToggle(key);
                        }}
                        className={styles.checkbox}
                        disabled={isDisabledItem}
                      />
                      <span className={styles.itemText}>{value}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {hasError && (
        <div className={styles.error}>
          <p className={styles.errorText}>{error || permissionsError}</p>
        </div>
      )}
    </div>
  );
}

export default PermissionSelector;
