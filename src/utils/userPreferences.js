/**
 * User Preferences Utility
 * Provides functionality to save, load, and manage user preferences
 */

// Default preferences
const defaultPreferences = {
  // View preferences
  viewMode: 'list', // 'list', 'grid', 'kanban'
  showCompleted: true,
  compactView: false,
  
  // Sorting and filtering
  defaultTaskSort: 'dueDate', // 'dueDate', 'priority', 'createdAt', 'alphabetical'
  sortDirection: 'asc', // 'asc', 'desc'
  defaultStatusFilter: 'all', // 'all', 'todo', 'inProgress', 'blocked', 'done'
  defaultPriorityFilter: 'all', // 'all', 'high', 'medium', 'low'
  
  // Dashboard preferences
  dashboardWidgets: ['taskSummary', 'upcomingDeadlines', 'recentProjects', 'performanceMetrics'],
  dashboardLayout: 'default', // 'default', 'compact', 'detailed'
  
  // Notifications
  remindersBefore: 24, // hours 
  emailNotifications: false,
  desktopNotifications: true,
  
  // Display preferences
  language: 'en', // 'en', 'hi', 'en-hi' (hinglish)
  dateFormat: 'MM/DD/YYYY', // 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'
  timeFormat: '12h', // '12h', '24h'
  firstDayOfWeek: 0, // 0 = Sunday, 1 = Monday, etc.
  
  // Keyboard shortcuts
  enableShortcuts: true,
  customShortcuts: {},
  
  // Auto-save
  autoSaveEnabled: true,
  autoSaveInterval: 60, // seconds
  
  // Performance
  animationsEnabled: true,
  infiniteScrollingEnabled: true,
  lazyLoadingEnabled: true,
  
  // Last usage stats
  lastVisitedPage: '/',
  recentProjects: [], // Store last 5 visited projects
  recentTasks: [], // Store last 5 viewed tasks
};

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
const isLocalStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    
    // Test if we can actually use localStorage
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Load user preferences from localStorage
 * @returns {Object} User preferences
 */
export const loadPreferences = () => {
  try {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available, using default preferences');
      return defaultPreferences;
    }
    
    const savedPreferences = localStorage.getItem('user-preferences');
    if (savedPreferences) {
      // Merge saved preferences with default values (for any new preferences added)
      return { ...defaultPreferences, ...JSON.parse(savedPreferences) };
    }
    return defaultPreferences;
  } catch (error) {
    console.error('Error loading preferences from localStorage:', error);
    return defaultPreferences;
  }
};

/**
 * Save user preferences to localStorage
 * @param {Object} preferences User preferences to save
 * @returns {boolean} Success status
 */
export const savePreferences = (preferences) => {
  try {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available, preferences will not persist');
      return false;
    }
    
    localStorage.setItem('user-preferences', JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
    return false;
  }
};

/**
 * Update specific user preference
 * @param {string} key Preference key
 * @param {*} value Preference value
 * @returns {Object} Updated preferences
 */
export const updatePreference = (key, value) => {
  const currentPreferences = loadPreferences();
  const updatedPreferences = { ...currentPreferences, [key]: value };
  savePreferences(updatedPreferences);
  return updatedPreferences;
};

/**
 * Reset preferences to default values
 * @returns {Object} Default preferences
 */
export const resetPreferences = () => {
  savePreferences(defaultPreferences);
  return defaultPreferences;
};

/**
 * Track recently visited page
 * @param {string} path Page path
 * @returns {Object} Updated preferences
 */
export const trackPageVisit = (path) => {
  return updatePreference('lastVisitedPage', path);
};

/**
 * Track recently visited project
 * @param {string} projectId Project ID
 * @param {string} projectName Project name
 * @returns {Object} Updated preferences
 */
export const trackProjectVisit = (projectId, projectName) => {
  const currentPreferences = loadPreferences();
  
  // Create new recent project entry
  const newEntry = {
    id: projectId,
    name: projectName,
    timestamp: new Date().toISOString()
  };
  
  // Filter out this project if it exists already
  let recentProjects = currentPreferences.recentProjects.filter(
    project => project.id !== projectId
  );
  
  // Add to the beginning and limit to 5 items
  recentProjects = [newEntry, ...recentProjects].slice(0, 5);
  
  return updatePreference('recentProjects', recentProjects);
};

/**
 * Track recently viewed task
 * @param {string} taskId Task ID
 * @param {string} taskTitle Task title
 * @returns {Object} Updated preferences
 */
export const trackTaskView = (taskId, taskTitle) => {
  const currentPreferences = loadPreferences();
  
  // Create new recent task entry
  const newEntry = {
    id: taskId,
    title: taskTitle,
    timestamp: new Date().toISOString()
  };
  
  // Filter out this task if it exists already
  let recentTasks = currentPreferences.recentTasks.filter(
    task => task.id !== taskId
  );
  
  // Add to the beginning and limit to 5 items
  recentTasks = [newEntry, ...recentTasks].slice(0, 5);
  
  return updatePreference('recentTasks', recentTasks);
};

/**
 * Check if a specific feature is enabled based on user preferences
 * @param {string} featureName Name of the feature to check
 * @returns {boolean} Whether the feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  const preferences = loadPreferences();
  
  switch (featureName) {
    case 'animations':
      return preferences.animationsEnabled;
    case 'shortcuts':
      return preferences.enableShortcuts;
    case 'autoSave':
      return preferences.autoSaveEnabled;
    case 'infiniteScrolling':
      return preferences.infiniteScrollingEnabled;
    case 'lazyLoading':
      return preferences.lazyLoadingEnabled;
    case 'desktopNotifications':
      return preferences.desktopNotifications;
    case 'emailNotifications':
      return preferences.emailNotifications;
    default:
      return false;
  }
};

/**
 * Export preferences to a file
 * @returns {string} Filename created
 */
export const exportPreferences = () => {
  try {
    const preferences = loadPreferences();
    const dataStr = JSON.stringify(preferences, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `devspace-preferences-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return exportFileDefaultName;
  } catch (error) {
    console.error('Error exporting preferences:', error);
    return null;
  }
};

/**
 * Import preferences from a file
 * @param {File} file JSON file containing preferences
 * @returns {Promise<boolean>} Success status
 */
export const importPreferences = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = (event) => {
      try {
        const importedPreferences = JSON.parse(event.target.result);
        const mergedPreferences = { ...defaultPreferences, ...importedPreferences };
        savePreferences(mergedPreferences);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    };
    
    fileReader.onerror = (error) => {
      reject(error);
    };
    
    fileReader.readAsText(file);
  });
};

/**
 * Get default widget configuration
 * @param {string} widgetName Name of the widget
 * @returns {Object} Widget configuration
 */
export const getWidgetConfig = (widgetName) => {
  const preferences = loadPreferences();
  
  // Default configurations
  const defaultConfigs = {
    taskSummary: {
      showCompleted: preferences.showCompleted,
      limit: 5,
      sortBy: 'dueDate'
    },
    upcomingDeadlines: {
      daysAhead: 7,
      includePastDue: true,
      limit: 5
    },
    recentProjects: {
      limit: 3,
      showLastActive: true
    },
    performanceMetrics: {
      timeRange: 'week', // 'day', 'week', 'month'
      metrics: ['tasksCompleted', 'completionRate', 'avgCompletionTime']
    }
  };
  
  // Custom configurations (if saved)
  const customConfigs = preferences.widgetConfigs || {};
  
  return customConfigs[widgetName] || defaultConfigs[widgetName] || {};
};

/**
 * Update widget configuration
 * @param {string} widgetName Name of the widget
 * @param {Object} config Widget configuration
 * @returns {Object} Updated preferences
 */
export const updateWidgetConfig = (widgetName, config) => {
  const preferences = loadPreferences();
  
  // Get current widget configs
  const widgetConfigs = preferences.widgetConfigs || {};
  
  // Update specific widget config
  widgetConfigs[widgetName] = { ...widgetConfigs[widgetName], ...config };
  
  return updatePreference('widgetConfigs', widgetConfigs);
};

export default {
  loadPreferences,
  savePreferences,
  updatePreference,
  resetPreferences,
  trackPageVisit,
  trackProjectVisit,
  trackTaskView,
  isFeatureEnabled,
  exportPreferences,
  importPreferences,
  getWidgetConfig,
  updateWidgetConfig,
  defaultPreferences
}; 