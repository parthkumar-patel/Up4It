import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
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

// Theme preference storage key
const THEME_PREFERENCE_KEY = "@up4it/theme_preference";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Theme provider component for the Up4It app
 * Handles theme switching and persistence
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get device color scheme
  const deviceColorScheme = useColorScheme();

  // State for current theme mode
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("system");

  // Determine if dark mode is active
  const isDark =
    themeMode === "system"
      ? deviceColorScheme === "dark"
      : themeMode === "dark";

  // Get the appropriate theme object
  const currentTheme = isDark ? theme.dark : theme.light;

  // Load saved theme preference from storage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (
          savedTheme &&
          (savedTheme === "light" ||
            savedTheme === "dark" ||
            savedTheme === "system")
        ) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference to storage
  const saveThemePreference = async (mode: string) => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, mode);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newMode = isDark ? "light" : "dark";
    setThemeMode(newMode);
    saveThemePreference(newMode);
  };

  // Set a specific theme mode
  const setTheme = (mode: "light" | "dark" | "system") => {
    if (["light", "dark", "system"].includes(mode)) {
      setThemeMode(mode);
      saveThemePreference(mode);
    }
  };

  // Create context value
  const contextValue: ThemeContextType = {
    theme: currentTheme,
    isDark,
    themeMode,
    toggleTheme,
    setTheme,
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
