import React, { useEffect, useState, useRef } from "react";
import { CheckCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { Toast as ToastModel } from "@/models";
import styles from "./Toast.module.css";
import { cn } from "@/utils";

interface ToastItemProps {
  toast: ToastModel;
  onRemove: (id: string) => void;
  showIcons?: boolean;
  autoDismiss?: boolean;
  dismissDelay?: number;
  closeable?: boolean;
  closeButton?: React.ReactNode;
  renderToast?: (toast: ToastModel) => React.ReactNode;
  onToastClick?: (toast: ToastModel) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({
  toast,
  onRemove,
  autoDismiss,
  dismissDelay,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Check if message is overflowing (needs expand button)
  useEffect(() => {
    if (messageRef.current) {
      const el = messageRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth);
    }
  }, [toast.message]);

  useEffect(() => {
    const shouldAutoClose = autoDismiss !== false && !isExpanded;
    if (!shouldAutoClose) return;
    const autoCloseMs =
      dismissDelay ??
      (toast.duration && toast.duration > 0 ? toast.duration : 5000);
    const timer = setTimeout(() => {
      handleRemove();
    }, autoCloseMs);
    return () => clearTimeout(timer);
  }, [autoDismiss, dismissDelay, toast.duration, isExpanded]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className={styles.icon} />;
      case "error":
        return <X className={styles.icon} />;
      case "warning":
        return <X className={styles.icon} />;
      case "info":
        return <CheckCircle className={styles.icon} />;
      default:
        return <CheckCircle className={styles.icon} />;
    }
  };

  const getVariantClass = () => {
    switch (toast.type) {
      case "success":
        return styles.success;
      case "error":
        return styles.error;
      case "warning":
        return styles.warning;
      case "info":
        return styles.info;
      default:
        return "";
    }
  };

  return (
    <div
      data-testid={`toast-${toast.type}`}
      className={cn(
        styles.toast,
        isVisible && !isLeaving ? styles.enter : styles.exit,
        isExpanded && styles.expanded,
        getVariantClass()
      )}
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>{getIcon()}</div>
        <div className={styles.body}>
          <h4 data-testid="toast-title" className={styles.title}>{toast.title}</h4>
          {toast.message && (
            <p
              ref={messageRef}
              data-testid="toast-message"
              className={cn(styles.message, isExpanded && styles.messageExpanded)}
            >
              {toast.message}
            </p>
          )}
          {(isOverflowing || isExpanded) && toast.message && (
            <button
              onClick={toggleExpand}
              className={styles.expandButton}
              data-testid="toast-expand"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className={styles.expandIcon} />
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <ChevronDown className={styles.expandIcon} />
                  <span>Show more</span>
                </>
              )}
            </button>
          )}
        </div>
        <div className={styles.actions}>
          <button onClick={handleRemove} className={styles.close}>
            <X className={styles.closeIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToastProps {
  toasts: ToastModel[];
  onRemove: (id: string) => void;
  autoDismiss?: boolean;
  dismissDelay?: number;
}

const Toast: React.FC<ToastProps> = ({
  toasts,
  onRemove,
  autoDismiss,
  dismissDelay,
}) => {
  return (
    <div data-testid="toast-container" className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          autoDismiss={autoDismiss}
          dismissDelay={dismissDelay}
        />
      ))}
    </div>
  );
};

export default Toast;
