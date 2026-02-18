import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface GridItem {
  id?: string;
}

export interface GridConfig {
  gridContainerClass?: string;
  gridItemClass?: string;
  itemsPerRow?: number;
  emptyStateIcon?: LucideIcon;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  emptyStateAction?: ReactNode;
}

export interface GridCallbacks<T> {
  renderItem: (item: T, index: number) => ReactNode;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}
