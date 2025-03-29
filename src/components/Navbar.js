import React, { useState } from 'react';
import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAppSettings } from '../contexts/AppContext';

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode, toggleTheme }) => {
  const { settings } = useAppSettings();
  const [showDropdown, setShowDropdown] = useState(null);

  // Menu items
  const menuItems = {
    file: [
      { label: 'New Project', shortcut: 'Ctrl+N' },
      { label: 'New Task', shortcut: 'Ctrl+T' },
      { label: 'Open Recent', submenu: [
        { label: 'Project A', action: () => {} },
        { label: 'Project B', action: () => {} }
      ]},
      { type: 'divider' },
      { label: 'Save All', shortcut: 'Ctrl+S' },
      { label: 'Export Data...', action: () => {} },
      { type: 'divider' },
      { label: 'Exit', action: () => {} }
    ],
    edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', shortcut: 'Ctrl+Y' },
      { type: 'divider' },
      { label: 'Cut', shortcut: 'Ctrl+X' },
      { label: 'Copy', shortcut: 'Ctrl+C' },
      { label: 'Paste', shortcut: 'Ctrl+V' },
      { type: 'divider' },
      { label: 'Find...', shortcut: 'Ctrl+F' }
    ],
    view: [
      { label: 'Zoom In', shortcut: 'Ctrl+Plus' },
      { label: 'Zoom Out', shortcut: 'Ctrl+Minus' },
      { label: 'Reset Zoom', shortcut: 'Ctrl+0' },
      { type: 'divider' },
      { label: 'Toggle Sidebar', action: () => {} },
      { label: 'Toggle Full Screen', shortcut: 'F11' }
    ],
    help: [
      { label: 'Documentation', action: () => {} },
      { label: 'Keyboard Shortcuts', action: () => {} },
      { label: 'Check for Updates', action: () => {} },
      { type: 'divider' },
      { label: 'About', action: () => {} }
    ]
  };

  // Toggle dropdown
  const toggleDropdown = (name) => {
    if (showDropdown === name) {
      setShowDropdown(null);
    } else {
      setShowDropdown(name);
    }
  };

  // Close all dropdowns
  const closeDropdowns = () => {
    setShowDropdown(null);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-8 relative">
      {/* Main navbar container */}
      <div className="flex h-full">
        {/* Mobile menu button */}
        <button
          className="lg:hidden px-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-gray-400 h-full"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Bars3Icon className="h-3.5 w-3.5" />
        </button>
        
        {/* App Menu */}
        <div className="flex items-center h-full">
          {['file', 'edit', 'view', 'help'].map((menu) => (
            <div key={menu} className="relative h-full">
              <button
                className={`px-3 text-xs h-full focus:outline-none ${
                  showDropdown === menu
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => toggleDropdown(menu)}
              >
                {menu.charAt(0).toUpperCase() + menu.slice(1)}
              </button>
              
              {/* Dropdown menu */}
              {showDropdown === menu && (
                <div className="absolute left-0 top-full z-50 w-56 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1 text-xs">
                  {menuItems[menu].map((item, idx) => (
                    item.type === 'divider' ? (
                      <div key={`divider-${idx}`} className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    ) : item.submenu ? (
                      <div key={`submenu-${idx}`} className="relative group">
                        <button className="flex justify-between items-center w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          {item.label}
                          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div className="absolute left-full top-0 w-40 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                          {item.submenu.map((subitem, subidx) => (
                            <button
                              key={`subitem-${subidx}`}
                              className="w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => {
                                subitem.action?.();
                                closeDropdowns();
                              }}
                            >
                              {subitem.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        key={`item-${idx}`}
                        className="flex justify-between items-center w-full px-3 py-1.5 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          item.action?.();
                          closeDropdowns();
                        }}
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className="text-gray-500 dark:text-gray-400">{item.shortcut}</span>
                        )}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Right side controls */}
        <div className="ml-auto flex items-center h-full">
          {/* Search button */}
          <button className="h-full px-3 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <MagnifyingGlassIcon className="h-3.5 w-3.5" />
          </button>
          
          {/* Notifications */}
          <button className="h-full px-3 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <BellIcon className="h-3.5 w-3.5" />
          </button>
          
          {/* Help */}
          <button className="h-full px-3 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <QuestionMarkCircleIcon className="h-3.5 w-3.5" />
          </button>
          
          {/* Theme toggle */}
          <button 
            className="h-full px-3 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            onClick={toggleTheme}
          >
            {darkMode ? (
              <SunIcon className="h-3.5 w-3.5" />
            ) : (
              <MoonIcon className="h-3.5 w-3.5" />
            )}
          </button>
          
          {/* User menu */}
          <button className="h-full px-3 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <UserCircleIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      
      {/* Overlay to close dropdowns */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40"
          onClick={closeDropdowns}
        ></div>
      )}
    </header>
  );
};

export default Navbar; 