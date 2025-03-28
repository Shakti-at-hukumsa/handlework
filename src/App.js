import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSettings } from './contexts/AppContext';

// Layout components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Schedule from './pages/Schedule';
import Tasks from './pages/Tasks';
import Payments from './pages/Payments';
import Settings from './pages/Settings';

const App = () => {
  const { settings, toggleTheme } = useAppSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-close sidebar on mobile when resizing
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state based on window size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle sidebar backdrop click (close sidebar)
  const handleBackdropClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex fixed inset-0 h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50 transition-opacity lg:hidden"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0">
        <Navbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          darkMode={settings.theme === 'dark'}
          toggleTheme={toggleTheme}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 focus:outline-none">
          <div className="h-full py-2 px-2 sm:px-3 lg:px-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>

        {/* Status bar at bottom - desktop OS-like feature */}
        <footer className="flex-shrink-0 h-5 bg-gray-100 dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 flex items-center px-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
            <span>Connected</span>
          </div>
          <div className="ml-auto flex space-x-3">
            <span>Projects: 6</span>
            <span>Tasks: 24</span>
            <span>Version 1.0.2</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App; 