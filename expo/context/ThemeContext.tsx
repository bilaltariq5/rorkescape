import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';

// Define the theme context type
type ThemeContextType = {
  theme: typeof lightTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
};

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const { settings, updateSettings } = useUserStore();
  const [isDark, setIsDark] = useState(false);
  
  // Determine the theme based on user settings and system preference
  useEffect(() => {
    if (settings.themeMode === 'system') {
      setIsDark(colorScheme === 'dark');
    } else {
      setIsDark(settings.themeMode === 'dark');
    }
  }, [colorScheme, settings.themeMode]);
  
  // Toggle between light and dark theme
  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    updateSettings({ themeMode: newMode });
    setIsDark(!isDark);
  };
  
  // Set a specific theme mode
  const setTheme = (mode: 'light' | 'dark' | 'system') => {
    updateSettings({ themeMode: mode });
    if (mode === 'system') {
      setIsDark(colorScheme === 'dark');
    } else {
      setIsDark(mode === 'dark');
    }
  };
  
  // The current theme object
  const theme = isDark ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};