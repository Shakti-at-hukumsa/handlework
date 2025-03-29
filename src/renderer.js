import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './contexts/AppContext';
import { DataProvider } from './contexts/DataContext';
// Import tailwind.css first, then index.css
import './tailwind.css';
import './index.css';

// Set up appearance settings from localStorage before rendering
const setupAppearanceSettings = () => {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn("localStorage is not available, using default appearance settings");
      document.documentElement.setAttribute('data-font-size', 'normal');
      document.documentElement.setAttribute('data-icon-size', 'normal');
      return;
    }
    
    // Get user preferences from localStorage
    const userPreferences = JSON.parse(localStorage.getItem('user-preferences')) || {};
    
    // Set data attributes for CSS to work with font and icon sizes
    document.documentElement.setAttribute('data-font-size', userPreferences.fontSize || 'normal');
    document.documentElement.setAttribute('data-icon-size', userPreferences.iconSize || 'normal');
    
    // Apply dark/light theme
    if (userPreferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (userPreferences.theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
    
    console.log('Applied appearance settings:', {
      theme: userPreferences.theme || 'dark',
      fontSize: userPreferences.fontSize || 'normal',
      iconSize: userPreferences.iconSize || 'normal'
    });
  } catch (error) {
    console.error('Error setting up appearance:', error);
    // Fallback to defaults
    document.documentElement.setAttribute('data-font-size', 'normal');
    document.documentElement.setAttribute('data-icon-size', 'normal');
  }
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing React app');
  
  // Set up appearance settings first
  setupAppearanceSettings();
  
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    
    root.render(
      <HashRouter>
        <AppProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </AppProvider>
      </HashRouter>
    );
    console.log('React app rendered');
  } else {
    console.error('Root element not found');
  }
}); 