export interface FormMethods {
  handleSubmit: (
    onSubmit: (data: any) => void
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: (name: string, options?: any) => any;
  formState: {
    errors: Record<string, any>;
    isSubmitting: boolean;
    isValid: boolean;
  };
  reset: (values?: any) => void;
  setValue: (name: string, value: any) => void;
  getValues: (name?: string) => any;
  watch: (name?: string) => any;
}
