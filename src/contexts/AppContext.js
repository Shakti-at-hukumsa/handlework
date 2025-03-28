import React, { createContext, useState, useContext, useEffect } from 'react';

// Default settings
const defaultSettings = {
  fontSize: 'normal', // small, normal, large
  iconSize: 'normal', // small, normal, large
  zoom: 100, // 80, 90, 100, 110, 120
  theme: 'dark', // light, dark
};

// Create context
export const AppContext = createContext();

// Create provider
export const AppProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));

    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply zoom
    document.documentElement.style.fontSize = `${settings.zoom}%`;

    // Apply font size class
    document.documentElement.dataset.fontSize = settings.fontSize;
    
    // Apply icon size class
    document.documentElement.dataset.iconSize = settings.iconSize;
    
  }, [settings]);

  // Update a single setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Toggle theme
  const toggleTheme = () => {
    updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark');
  };

  // Reset to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Context value
  const value = {
    settings,
    updateSetting,
    toggleTheme,
    resetSettings,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppSettings = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppProvider');
  }
  return context;
}; 