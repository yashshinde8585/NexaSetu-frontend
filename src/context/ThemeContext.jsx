import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('nexasetu_theme') || 'obsidian';
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('nexasetu_accent') || 'blue';
  });

  const applyTheme = useCallback((themeId, accentId) => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.forEach((cls) => {
      if (cls.startsWith('theme-') || cls.startsWith('accent-')) {
        root.classList.remove(cls);
      }
    });

    // Add active classes
    root.classList.add(`theme-${themeId}`);
    root.classList.add(`accent-${accentId}`);

    // Set standard HTML color scheme meta properties
    if (themeId === 'ghost') {
      root.style.colorScheme = 'light';
    } else {
      root.style.colorScheme = 'dark';
    }
  }, []);

  // Initialize theme on mount and when states change
  useEffect(() => {
    applyTheme(selectedTheme, accentColor);
  }, [selectedTheme, accentColor, applyTheme]);

  const saveTheme = useCallback((themeId, accentId) => {
    setSelectedTheme(themeId);
    setAccentColor(accentId);
    localStorage.setItem('nexasetu_theme', themeId);
    localStorage.setItem('nexasetu_accent', accentId);
  }, []);

  const value = useMemo(
    () => ({
      theme: selectedTheme,
      accent: accentColor,
      setTheme: setSelectedTheme,
      setAccent: setAccentColor,
      saveTheme,
    }),
    [selectedTheme, accentColor, saveTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
