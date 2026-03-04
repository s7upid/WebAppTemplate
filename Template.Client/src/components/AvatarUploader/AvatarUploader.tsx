import type { ChangeEvent } from "react";
import { User, Upload } from "lucide-react";
import styles from "./AvatarUploader.module.css";

interface AvatarUploaderProps {
  avatarUrl?: string;
  editable?: boolean;
  onChange?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}

export function AvatarUploader({
  avatarUrl,
  editable = false,
  onChange,
  onRemove,
  className = "",
}: AvatarUploaderProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange?.(e.target.files[0]);
    }
  };

  return (
    <div className={`${styles.avatarSection} ${className}`}>
      <div className={styles.avatarContainer}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <User className={styles.avatarIcon} />
          </div>
        )}
      </div>

      {editable && (
        <div className={styles.avatarActions}>
          <label className={styles.uploadButton}>
            <Upload className={styles.uploadIcon} />
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />
          </label>
          {avatarUrl && (
            <button
              type="button"
              onClick={onRemove}
              className={styles.removeButton}
            >
              Remove Photo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AvatarUploader;
