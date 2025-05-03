import React, { createContext, useContext } from "react";
import theme from "../../../theme/index";

// Define the theme context type
interface ThemeContextType {
  theme: typeof theme.light;
  isDark: boolean;
  themeMode: "light" | "dark" | "system";
  toggleTheme: () => void;
  setTheme: (mode: "light" | "dark" | "system") => void;
}

// Create the theme context with proper typing
export const ThemeContext = createContext<ThemeContextType>({
  theme: theme.light,
  isDark: false,
  themeMode: "system",
  toggleTheme: () => {},
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider component for the Up4It app
 * Always uses dark mode
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Always use dark mode
  const themeMode = "dark";
  const isDark = true;
  const currentTheme = theme.dark;

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    isDark,
    themeMode,
    toggleTheme: () => {},
    setTheme: () => {},
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme
 * @returns {ThemeContextType} Theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
