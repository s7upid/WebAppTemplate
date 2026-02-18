import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks";
import { cn } from "@/utils";
import { TEST_IDS } from "@/config";
import styles from "./ThemeToggle.module.css";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    return theme === "light" ? (
      <Sun className={styles.icon} />
    ) : (
      <Moon className={styles.icon} />
    );
  };

  const getTooltip = () => {
    return theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(styles.toggle)}
      title={getTooltip()}
      aria-label={getTooltip()}
      data-testid={TEST_IDS.THEME_TOGGLE}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;
