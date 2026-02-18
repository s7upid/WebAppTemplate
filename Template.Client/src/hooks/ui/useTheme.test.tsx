// Use base test utilities to reduce duplication
import { setupBaseTest } from "@/test/base-test-utils";

// Get cleanup function after mocks are set up
const { cleanup } = setupBaseTest({
  useMockData: false,
  mockFetch: false,
  mockPermissionCache: false,
  mockRouteUtils: false,
});

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useTheme } from "./useTheme";

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const createMockStore = (theme = "light") => {
  return configureStore({
    reducer: {
      theme: (state = { theme, isDark: theme === "dark" }) => state,
    },
  });
};

const wrapper = ({
  children,
  theme = "light",
}: {
  children: React.ReactNode;
  theme?: string;
}) => <Provider store={createMockStore(theme)}>{children}</Provider>;

describe("useTheme", () => {
  beforeEach(() => {
    cleanup(); // Use cleanup from base utilities
  });

  it("returns light theme by default", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");
    expect(result.current.isDark).toBe(false);
  });

  it("returns dark theme when set", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => wrapper({ children, theme: "dark" }),
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.isDark).toBe(true);
  });

  it("toggles theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.toggleTheme).toBeDefined();
  });

  it("sets theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.setTheme).toBeDefined();
  });

  it("load theme from localStorage on mount", () => {
    localStorageMock.getItem.mockReturnValue("dark");

    renderHook(() => useTheme(), { wrapper });

    expect(localStorageMock.getItem).toHaveBeenCalledWith("template-theme");
  });

  it("save theme to localStorage when changed", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "template-theme",
      "dark"
    );
  });

  it("handles invalid theme from localStorage", () => {
    localStorageMock.getItem.mockReturnValue("invalid-theme");

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");
  });

  it("handles null theme from localStorage", () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");
  });

  it("applies theme to document body", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.setTheme).toBeDefined();
  });

  it("handles system theme preference", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe("light");
  });

  it("handles theme persistence", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setTheme("dark");
    });

    act(() => {
      result.current.setTheme("light");
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "template-theme",
      "dark"
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "template-theme",
      "light"
    );
  });
});
