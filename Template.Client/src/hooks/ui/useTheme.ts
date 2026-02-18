import { useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setDarkMode, setTheme, Theme } from "@/store/slices/ui/themeSlice";

const THEME_STORAGE_KEY = "template-theme";

export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme, isDark } = useSelector((state: RootState) => state.theme);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }, [theme, dispatch]);

  const setThemeMode = useCallback(
    (newTheme: Theme) => {
      dispatch(setTheme(newTheme));
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    },
    [dispatch]
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    if (savedTheme && ["light", "dark"].includes(savedTheme)) {
      dispatch(setTheme(savedTheme));
    } else {
      dispatch(setTheme("light"));
      localStorage.setItem(THEME_STORAGE_KEY, "light");
    }
  }, [dispatch]);

  useEffect(() => {
    if (theme === "dark") {
      dispatch(setDarkMode(true));
    } else if (theme === "light") {
      dispatch(setDarkMode(false));
    }
  }, [theme, dispatch]);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    requestAnimationFrame(applyTheme);
  }, [isDark]);

  return useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
      setTheme: setThemeMode,
    }),
    [theme, isDark, toggleTheme, setThemeMode]
  );
};
