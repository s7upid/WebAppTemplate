import themeReducer, { setTheme, setDarkMode, Theme } from "./themeSlice";

describe("themeSlice", () => {
  const initialState = {
    theme: "light" as Theme,
    isDark: false,
  };

  describe("initial state", () => {
    it("has correct initial state", () => {
      expect(themeReducer(undefined, { type: "unknown" })).toEqual(
        initialState
      );
    });
  });

  describe("setTheme action", () => {
    it("sets theme to light and isDark to false", () => {
      const action = setTheme("light");
      const state = themeReducer(initialState, action);

      expect(state.theme).toBe("light");
      expect(state.isDark).toBe(false);
    });

    it("sets theme to dark and isDark to true", () => {
      const action = setTheme("dark");
      const state = themeReducer(initialState, action);

      expect(state.theme).toBe("dark");
      expect(state.isDark).toBe(true);
    });

    it("changes theme from dark to light", () => {
      const darkState = {
        theme: "dark" as Theme,
        isDark: true,
      };

      const action = setTheme("light");
      const state = themeReducer(darkState, action);

      expect(state.theme).toBe("light");
      expect(state.isDark).toBe(false);
    });

    it("changes theme from light to dark", () => {
      const action = setTheme("dark");
      const state = themeReducer(initialState, action);

      expect(state.theme).toBe("dark");
      expect(state.isDark).toBe(true);
    });
  });

  describe("setDarkMode action", () => {
    it("sets isDark to true", () => {
      const action = setDarkMode(true);
      const state = themeReducer(initialState, action);

      expect(state.isDark).toBe(true);
      expect(state.theme).toBe("light");
    });

    it("sets isDark to false", () => {
      const darkState = {
        theme: "dark" as Theme,
        isDark: true,
      };

      const action = setDarkMode(false);
      const state = themeReducer(darkState, action);

      expect(state.isDark).toBe(false);
      expect(state.theme).toBe("dark");
    });

    it("toggles isDark across multiple calls", () => {
      let state = themeReducer(initialState, setDarkMode(true));
      expect(state.isDark).toBe(true);

      state = themeReducer(state, setDarkMode(false));
      expect(state.isDark).toBe(false);

      state = themeReducer(state, setDarkMode(true));
      expect(state.isDark).toBe(true);
    });
  });

  describe("combined actions", () => {
    it("applies setTheme followed by setDarkMode", () => {
      let state = themeReducer(initialState, setTheme("dark"));
      expect(state.theme).toBe("dark");
      expect(state.isDark).toBe(true);

      state = themeReducer(state, setDarkMode(false));
      expect(state.theme).toBe("dark");
      expect(state.isDark).toBe(false);
    });

    it("applies setDarkMode followed by setTheme", () => {
      let state = themeReducer(initialState, setDarkMode(true));
      expect(state.isDark).toBe(true);
      expect(state.theme).toBe("light");

      state = themeReducer(state, setTheme("dark"));
      expect(state.theme).toBe("dark");
      expect(state.isDark).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("ignores unknown action type", () => {
      const action = { type: "unknown" };
      const state = themeReducer(initialState, action);

      expect(state).toEqual(initialState);
    });

    it("maintains immutability", () => {
      const action = setTheme("dark");
      const state = themeReducer(initialState, action);

      expect(state).not.toBe(initialState);
      expect(initialState.theme).toBe("light");
      expect(initialState.isDark).toBe(false);
    });
  });
});
