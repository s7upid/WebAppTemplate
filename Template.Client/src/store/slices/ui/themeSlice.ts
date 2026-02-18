import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  isDark: boolean;
}

const initialState: ThemeState = {
  theme: "light",
  isDark: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      const newTheme = action.payload;
      if (state.theme !== newTheme) {
        state.theme = newTheme;
        state.isDark = newTheme === "dark";
      }
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      if (state.isDark !== action.payload) {
        state.isDark = action.payload;
      }
    },
  },
});

export const { setTheme, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
