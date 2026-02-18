import { LucideIcon } from "lucide-react";

export interface ActionButton {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  testId: string;
  onClick?: () => void;
}
