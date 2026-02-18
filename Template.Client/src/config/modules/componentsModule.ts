import { Palette, Layout, Type, Layers, MousePointer, FormInput } from "lucide-react";
import { ModuleConfig, PermissionConfig } from "./types";

const PERMISSIONS: PermissionConfig = {
  view: "",
};

export const COMPONENTS_MODULE: ModuleConfig = {
  id: "components",
  icon: Palette,

  routes: {
    base: "/components",
    root: "/components/*",
    api: { list: () => "" },
  },

  permissions: PERMISSIONS,

  labels: {
    singular: "Component",
    plural: "Components",
    menuLabel: "Components Reference",
    description: "Interactive component showcase and documentation",
  },

  testIds: {
    nav: "nav-components",
    page: "components-reference-page",
  },

  detailTabs: [
    { id: "buttons", label: "Buttons", icon: MousePointer, testId: "components-buttons-tab" },
    { id: "forms", label: "Forms", icon: FormInput, testId: "components-forms-tab" },
    { id: "layout", label: "Layout", icon: Layout, testId: "components-layout-tab" },
    { id: "typography", label: "Typography", icon: Type, testId: "components-typography-tab" },
    { id: "feedback", label: "Feedback", icon: Layers, testId: "components-feedback-tab" },
  ],
};
