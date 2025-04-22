import React, { createContext, useEffect } from 'react';
import useTheme from '../hooks/useTheme';

// Create context with default values
export const ThemeContext = createContext<{
  isDarkMode: boolean;
  toggleTheme: () => void;
  currentChatBackgroundColor: string;
}>({
  isDarkMode: false,
  toggleTheme: () => {},
  currentChatBackgroundColor: '#f0f5ff',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { currentTheme, isDarkMode, toggle, currentChatBackgroundColor } = useTheme();

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider 
      value={{ 
        isDarkMode, 
        toggleTheme: toggle,
        currentChatBackgroundColor, 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Convenience hook for using the theme context
export const useThemeContext = () => {
  return React.useContext(ThemeContext);
};

export default ThemeProvider;