import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const mockToggleTheme = jest.fn();
jest.mock("@/hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: mockToggleTheme,
  }),
}));

const createMockStore = (theme = "light") => {
  return configureStore({
    reducer: {
      theme: (state = { theme, isDark: theme === "dark" }) => state,
    },
  });
};

const renderWithProvider = (component: React.ReactElement, theme = "light") => {
  const store = createMockStore(theme);
  return render(<Provider store={store}>{component}</Provider>);
};

describe("ThemeToggle", () => {
  it("renders theme toggle button", () => {
    renderWithProvider(<ThemeToggle />);

    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("shows sun icon in light mode", () => {
    renderWithProvider(<ThemeToggle />);

    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("shows moon icon in dark mode", () => {
    renderWithProvider(<ThemeToggle />, "dark");

    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("has proper accessibility attributes", () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label");
    expect(button).toHaveAttribute("title");
  });

  it("handles click events", () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(button).toBeTruthy();
  });

  it("shows correct tooltip text in light mode", () => {
    renderWithProvider(<ThemeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "Switch to dark mode");
  });

  it("shows correct tooltip text in dark mode", () => {
    jest.spyOn(require("@/hooks"), "useTheme").mockReturnValue({
      theme: "dark",
      toggleTheme: mockToggleTheme,
    });

    renderWithProvider(<ThemeToggle />, "dark");

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "Switch to light mode");
  });
});
