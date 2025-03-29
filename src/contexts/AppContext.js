import React, { createContext, useState, useContext, useEffect } from 'react';
import { loadPreferences, savePreferences, updatePreference, resetPreferences } from '../utils/userPreferences';

// Create context
export const AppContext = createContext();

// Default settings
const defaultSettings = {
  theme: 'dark', // 'light' or 'dark'
  fontSize: 'normal', // 'small', 'normal', 'large'
  iconSize: 'normal', // 'small', 'normal', 'large'
  zoom: 100, // 80, 90, 100, 110, 120
  language: 'en', // 'en', 'hi', 'en-hi' (hinglish)
  compactMode: false,
  enableAnimations: true,
  enableShortcuts: true,
  enableNotifications: true,
  defaultView: 'list', // 'list', 'board', 'calendar'
  autoSave: true,
  autoSaveInterval: 30 // seconds
};

// Provider component
export const AppProvider = ({ children }) => {
  // Load settings from localStorage (or use defaults)
  const [settings, setSettings] = useState(() => {
    try {
      const userPreferences = loadPreferences();
      
      // Extract settings from user preferences
      return {
        theme: userPreferences.theme || defaultSettings.theme,
        fontSize: userPreferences.fontSize || defaultSettings.fontSize,
        iconSize: userPreferences.iconSize || defaultSettings.iconSize,
        zoom: userPreferences.zoom || defaultSettings.zoom,
        language: userPreferences.language || defaultSettings.language,
        compactMode: userPreferences.compactView || defaultSettings.compactMode,
        enableAnimations: userPreferences.animationsEnabled || defaultSettings.enableAnimations,
        enableShortcuts: userPreferences.enableShortcuts || defaultSettings.enableShortcuts,
        enableNotifications: userPreferences.desktopNotifications || defaultSettings.enableNotifications,
        defaultView: userPreferences.viewMode || defaultSettings.defaultView,
        autoSave: userPreferences.autoSaveEnabled || defaultSettings.autoSave,
        autoSaveInterval: userPreferences.autoSaveInterval || defaultSettings.autoSaveInterval
      };
    } catch (error) {
      console.error("Error loading settings:", error);
      return defaultSettings;
    }
  });

  // Apply theme when it changes
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Apply font size through CSS variables when it changes
  useEffect(() => {
    const fontSizeMap = {
      small: {
        xs: '0.7rem',
        sm: '0.8rem',
        base: '0.925rem',
        lg: '1.025rem',
        xl: '1.125rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      normal: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      large: {
        xs: '0.875rem',
        sm: '1rem',
        base: '1.125rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '1.875rem',
        '3xl': '2.25rem',
      },
    };

    const fontSizes = fontSizeMap[settings.fontSize] || fontSizeMap.normal;
    
    // Set the CSS variables for use in Tailwind utilities
    Object.entries(fontSizes).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--text-${key}`, value);
    });
  }, [settings.fontSize]);

  // Apply icon size through CSS variables when it changes
  useEffect(() => {
    const iconSizeMap = {
      small: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
      },
      normal: {
        xs: '1rem',
        sm: '1.25rem',
        base: '1.5rem',
        lg: '1.75rem',
        xl: '2rem',
      },
      large: {
        xs: '1.25rem',
        sm: '1.5rem',
        base: '1.75rem',
        lg: '2rem',
        xl: '2.5rem',
      },
    };

    const iconSizes = iconSizeMap[settings.iconSize] || iconSizeMap.normal;
    
    // Set the CSS variables for icon sizes
    Object.entries(iconSizes).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--icon-${key}`, value);
    });
  }, [settings.iconSize]);

  // Apply zoom through CSS variables when it changes
  useEffect(() => {
    document.documentElement.style.setProperty('--app-zoom', `${settings.zoom}%`);
  }, [settings.zoom]);

  // Toggle dark/light theme
  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSetting('theme', newTheme);
    
    // Also update user preferences
    updatePreference('theme', newTheme);
  };

  // Update a specific setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Sync with user preferences for persistent storage
    if (key === 'fontSize') updatePreference('fontSize', value);
    if (key === 'iconSize') updatePreference('iconSize', value);
    if (key === 'zoom') updatePreference('zoom', value);
    if (key === 'theme') updatePreference('theme', value);
    if (key === 'language') updatePreference('language', value);
    if (key === 'compactMode') updatePreference('compactView', value);
    if (key === 'enableAnimations') updatePreference('animationsEnabled', value);
    if (key === 'enableShortcuts') updatePreference('enableShortcuts', value);
    if (key === 'enableNotifications') updatePreference('desktopNotifications', value);
    if (key === 'defaultView') updatePreference('viewMode', value);
    if (key === 'autoSave') updatePreference('autoSaveEnabled', value);
    if (key === 'autoSaveInterval') updatePreference('autoSaveInterval', value);
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    
    // Reset user preferences
    resetPreferences();
  };
  
  // Export settings to a file
  const exportSettings = () => {
    try {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `devspace-settings-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      return true;
    } catch (error) {
      console.error("Error exporting settings:", error);
      return false;
    }
  };
  
  // Import settings from uploaded JSON file
  const importSettings = (settingsJson) => {
    try {
      const newSettings = JSON.parse(settingsJson);
      
      // Validate required settings
      if (!newSettings.theme || !newSettings.fontSize) {
        throw new Error("Invalid settings format");
      }
      
      // Update settings and save to localStorage
      setSettings(newSettings);
      
      // Sync with user preferences
      savePreferences({
        theme: newSettings.theme,
        fontSize: newSettings.fontSize,
        iconSize: newSettings.iconSize,
        zoom: newSettings.zoom,
        language: newSettings.language,
        compactView: newSettings.compactMode,
        animationsEnabled: newSettings.enableAnimations,
        enableShortcuts: newSettings.enableShortcuts,
        desktopNotifications: newSettings.enableNotifications,
        viewMode: newSettings.defaultView,
        autoSaveEnabled: newSettings.autoSave,
        autoSaveInterval: newSettings.autoSaveInterval
      });
      
      return true;
    } catch (error) {
      console.error("Error importing settings:", error);
      return false;
    }
  };

  // Context value
  const value = {
    settings,
    updateSetting,
    toggleTheme,
    resetSettings,
    exportSettings,
    importSettings
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the app context
export const useAppSettings = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppProvider');
  }
  return context;
}; 