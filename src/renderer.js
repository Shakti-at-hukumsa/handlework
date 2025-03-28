import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './contexts/AppContext';
// Import tailwind.css first, then index.css
import './tailwind.css';
import './index.css';

// Initialize React app
const container = document.getElementById('root');
const root = createRoot(container);

// Apply system theme preference at startup
document.addEventListener('DOMContentLoaded', () => {
  const theme = window.electronAPI?.getSystemTheme?.() || 'dark';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

// Render the app
root.render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
); 