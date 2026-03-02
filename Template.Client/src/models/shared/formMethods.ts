export interface FormMethods {
  handleSubmit: (
    onSubmit: (data: unknown) => void
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: (name: string, options?: Record<string, unknown>) => unknown;
  formState: {
    errors: Record<string, unknown>;
    isSubmitting: boolean;
    isValid: boolean;
  };
  reset: (values?: unknown) => void;
  setValue: (name: string, value: unknown) => void;
  getValues: (name?: string) => unknown;
  watch: (name?: string) => unknown;
}
