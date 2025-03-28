import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Set initial dark mode on component mount
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add('dark');
    
    // Handle resize events to detect mobile/desktop
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

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  // Handle sidebar backdrop click (close sidebar)
  const handleBackdropClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
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
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Navbar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
        
        {/* Main Content Area */}
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className="py-3 px-3 sm:px-4 lg:px-6 mx-auto">
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
        <footer className="h-5 bg-gray-100 dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 flex items-center px-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
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