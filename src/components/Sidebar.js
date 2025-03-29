import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  
  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
    { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Schedule', href: '/schedule', icon: CalendarIcon },
    { name: 'Payments', href: '/payments', icon: CreditCardIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div
      className={`${
        open ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-20 w-52 flex-shrink-0 overflow-hidden transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
    >
      {/* Sidebar header */}
      <div className="h-8 flex items-center px-3 bg-blue-600 dark:bg-blue-800 text-white">
        <span className="text-sm font-medium">Developer Workspace</span>
        
        {/* Close sidebar button (mobile only) */}
        <button
          className="ml-auto lg:hidden rounded-md focus:outline-none focus:ring-1 focus:ring-white"
          onClick={() => setOpen(false)}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-1 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-1.5 text-sm font-medium rounded-sm ${
                isActive
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => window.innerWidth < 1024 && setOpen(false)}
            >
              <item.icon
                className={`mr-2 flex-shrink-0 h-4 w-4 ${
                  isActive
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Sidebar footer */}
      <div className="flex-shrink-0 py-1.5 px-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
            <span>Connected</span>
          </div>
          <div className="ml-auto">v1.0.2</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 