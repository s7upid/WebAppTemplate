import { logger } from "./logger";

export interface EntitySaveOptions<TCreate, TUpdate> {
  formMode: "create" | "edit";
  addEntity: (data: TCreate) => Promise<any>;
  editEntity: (args: { id: string; data: TUpdate }) => Promise<any>;
  selectedEntity?: { id: string };
  entityName: string;
  successMessages: { created: string; updated: string };
  showSuccess: (title: string, message: string) => void;
}

export interface EntityDeleteOptions<T> {
  entity?: T;
  id?: string;
  remove?: (id: string) => Promise<any>;
  entityName?: string;
  successMessage?: string;
  errorMessages?: { notFound?: string; deleteFailed?: string };
  onDeleted?: () => void;
  confirm: (args: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
  }) => Promise<boolean>;
  hideConfirmation?: () => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
}

export interface FormSubmitOptions<T> {
  data: T;
  schema: any;
  onSave: (data: T) => Promise<{ success: boolean; error?: any }>;
  entityName?: string;
  showError?: (title: string, message?: string) => void;
  showSuccess?: (title: string, message?: string) => void;
}

export interface SaveResult {
  success: boolean;
  error?: { field?: string; message: string };
}

export function extractErrorMessage(payload: any): string {
  if (!payload) return "Operation failed";
  if (typeof payload === "string") return payload;

  const errorsObj = payload?.errors || payload?.FieldErrors || payload?.fieldErrors;

  if (errorsObj && typeof errorsObj === "object" && !Array.isArray(errorsObj)) {
    const entries = Object.entries(errorsObj as Record<string, string[]>);
    if (entries.length > 0) {
      const [, messages] = entries[0];
      if (Array.isArray(messages) && messages.length > 0) {
        return messages[0];
      }
    }
    if (typeof payload.title === "string") return payload.title;
  }

  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.errorMessage === "string") return payload.errorMessage;
  if (typeof payload.error === "string") return payload.error;
  if (typeof payload.title === "string") return payload.title;

  if (Array.isArray(payload)) {
    return payload.map((p) => (typeof p === "string" ? p : JSON.stringify(p))).join(", ");
  }

  return JSON.stringify(payload);
}

export function inferFieldFromError(payload: any): string | undefined {
  const errorsObj = payload?.errors || payload?.FieldErrors || payload?.fieldErrors;

  if (errorsObj && typeof errorsObj === "object" && !Array.isArray(errorsObj)) {
    const errorKeys = Object.keys(errorsObj as Record<string, string[]>);
    if (errorKeys.length > 0) {
      return errorKeys[0].charAt(0).toLowerCase() + errorKeys[0].slice(1);
    }
  }

  return undefined;
}

export async function handleEntitySave<TCreate, TUpdate>(
  entityData: TCreate | TUpdate,
  options: EntitySaveOptions<TCreate, TUpdate>
): Promise<SaveResult> {
  const { formMode, addEntity, editEntity, selectedEntity, entityName, successMessages, showSuccess } = options;

  try {
    const isCreate = formMode === "create";
    const isEdit = formMode === "edit" && selectedEntity;

    if (!isCreate && !isEdit) {
      return { success: false, error: { message: "Invalid form mode" } };
    }

    const result = isCreate
      ? await addEntity(entityData as TCreate)
      : await editEntity({ id: selectedEntity!.id, data: entityData as TUpdate });

    if (result?.success === true) {
      const title = isCreate ? successMessages.created : successMessages.updated;
      const actionText = isCreate ? "created" : "updated";
      showSuccess(title, `${entityName} has been ${actionText} successfully.`);
      return { success: true };
    }

    const rawError = result?.error ?? result?.payload;
    return {
      success: false,
      error: { message: extractErrorMessage(rawError), field: inferFieldFromError(rawError) },
    };
  } catch (err: any) {
    return { success: false, error: { message: err?.message || "An unexpected error occurred" } };
  }
}

export async function handleEntityDelete<T extends { id: string; name?: string }>(
  options: EntityDeleteOptions<T>
): Promise<void> {
  const {
    entity,
    id,
    remove,
    entityName = "Entity",
    successMessage,
    errorMessages,
    onDeleted,
    confirm,
    hideConfirmation,
    showSuccess,
    showError,
  } = options;

  if (!entity || !id || !remove) return;

  const confirmed = await confirm({
    title: `Delete ${entityName}`,
    message: `Are you sure you want to delete ${entity.name || id}? This action cannot be undone.`,
    confirmText: "Delete",
    cancelText: "Cancel",
    variant: "danger",
  });

  if (!confirmed) return;

  try {
    const result = await remove(id);

    if (result?.success === true) {
      showSuccess(successMessage || `${entityName} deleted successfully.`);
      onDeleted?.();
    } else {
      const msg = result?.error ?? result?.payload ?? errorMessages?.notFound ?? "Not found";
      showError(errorMessages?.deleteFailed || "Delete failed", typeof msg === "string" ? msg : "Not found");
    }
  } catch (err) {
    logger.error(`Failed to delete ${entityName.toLowerCase()}:`, err);
    showError(errorMessages?.deleteFailed || "Delete failed", err instanceof Error ? err.message : "Unknown error");
  } finally {
    hideConfirmation?.();
  }
}

export async function handleSubmitForm<T>(
  options: FormSubmitOptions<T>
): Promise<{ success: boolean; error?: any; result?: any }> {
  const { data, schema, onSave, entityName = "Entity", showError: showErrorProp, showSuccess } = options;
  const showError = showErrorProp || (() => {});

  try {
    schema.parse(data);
    const result = await onSave(data);

    if (result.success) {
      showSuccess?.(`${entityName} saved`, `${entityName} saved successfully`);
      return { success: true, result };
    } else {
      showError("Error", result.error?.message || "Unknown error");
      return { success: false, error: result.error };
    }
  } catch (err: any) {
    logger.error(`Failed to save ${entityName.toLowerCase()}:`, err);
    showError("Error saving entity", err?.message || "Unknown error");
    return { success: false, error: err };
  }
}
