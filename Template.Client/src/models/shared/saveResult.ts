export interface SaveResult {
  success: boolean;
  error?: {
    field?: string;
    message: string;
  };
}
