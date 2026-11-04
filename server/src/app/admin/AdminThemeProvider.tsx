"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "iarvs-admin-theme";

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function AdminThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // 1. Restore the previously selected theme on page load
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(
        THEME_STORAGE_KEY
      );

      const initialTheme: Theme =
        savedTheme === "dark" ? "dark" : "light";

      setThemeState(initialTheme);

      document.documentElement.classList.toggle(
        "dark",
        initialTheme === "dark"
      );
    } catch (error) {
      console.error("Failed to load admin theme:", error);
    } finally {
      setIsThemeLoaded(true);
    }
  }, []);

  // 2. Apply and persist theme after initialization
  useEffect(() => {
    if (!isThemeLoaded) return;

    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        theme
      );
    } catch (error) {
      console.error("Failed to save admin theme:", error);
    }
  }, [theme, isThemeLoaded]);

  // 3. Select light or dark mode
  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
  };

  // 4. Toggle between light and dark mode
  const toggleTheme = () => {
    setThemeState((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAdminTheme must be used inside AdminThemeProvider");
  }

  return context;
}
