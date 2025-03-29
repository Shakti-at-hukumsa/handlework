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
  const [isMaximized, setIsMaximized] = useState(true);

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

  // Toggle maximized state
  const toggleMaximized = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div className="flex flex-col fixed inset-0 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Window title bar - Windows style */}
      <div className="flex-shrink-0 h-7 bg-blue-700 dark:bg-blue-900 flex items-center cursor-default select-none text-white px-2 text-xs font-medium">
        <span>Developer Workspace</span>
        
        {/* Window controls */}
        <div className="ml-auto flex">
          <button className="w-6 h-6 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-800">
            <svg className="h-3 w-3" viewBox="0 0 12 1" fill="currentColor">
              <rect width="12" height="1" />
            </svg>
          </button>
          
          <button 
            className="w-6 h-6 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-800"
            onClick={toggleMaximized}
          >
            {isMaximized ? (
              <svg className="h-3 w-3" viewBox="0 0 10 10" fill="none" stroke="currentColor">
                <rect x="0.5" y="0.5" width="9" height="9" strokeWidth="1" />
                <rect x="3" y="3" width="9" height="9" strokeWidth="1" />
              </svg>
            ) : (
              <svg className="h-3 w-3" viewBox="0 0 10 10" fill="none" stroke="currentColor">
                <rect x="0.5" y="0.5" width="9" height="9" strokeWidth="1" />
              </svg>
            )}
          </button>
          
          <button className="w-6 h-6 flex items-center justify-center hover:bg-red-600">
            <svg className="h-3 w-3" viewBox="0 0 10 10" fill="none" stroke="currentColor">
              <path d="M1 1L9 9M9 1L1 9" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* App Toolbar */}
      <Navbar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        darkMode={settings.theme === 'dark'}
        toggleTheme={toggleTheme}
      />
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
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
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 focus:outline-none p-2 sm:p-3 lg:p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
          
          {/* Status bar - Windows style */}
          <div className="flex-shrink-0 h-5 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex items-center px-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
              <span>Connected</span>
            </div>
            <div className="ml-3 flex items-center">
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-1.5"></span>
              <span>Network: Online</span>
            </div>
            <div className="ml-auto flex space-x-4">
              <span>Projects: {projects?.length || 0}</span>
              <span>Tasks: {tasks?.length || 0}</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Mock data for status bar
const projects = [1, 2, 3, 4, 5, 6];
const tasks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

export default App; 