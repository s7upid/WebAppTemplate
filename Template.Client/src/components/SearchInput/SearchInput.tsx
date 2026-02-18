import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  testId?: string;
  disabled?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  testId,
  disabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.wrapper}>
        <div className={styles.iconContainer}>
          <Search className={styles.icon} />
        </div>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={styles.field}
          data-testid={testId}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default SearchInput;
