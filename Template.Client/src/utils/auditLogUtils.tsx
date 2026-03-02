import { AuditEventType } from "@/models/generated";
import {
  LogIn,
  LogOut,
  Key,
  RefreshCw,
  Mail,
  Plus,
  Edit,
  Trash2,
  Shield,
} from "lucide-react";

export const getEventIcon = (eventType: AuditEventType | string) => {
  const eventLower = eventType.toLowerCase();
  if (eventLower.includes("login"))
    return { Icon: LogIn, colorClassName: "audit-icon-success" };
  if (eventLower.includes("logout"))
    return { Icon: LogOut, colorClassName: "audit-icon-info" };
  if (eventLower.includes("password"))
    return { Icon: Key, colorClassName: "audit-icon-warning" };
  if (eventLower.includes("token"))
    return { Icon: RefreshCw, colorClassName: "audit-icon-success" };
  if (eventLower.includes("email"))
    return { Icon: Mail, colorClassName: "audit-icon-info" };
  if (eventLower.includes("created"))
    return { Icon: Plus, colorClassName: "audit-icon-success" };
  if (eventLower.includes("updated"))
    return { Icon: Edit, colorClassName: "audit-icon-info" };
  if (eventLower.includes("deleted"))
    return { Icon: Trash2, colorClassName: "audit-icon-error" };
  return { Icon: Shield, colorClassName: "audit-icon-default" };
};

export const formatValue = (value: string | null | undefined): string => {
  if (!value) return "";

  try {
    const parsed = JSON.parse(value);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return value;
  }
};

export const isJson = (value: string | null | undefined): boolean => {
  if (!value) return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const isDataUrlImage = (value: string | null | undefined): boolean => {
  if (!value) return false;
  return /^data:image\//i.test(value.trim());
};

export const isProbablyBase64 = (value: string | null | undefined): boolean => {
  if (!value) return false;
  const v = value.trim();
  if (v.length < 64) return false;
  return /^[A-Za-z0-9+/=]+$/.test(v) && v.length % 4 === 0;
};

export const renderChangeValue = (
  raw: string | null | undefined
): React.ReactNode => {
  if (!raw) return null;
  if (isJson(raw)) {
    return formatValue(raw);
  }
  if (isDataUrlImage(raw)) {
    return (
      <img
        src={raw}
        alt="Changed image"
        className="max-w-full rounded-md"
      />
    );
  }
  if (isProbablyBase64(raw)) {
    const src = `data:image/png;base64,${raw}`;
    return (
      <img
        src={src}
        alt="Changed image"
        className="max-w-full rounded-md"
      />
    );
  }
  return raw;
};
