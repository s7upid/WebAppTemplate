import React from "react";
import { Filter } from "lucide-react";
import { cn } from "@/utils";
import { FilterOption } from "@/models";
import styles from "./FilterSelect.module.css";

interface FilterSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
  label?: string;
  selectClassName?: string;
  testId?: string;
  disabled?: boolean;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options = [],
  placeholder = "Filter by...",
  className = "",
  label,
  selectClassName = "",
  testId,
  disabled,
}) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label && <span className={styles.srOnly}>{label}</span>}
      <Filter className={styles.icon} />
      <select
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(styles.select, selectClassName)}
        data-testid={testId}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
