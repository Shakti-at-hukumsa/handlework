import React, { useState } from 'react';
import { 
  UserCircleIcon, 
  BellIcon, 
  PaintBrushIcon, 
  KeyIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { useAppSettings } from '../contexts/AppContext';

const settingsSections = [
  { id: 'profile', name: 'Profile', icon: UserCircleIcon },
  { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  { id: 'backup', name: 'Backup & Sync', icon: CloudArrowUpIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Settings = () => {
  const { settings, updateSetting, resetSettings } = useAppSettings();
  const [activeSection, setActiveSection] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  
  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large' },
  ];

  const iconSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large' },
  ];

  const zoomOptions = [
    { value: 80, label: '80%' },
    { value: 90, label: '90%' },
    { value: 100, label: '100%' },
    { value: 110, label: '110%' },
    { value: 120, label: '120%' },
  ];

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  // Toggle theme handler
  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-app-lg font-semibold">Settings</h1>
        <button 
          onClick={resetSettings}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-app-sm"
        >
          Reset to Defaults
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-app-base font-medium mb-4">Appearance</h2>
          
          {/* Theme */}
          <div className="mb-4">
            <label className="block text-app-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Theme
            </label>
            <div className="flex space-x-2">
              {themeOptions.map(option => (
                <button
                  key={option.value}
                  className={`px-3 py-1 text-app-sm rounded-md ${
                    settings.theme === option.value
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-300 dark:border-primary-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                  }`}
                  onClick={() => updateSetting('theme', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Font Size */}
          <div className="mb-4">
            <label className="block text-app-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Font Size
            </label>
            <div className="flex space-x-2">
              {fontSizeOptions.map(option => (
                <button
                  key={option.value}
                  className={`px-3 py-1 text-app-sm rounded-md ${
                    settings.fontSize === option.value
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-300 dark:border-primary-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                  }`}
                  onClick={() => updateSetting('fontSize', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Icon Size */}
          <div className="mb-4">
            <label className="block text-app-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Icon Size
            </label>
            <div className="flex space-x-2">
              {iconSizeOptions.map(option => (
                <button
                  key={option.value}
                  className={`px-3 py-1 text-app-sm rounded-md ${
                    settings.iconSize === option.value
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-300 dark:border-primary-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                  }`}
                  onClick={() => updateSetting('iconSize', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Zoom */}
          <div>
            <label className="block text-app-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Zoom
            </label>
            <div className="flex space-x-2">
              {zoomOptions.map(option => (
                <button
                  key={option.value}
                  className={`px-3 py-1 text-app-sm rounded-md ${
                    settings.zoom === option.value
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-300 dark:border-primary-800'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                  }`}
                  onClick={() => updateSetting('zoom', option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Preview Section */}
        <div className="bg-white dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-app-base font-medium mb-4">Preview</h2>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-4">
            <div className="flex items-center mb-2">
              <div className={`rounded-full bg-primary-600 mr-2 icon-app-sm`}></div>
              <h3 className="text-app-base font-medium">Title with icon</h3>
            </div>
            <p className="text-app-sm text-gray-600 dark:text-gray-400 mb-2">
              This text shows the current font size setting.
            </p>
            <div className="flex space-x-2 items-center">
              <svg className="icon-app-xs text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <svg className="icon-app-sm text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <svg className="icon-app-base text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="text-app-sm text-gray-600 dark:text-gray-400">
            <p className="mb-1"><span className="font-medium">Current Settings:</span></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Theme: {themeOptions.find(o => o.value === settings.theme)?.label}</li>
              <li>Font Size: {fontSizeOptions.find(o => o.value === settings.fontSize)?.label}</li>
              <li>Icon Size: {iconSizeOptions.find(o => o.value === settings.iconSize)?.label}</li>
              <li>Zoom: {zoomOptions.find(o => o.value === settings.zoom)?.label}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 