import React, { useMemo, memo } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  children?: React.ReactNode;
}

// Define static class maps outside component to avoid recreation
const VARIANT_CLASSES = {
  primary: styles.primary,
  secondary: styles.secondary,
  danger: styles.danger,
  ghost: styles.ghost,
  success: styles.success,
} as const;

const SIZE_CLASSES = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
} as const;

const ICON_SIZE_CLASSES = {
  sm: styles.iconSm,
  md: styles.iconMd,
  lg: styles.iconLg,
} as const;

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  // Memoize combined class name
  const buttonClassName = useMemo(
    () => cn(styles.base, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className),
    [variant, size, className]
  );

  const iconSizeClass = ICON_SIZE_CLASSES[size];

  return (
    <button
      className={buttonClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className={cn(styles.loadingSpinner, iconSizeClass)} />
      ) : Icon && iconPosition === "left" ? (
        <Icon className={cn(iconSizeClass, styles.iconLeft)} />
      ) : Icon && !children ? (
        <Icon className={iconSizeClass} />
      ) : null}

      {children}

      {Icon && iconPosition === "right" && !loading && (
        <Icon className={cn(iconSizeClass, styles.iconRight)} />
      )}
    </button>
  );
};

export default memo(Button);
