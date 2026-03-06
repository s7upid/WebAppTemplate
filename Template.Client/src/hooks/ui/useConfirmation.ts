import { useState, useCallback, useEffect, useMemo, useRef } from "react";

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const useConfirmation = () => {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "danger",
    isLoading: false,
  });
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current != null) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, []);

  const showConfirmation = useCallback(
    (options: ConfirmationOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          ...options,
          onConfirm: () => {
            setState((prev) => ({ ...prev, isLoading: true }));
            if (closeTimeoutRef.current != null) {
              window.clearTimeout(closeTimeoutRef.current);
            }
            closeTimeoutRef.current = window.setTimeout(() => {
              setState((prev) => ({
                ...prev,
                isOpen: false,
                isLoading: false,
              }));
            }, 100);
            resolve(true);
          },
          onCancel: () => {
            if (closeTimeoutRef.current != null) {
              window.clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
            setState((prev) => ({ ...prev, isOpen: false }));
            resolve(false);
          },
        });
      });
    },
    []
  );

  const hideConfirmation = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  const dialogProps = useMemo(
    () => ({
      isOpen: state.isOpen,
      onClose: state.onCancel || (() => {}),
      onConfirm: state.onConfirm || (() => {}),
      title: state.title,
      message: state.message,
      confirmText: state.confirmText,
      cancelText: state.cancelText,
      variant: state.variant,
      isLoading: state.isLoading,
    }),
    [state]
  );

  return useMemo(
    () => ({
      ...state,
      showConfirmation,
      hideConfirmation,
      setLoading,
      dialogProps,
    }),
    [state, showConfirmation, hideConfirmation, setLoading, dialogProps]
  );
};
