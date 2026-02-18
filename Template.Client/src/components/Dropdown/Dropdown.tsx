import React, { forwardRef } from "react";
import styles from "./Dropdown.module.css";
import { cn } from "@/utils";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  onValueChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  testid?: string;
  loadingSlot?: React.ReactNode;
  placeholderOption?: string;
}

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  (
    {
      label,
      options,
      value,
      onValueChange,
      error,
      helperText,
      testid,
      loadingSlot,
      className,
      placeholderOption,
      onChange,
      ...rest
    },
    ref
  ) => {
    return (
      <div>
        {label && <label className={styles.label}>{label}</label>}
        <select
          ref={ref}
          className={cn(
            styles.select,
            error && styles.selectError,
            className || ""
          )}
          data-testid={testid}
          value={value}
          onChange={(e) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
          }}
          {...rest}
        >
          {placeholderOption && <option value="">{placeholderOption}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {loadingSlot}
        {error && <p className={styles.error}>{error}</p>}
        {helperText && !error && <p className={styles.helper}>{helperText}</p>}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
