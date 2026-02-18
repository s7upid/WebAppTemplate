export interface ToolbarFilterOption {
  label: string;
  value: string;
}

export interface ToolbarFilterConfig {
  key: string;
  label: string;
  options: ToolbarFilterOption[];
}

export interface ToolbarSortField {
  key: string;
  label: string;
}
