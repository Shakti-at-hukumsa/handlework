/**
 * Developer Tools utility functions
 * Provides helpful debugging and development utilities
 */

// Log with timestamp and styled console output
export const devLog = (message, data = null, type = 'info') => {
  if (process.env.NODE_ENV === 'production') return;
  
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  const styles = {
    info: 'color: #3498db; font-weight: bold;',
    warn: 'color: #f39c12; font-weight: bold;',
    error: 'color: #e74c3c; font-weight: bold;',
    success: 'color: #2ecc71; font-weight: bold;'
  };
  
  console.log(`%c[${timestamp}] ${message}`, styles[type]);
  if (data) console.log(data);
};

// Performance measurement utility
export const measurePerformance = (callback, iterations = 1) => {
  if (process.env.NODE_ENV === 'production') return callback();
  
  const start = performance.now();
  let result;
  
  for (let i = 0; i < iterations; i++) {
    result = callback();
  }
  
  const end = performance.now();
  const duration = (end - start) / iterations;
  
  devLog(`Performance: ${duration.toFixed(2)}ms`, { iterations }, 'info');
  return result;
};

// Simulate network latency (useful for testing loading states)
export const simulateNetworkLatency = async (callback, minMs = 300, maxMs = 1500) => {
  if (process.env.NODE_ENV === 'production') return callback();
  
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  devLog(`Simulating network latency: ${delay}ms`, null, 'warn');
  
  return new Promise(resolve => {
    setTimeout(async () => {
      const result = await callback();
      resolve(result);
    }, delay);
  });
};

// Check browser memory usage
export const checkMemoryUsage = () => {
  if (!window.performance || !window.performance.memory) {
    devLog('Memory API not available in this browser', null, 'warn');
    return null;
  }
  
  const { 
    jsHeapSizeLimit, 
    totalJSHeapSize, 
    usedJSHeapSize 
  } = window.performance.memory;
  
  const usage = {
    total: formatBytes(totalJSHeapSize),
    used: formatBytes(usedJSHeapSize),
    limit: formatBytes(jsHeapSizeLimit),
    percentUsed: Math.round((usedJSHeapSize / jsHeapSizeLimit) * 100)
  };
  
  devLog('Memory Usage', usage, 'info');
  return usage;
};

// Format bytes to human-readable format
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

// Count renders for performance debugging
export const useRenderCount = (componentName) => {
  if (process.env.NODE_ENV === 'production') return null;
  
  const renderCount = React.useRef(0);
  renderCount.current++;
  
  React.useEffect(() => {
    devLog(`${componentName} rendered`, { count: renderCount.current }, 'info');
  });
  
  return renderCount.current;
};

// Data structure size analyzer
export const analyzeDataSize = (data, label = 'Data') => {
  if (process.env.NODE_ENV === 'production') return;
  
  try {
    const json = JSON.stringify(data);
    const size = formatBytes(new Blob([json]).size);
    
    // Count items in arrays/objects
    let itemCount = 0;
    if (Array.isArray(data)) {
      itemCount = data.length;
    } else if (typeof data === 'object' && data !== null) {
      itemCount = Object.keys(data).length;
    }
    
    devLog(`${label} Size: ${size}`, { items: itemCount }, 'info');
    return { size, itemCount };
  } catch (error) {
    devLog('Error analyzing data size', error, 'error');
    return null;
  }
};

// Generate mock data for testing
export const generateMockData = (template, count = 1) => {
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const item = {};
    
    for (const [key, config] of Object.entries(template)) {
      switch (config.type) {
        case 'id':
          item[key] = `${config.prefix || ''}${Math.random().toString(36).substr(2, 9)}`;
          break;
        case 'name':
          item[key] = `${config.prefix || ''}${i + 1}`;
          break;
        case 'number':
          item[key] = Math.floor(Math.random() * (config.max || 100)) + (config.min || 0);
          break;
        case 'boolean':
          item[key] = Math.random() > 0.5;
          break;
        case 'date':
          const date = new Date();
          date.setDate(date.getDate() + (Math.random() * 60 - 30));
          item[key] = date.toISOString().split('T')[0];
          break;
        case 'enum':
          const options = config.options || [];
          item[key] = options[Math.floor(Math.random() * options.length)];
          break;
        default:
          item[key] = null;
      }
    }
    
    results.push(item);
  }
  
  return count === 1 ? results[0] : results;
};

// Local Storage debugger
export const debugLocalStorage = () => {
  if (process.env.NODE_ENV === 'production') return;
  
  try {
    const items = { ...localStorage };
    let totalSize = 0;
    const details = [];
    
    for (const key in items) {
      const size = new Blob([items[key]]).size;
      totalSize += size;
      details.push({
        key,
        size: formatBytes(size),
        bytes: size
      });
    }
    
    details.sort((a, b) => b.bytes - a.bytes);
    
    devLog(`LocalStorage Usage: ${formatBytes(totalSize)}`, {
      itemCount: Object.keys(items).length,
      items: details
    }, 'info');
    
    return {
      totalSize: formatBytes(totalSize),
      items: details
    };
  } catch (error) {
    devLog('Error debugging localStorage', error, 'error');
    return null;
  }
};

// Find duplicate items in an array (useful for finding duplicate IDs)
export const findDuplicates = (array, keyFn = item => item) => {
  const seen = new Map();
  const duplicates = [];
  
  array.forEach((item, index) => {
    const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
    
    if (seen.has(key)) {
      duplicates.push({
        key,
        item,
        index,
        firstIndex: seen.get(key)
      });
    } else {
      seen.set(key, index);
    }
  });
  
  return duplicates;
};

// Check for broken references (e.g., tasks referencing non-existent projects)
export const findBrokenReferences = (items, references, itemKey = 'id', referenceKey) => {
  if (!itemKey || !referenceKey) {
    throw new Error('itemKey and referenceKey are required');
  }
  
  // Create a set of valid IDs
  const validIds = new Set(items.map(item => item[itemKey]));
  
  // Find references to non-existent IDs
  const brokenRefs = references.filter(ref => {
    const refValue = ref[referenceKey];
    return refValue && !validIds.has(refValue);
  });
  
  return brokenRefs;
};

// Data version migration helper
export const migrateData = (data, currentVersion, migrations) => {
  let currentData = { ...data };
  let version = currentVersion;
  
  // Get migrations that need to be applied
  const pendingMigrations = Object.keys(migrations)
    .map(v => parseInt(v, 10))
    .filter(v => v > currentVersion)
    .sort((a, b) => a - b);
  
  // Apply migrations in order
  for (const migrationVersion of pendingMigrations) {
    try {
      devLog(`Applying migration v${migrationVersion}`, null, 'info');
      currentData = migrations[migrationVersion](currentData);
      version = migrationVersion;
    } catch (error) {
      devLog(`Migration to v${migrationVersion} failed`, error, 'error');
      break;
    }
  }
  
  return { data: currentData, version };
};

// User-friendly dates formatter
export const formatDateRelative = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // Today
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Within last 7 days
  if (diffDays < 7) {
    return `${date.toLocaleDateString([], { weekday: 'long' })} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // This year
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
  
  // Different year
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
};

// Deep find in nested objects
export const deepFind = (obj, searchKey, searchValue) => {
  if (!obj || typeof obj !== 'object') return null;
  
  // Direct match
  if (obj[searchKey] === searchValue) return obj;
  
  // Search in arrays
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const result = deepFind(item, searchKey, searchValue);
      if (result) return result;
    }
    return null;
  }
  
  // Search in object properties
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
      const result = deepFind(obj[key], searchKey, searchValue);
      if (result) return result;
    }
  }
  
  return null;
};

// Data compression for storage
export const compressData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  } catch (error) {
    devLog('Error compressing data', error, 'error');
    return null;
  }
};

// Data decompression
export const decompressData = (compressedData) => {
  try {
    const jsonString = atob(compressedData);
    return JSON.parse(jsonString);
  } catch (error) {
    devLog('Error decompressing data', error, 'error');
    return null;
  }
};

// Detect device capabilities
export const detectDeviceCapabilities = () => {
  const capabilities = {
    touchscreen: 'ontouchstart' in window,
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    orientation: !!window.screen.orientation,
    onlineStatus: navigator.onLine,
    geolocation: !!navigator.geolocation,
    notifications: 'Notification' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webShare: !!navigator.share,
    battery: 'getBattery' in navigator,
    bluetooth: !!navigator.bluetooth,
    connection: !!(navigator.connection || navigator.mozConnection || navigator.webkitConnection),
    deviceMemory: navigator.deviceMemory || 'unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    maxTouchPoints: navigator.maxTouchPoints || 0,
    screenSize: {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth
    }
  };
  
  devLog('Device capabilities', capabilities, 'info');
  return capabilities;
};

export default {
  devLog,
  measurePerformance,
  simulateNetworkLatency,
  checkMemoryUsage,
  formatBytes,
  useRenderCount,
  analyzeDataSize,
  generateMockData,
  debugLocalStorage,
  findDuplicates,
  findBrokenReferences,
  migrateData,
  formatDateRelative,
  deepFind,
  compressData,
  decompressData,
  detectDeviceCapabilities
}; 