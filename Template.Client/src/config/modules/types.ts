import { LucideIcon } from "lucide-react";

export interface PageTabConfig {
  id: string;
  label: string;
  icon?: LucideIcon;
  path: string;
  permission?: string;
  testId: string;
  filter?: Record<string, unknown>;
}

export interface DetailTabConfig {
  id: string;
  label: string;
  icon?: LucideIcon;
  permission?: string;
  testId: string;
}

export interface SubmenuConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  permission?: string;
  testId: string;
}

export interface RouteConfig {
  base: string;
  root: string;
  detail?: string;
  create?: string;
  edit?: string;
  api: {
    list: (query: string) => string;
    byId?: (id: string) => string;
    create?: string;
    update?: (id: string) => string;
    remove?: (id: string) => string;
    [key: string]: unknown;
  };
}

export interface PermissionConfig {
  view: string;
  create?: string;
  edit?: string;
  delete?: string;
  [key: string]: string | undefined;
}

export interface LabelsConfig {
  singular: string;
  plural: string;
  menuLabel: string;
  description: string;
  detailTitle?: string;
  detailDescription?: string;
  createButton?: string;
  backButton?: string;
}

export interface MessagesConfig {
  created?: string;
  updated?: string;
  deleted?: string;
  approved?: string;
  rejected?: string;
  [key: string]: string | undefined;
}

export interface TestIdsConfig {
  nav: string;
  page: string;
  grid?: string;
  form?: string;
  detailsPage?: string;
  createButton?: string;
  backButton?: string;
  row?: string;
  tabs?: string;
  [key: string]: string | undefined;
}

export interface ModuleConfig {
  id: string;
  routes: RouteConfig;
  permissions: PermissionConfig;
  labels: LabelsConfig;
  testIds: TestIdsConfig;
  icon: LucideIcon;
  messages?: MessagesConfig;
  pageTabs?: PageTabConfig[];
  detailTabs?: DetailTabConfig[];
  submenus?: SubmenuConfig[];
}

export type ModuleConfigMap = Record<string, ModuleConfig>;
