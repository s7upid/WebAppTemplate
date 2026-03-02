import { useCallback, useMemo } from "react";
import { ApiResponse } from "@/models/shared/api";
import { useToast } from "./useToast";
import {
  getErrorMessage,
  getErrorToastType,
  getErrorTitle,
  isTokenRevocationError,
} from "@/utils/errorHandling";
import { useGenericNavigationFunctions } from "@/utils";

export function useErrorHandler() {
  const { showError, showWarning } = useToast();
  const nav = useGenericNavigationFunctions();

  const handleError = useCallback(
    (response: ApiResponse<unknown>, customTitle?: string) => {
      if (!response || response.success) {
        return;
      }

      const title = customTitle || getErrorTitle(response);
      const message = getErrorMessage(response);
      const toastType = getErrorToastType(response);

      if (toastType === "warning") {
        showWarning(title, message, 8000);
      } else {
        showError(title, message);
      }

      if (isTokenRevocationError(response)) {
        setTimeout(() => {
          nav.goToLogin();
        }, 2000);
      }
    },
    [showError, showWarning, nav]
  );

  return useMemo(() => ({ handleError }), [handleError]);
}
