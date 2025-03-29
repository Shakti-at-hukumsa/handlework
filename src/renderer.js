import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './contexts/AppContext';
import { DataProvider } from './contexts/DataContext';
// Import tailwind.css first, then index.css
import './tailwind.css';
import './index.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing React app');
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