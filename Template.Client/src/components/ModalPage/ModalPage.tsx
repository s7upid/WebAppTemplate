import React, { useEffect } from "react";
import { ModalPortal } from "@/components";
import styles from "./ModalPage.module.css";

interface ModalPageProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showCloseButton?: boolean;
  onSave?: () => void;
}

const ModalPage: React.FC<ModalPageProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
  showCloseButton = true,
  onSave,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div
        className={`${styles.overlay} ${className || ""}`}
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div className={styles.container}>
          <div
            className={`${styles.content} ${
              size === "sm"
                ? styles.sizeSm
                : size === "md"
                ? styles.sizeMd
                : size === "lg"
                ? styles.sizeLg
                : styles.sizeXl
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>{title}</h2>
              {showCloseButton && !onSave && (
                <button
                  className={styles.close}
                  onClick={onClose}
                  aria-label="Close"
                >
                  ×
                </button>
              )}
            </div>
            <div className={styles.body}>{children}</div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ModalPage;
