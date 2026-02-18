import React, { forwardRef, ReactNode, cloneElement } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon | ReactNode;
  iconPosition?: "left" | "right";
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      iconPosition = "left",
      required = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputClasses = cn(
      styles.field,
      error && styles.fieldError,
      icon &&
        (iconPosition === "left" ? styles.withIconLeft : styles.withIconRight),
      className
    );

    const renderIcon = () => {
      if (!icon) return null;

      if (React.isValidElement(icon)) {
        const element = icon as React.ReactElement<any>;
        return cloneElement(element, {
          className: cn(styles.icon, element.props.className),
        });
      }

      if (typeof icon === "function" || (typeof icon === "object" && icon)) {
        const IconComponent = icon as unknown as React.ComponentType<{
          className?: string;
        }>;
        return <IconComponent className={styles.icon} />;
      }

      return <span className={styles.icon}>?</span>;
    };

    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <div className={styles.relative}>
          {icon && iconPosition === "left" && (
            <div className={styles.iconLeftContainer}>{renderIcon()}</div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={inputClasses}
            required={required}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className={styles.iconRightContainer}>{renderIcon()}</div>
          )}
        </div>
        {error && (
          <p className={styles.error} data-testid={`${inputId}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
