import React, { useState, useRef } from 'react';
import { 
  UserCircleIcon, 
  BellIcon, 
  PaintBrushIcon, 
  KeyIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  MoonIcon, 
  SunIcon, 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAppSettings } from '../contexts/AppContext';
import { useData } from '../contexts/DataContext';
import DataIntegrityChecker from '../components/DataIntegrityChecker';
import { formatDateRelative } from '../utils/devTools';

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
  const { 
    exportData, 
    importData, 
    resetData, 
    backupDataToFile, 
    restoreDataFromFile,
    validateData,
    getStatistics
  } = useData();

  const [activeSection, setActiveSection] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [importResult, setImportResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [showDeveloperOptions, setShowDeveloperOptions] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const fileInputRef = useRef(null);
  
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

  // Handle data backup
  const handleBackup = () => {
    const success = backupDataToFile();
    if (success) {
      setImportResult({ success: true, message: 'Data exported successfully!' });
      
      // Refresh statistics to show updated backup time
      setStatistics(getStatistics());
    } else {
      setImportResult({ success: false, message: 'Failed to export data.' });
    }
    setTimeout(() => setImportResult(null), 3000);
  };

  // Handle restore file selection
  const handleRestoreClick = () => {
    fileInputRef.current.click();
  };

  // Handle file import
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await restoreDataFromFile(file);
      setImportResult({ success: true, message: 'Data restored successfully!' });
      
      // Refresh statistics after restore
      setStatistics(getStatistics());
    } catch (error) {
      setImportResult({ success: false, message: `Import failed: ${error.message}` });
    }
    
    // Reset file input
    e.target.value = null;
    setTimeout(() => setImportResult(null), 3000);
  };

  // Handle data validation
  const handleValidateData = () => {
    const result = validateData();
    setValidationResult(result);
  };

  // Handle data reset
  const handleResetData = () => {
    resetData();
    setConfirmReset(false);
    setImportResult({ success: true, message: 'All data has been reset!' });
    
    // Refresh statistics after reset
    setStatistics(getStatistics());
    
    setTimeout(() => setImportResult(null), 3000);
  };
  
  // Load statistics when component mounts or when showDeveloperOptions is toggled
  React.useEffect(() => {
    if (showDeveloperOptions && !statistics) {
      setStatistics(getStatistics());
    }
  }, [showDeveloperOptions, statistics, getStatistics]);

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

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Data Management</h3>
            
            {statistics && statistics.timestamps.lastBackup && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last backup: {formatDateRelative(statistics.timestamps.lastBackup)}
              </span>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <button
              type="button"
              onClick={handleBackup}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
              Backup Data
            </button>
            
            <button
              type="button"
              onClick={handleRestoreClick}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <ArrowUpTrayIcon className="mr-2 h-4 w-4" />
              Restore Data
            </button>
            
            {statistics && (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-700 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-200 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Reset All Data
              </button>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          {importResult && (
            <div className={`p-2 rounded text-sm ${
              importResult.success 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              <div className="flex items-center">
                {importResult.success ? (
                  <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                ) : (
                  <ExclamationCircleIcon className="h-4 w-4 mr-1.5" />
                )}
                {importResult.message}
              </div>
            </div>
          )}
          
          {/* Data statistics (basic info) */}
          {statistics && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <dt className="text-xs text-gray-500 dark:text-gray-400">Projects</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{statistics.counts.totalProjects}</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <dt className="text-xs text-gray-500 dark:text-gray-400">Tasks</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{statistics.counts.totalTasks}</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <dt className="text-xs text-gray-500 dark:text-gray-400">Completion Rate</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{statistics.rates.completionRate}%</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <dt className="text-xs text-gray-500 dark:text-gray-400">Total Earnings</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                  ${statistics.financial.totalEarnings.toFixed(2)}
                </dd>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Integrity Tools Section */}
      <DataIntegrityChecker />
      
      {/* Reset Data Confirmation Modal */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Reset All Data
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to reset all data? This will permanently delete all projects, tasks, schedules, and payments. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleResetData}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Reset All Data
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 