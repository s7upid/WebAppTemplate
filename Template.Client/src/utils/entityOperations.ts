import { logger } from "./logger";

export interface EntitySaveOptions<TCreate, TUpdate> {
  formMode: "create" | "edit";
  addEntity: (data: TCreate) => Promise<unknown>;
  editEntity: (args: { id: string; data: TUpdate }) => Promise<unknown>;
  selectedEntity?: { id: string };
  entityName: string;
  successMessages: { created: string; updated: string };
  showSuccess: (title: string, message: string) => void;
}

export interface EntityDeleteOptions<T> {
  entity?: T;
  id?: string;
  remove?: (id: string) => Promise<unknown>;
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
  schema: unknown;
  onSave: (data: T) => Promise<{ success: boolean; error?: string }>;
  entityName?: string;
  showError?: (title: string, message?: string) => void;
  showSuccess?: (title: string, message?: string) => void;
}

export interface SaveResult {
  success: boolean;
  error?: { field?: string; message: string };
}

/** Result shape from add/edit/remove mutations (typed for use after Promise<unknown>). */
export interface EntityMutationResult {
  success?: boolean;
  error?: string;
  payload?: unknown;
}

export function extractErrorMessage(payload: unknown): string {
  if (!payload) return "Operation failed";
  if (typeof payload === "string") return payload;

  const p = payload as Record<string, unknown>;
  const errorsObj = p?.errors || p?.FieldErrors || p?.fieldErrors;

  if (errorsObj && typeof errorsObj === "object" && !Array.isArray(errorsObj)) {
    const entries = Object.entries(errorsObj as Record<string, string[]>);
    if (entries.length > 0) {
      const [, messages] = entries[0];
      if (Array.isArray(messages) && messages.length > 0) {
        return messages[0];
      }
    }
    if (typeof p.title === "string") return p.title;
  }

  if (typeof p.message === "string") return p.message;
  if (typeof p.errorMessage === "string") return p.errorMessage;
  if (typeof p.error === "string") return p.error;
  if (typeof p.title === "string") return p.title;

  if (Array.isArray(payload)) {
    return payload.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(", ");
  }

  return JSON.stringify(payload);
}

export function inferFieldFromError(payload: unknown): string | undefined {
  const p = payload as Record<string, unknown>;
  const errorsObj = p?.errors || p?.FieldErrors || p?.fieldErrors;

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

    const result = (isCreate
      ? await addEntity(entityData as TCreate)
      : await editEntity({ id: selectedEntity!.id, data: entityData as TUpdate })) as EntityMutationResult;

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return { success: false, error: { message } };
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
    const result = (await remove(id)) as EntityMutationResult;

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
): Promise<{ success: boolean; error?: unknown; result?: unknown }> {
  const { data, schema, onSave, entityName = "Entity", showError: showErrorProp, showSuccess } = options;
  const showError = showErrorProp || (() => {});

  try {
    (schema as { parse: (d: T) => void }).parse(data);
    const result = await onSave(data);

    if (result.success) {
      showSuccess?.(`${entityName} saved`, `${entityName} saved successfully`);
      return { success: true, result };
    } else {
      showError("Error", result.error || "Unknown error");
      return { success: false, error: result.error };
    }
  } catch (err: unknown) {
    logger.error(`Failed to save ${entityName.toLowerCase()}:`, err);
    const message = err instanceof Error ? err.message : "Unknown error";
    showError("Error saving entity", message);
    return { success: false, error: err };
  }
}
