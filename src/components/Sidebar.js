import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  FolderIcon, 
  CalendarIcon, 
  CheckBadgeIcon, 
  CreditCardIcon, 
  CogIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Projects', href: '/projects', icon: FolderIcon },
  { name: 'Schedule', href: '/schedule', icon: CalendarIcon },
  { name: 'Tasks', href: '/tasks', icon: CheckBadgeIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
];

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-56 bg-gray-100 dark:bg-dark-800 transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-auto border-r border-gray-200 dark:border-dark-700 ${open ? 'translate-x-0 shadow-lg' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-dark-lighter">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-sm font-bold text-gray-800 dark:text-white">DevSpace</div>
            </div>
            <button
              type="button"
              className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-dark-lighter transition-colors"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-dark-lighter">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => 
                  `group flex items-center px-2 py-1.5 text-xs font-medium rounded transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                      : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-dark-lighter'
                  }`
                }
              >
                <item.icon 
                  className={({ isActive }) => 
                    `mr-2 flex-shrink-0 h-3.5 w-3.5 ${
                      isActive 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300'
                    }`
                  } 
                  aria-hidden="true" 
                />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Divider with title */}
          <div className="px-3 py-1.5">
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-dark-lighter"></div>
              <span className="mx-2 text-xs font-medium text-gray-500 dark:text-gray-400">Recent Projects</span>
              <div className="flex-grow border-t border-gray-200 dark:border-dark-lighter"></div>
            </div>
          </div>

          {/* Recent projects list */}
          <div className="px-3 py-1">
            <ul className="space-y-1">
              {['Marketing Website', 'Mobile App', 'Dashboard Redesign'].map((project, index) => (
                <li key={index}>
                  <a href="#" className="flex items-center px-2 py-1.5 text-xs rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-lighter">
                    <div className={`w-2 h-2 rounded-full mr-2 ${index === 0 ? 'bg-green-500' : index === 1 ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                    {project}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* User profile and quick actions */}
          <div className="border-t border-gray-200 dark:border-dark-lighter px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img 
                  className="h-5 w-5 rounded-full border border-gray-200 dark:border-dark-lighter" 
                  src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="User profile"
                />
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-800 dark:text-white">Sarah Johnson</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Developer</p>
                </div>
              </div>
              <button className="p-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-dark-lighter dark:hover:bg-dark-600 text-gray-600 dark:text-gray-300 transition-colors">
                <ArrowUpTrayIcon className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
            
            {/* System status */}
            <div className="rounded bg-gray-200 p-2 dark:bg-dark-lighter">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Storage</p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">65%</p>
              </div>
              <div className="w-full bg-gray-300 dark:bg-dark-600 rounded-full h-1">
                <div className="bg-primary-600 h-1 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 