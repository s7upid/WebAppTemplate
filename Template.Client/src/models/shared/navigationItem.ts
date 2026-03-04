import type { ComponentType } from "react";
import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  routePath?: string;
  icon: LucideIcon;
  permission?: string;
  roles?: string[];
  component: ComponentType;
  testId: string;
  showInNav?: boolean;
  position?: "main" | "footer";
  devOnlySuperAdmin?: boolean;
  children?: NavigationItem[];
}
