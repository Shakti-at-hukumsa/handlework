import React, { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  AdjustmentsHorizontalIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

/**
 * Advanced search and filter component with auto-complete and history
 */
const AutoSearchFilter = ({ 
  onSearch, 
  onFilterChange,
  placeholder = 'Search...',
  filters = [],
  searchHistory = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [history, setHistory] = useState(searchHistory.slice(0, 5));
  const [suggestions, setSuggestions] = useState([]);
  const [advancedMode, setAdvancedMode] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle clicks outside the component to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) && 
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Generate suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    // Create suggestions from history
    const historyMatches = history
      .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 3);
    
    // Create suggestions from common patterns
    let patternSuggestions = [];
    
    // If search term looks like a date
    if (/\d{1,2}[-/]\d{1,2}/.test(searchTerm)) {
      patternSuggestions.push(`due:${searchTerm}`);
    }
    
    // If search term is a priority level
    if (/high|medium|low/i.test(searchTerm)) {
      patternSuggestions.push(`priority:${searchTerm.toLowerCase()}`);
    }
    
    // If search term is a status
    if (/todo|done|inprogress|blocked/i.test(searchTerm)) {
      patternSuggestions.push(`status:${searchTerm.toLowerCase()}`);
    }
    
    // Combine all suggestions
    setSuggestions([...historyMatches, ...patternSuggestions]);
  }, [searchTerm, history]);
  
  // Parse advanced search term
  const parseAdvancedSearch = (term) => {
    const result = { text: term, filters: {} };
    
    // Extract filters in the format field:value
    const filterPattern = /([\w]+):([\w\s-]+)(?:\s|$)/g;
    let match;
    let cleanTerm = term;
    
    while ((match = filterPattern.exec(term)) !== null) {
      const [fullMatch, field, value] = match;
      result.filters[field] = value.trim();
      cleanTerm = cleanTerm.replace(fullMatch, ' ');
    }
    
    result.text = cleanTerm.trim();
    return result;
  };
  
  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim() === '') return;
    
    // Save to history
    if (!history.includes(searchTerm)) {
      setHistory(prev => [searchTerm, ...prev].slice(0, 5));
    }
    
    // Parse for advanced search
    if (advancedMode || searchTerm.includes(':')) {
      const parsed = parseAdvancedSearch(searchTerm);
      onSearch(parsed.text);
      setActiveFilters(prev => ({ ...prev, ...parsed.filters }));
      onFilterChange({ ...activeFilters, ...parsed.filters });
    } else {
      onSearch(searchTerm);
    }
    
    setShowSuggestions(false);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() !== '') {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  
  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    inputRef.current.focus();
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setActiveFilters({});
    onSearch('');
    onFilterChange({});
    inputRef.current.focus();
  };
  
  // Toggle filter
  const toggleFilter = (filter, value) => {
    // If already active, remove it
    if (activeFilters[filter] === value) {
      const newFilters = { ...activeFilters };
      delete newFilters[filter];
      setActiveFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      // Otherwise, add or update it
      const newFilters = { ...activeFilters, [filter]: value };
      setActiveFilters(newFilters);
      onFilterChange(newFilters);
    }
  };
  
  // Toggle advanced mode
  const toggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode);
    inputRef.current.focus();
  };
  
  // Get placeholder text based on mode
  const getPlaceholder = () => {
    if (advancedMode) {
      return 'Try field:value syntax (e.g., status:done priority:high)';
    }
    return placeholder;
  };
  
  // Get active filters chips
  const getActiveFilterChips = () => {
    return Object.entries(activeFilters).map(([key, value]) => (
      <div 
        key={key} 
        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 mr-1.5 mb-1.5"
      >
        <span className="font-medium mr-1">{key}:</span>
        <span>{value}</span>
        <button 
          onClick={() => toggleFilter(key, value)}
          className="ml-1 text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      </div>
    ));
  };
  
  return (
    <div className="mb-4">
      <div 
        className={`relative flex items-center overflow-hidden rounded-md border ${
          isActive
            ? 'border-primary-500 dark:border-primary-400 ring-1 ring-primary-500 dark:ring-primary-400'
            : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800`}
      >
        <div className="flex-shrink-0 pl-2 text-gray-400 dark:text-gray-500">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className="w-full py-2 px-2 outline-none text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        />
        
        {searchTerm && (
          <button
            className="flex-shrink-0 px-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={clearSearch}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
        
        <button
          className={`flex-shrink-0 p-2 ${
            advancedMode 
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
          onClick={toggleAdvancedMode}
          title={advancedMode ? "Disable advanced search" : "Enable advanced search"}
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Active Filters */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="mt-2 flex flex-wrap">
          {getActiveFilterChips()}
          
          <button 
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-1.5"
            onClick={() => {
              setActiveFilters({});
              onFilterChange({});
            }}
          >
            Clear all filters
          </button>
        </div>
      )}
      
      {/* Advanced Search Guide */}
      {advancedMode && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <span className="font-medium">status:</span>todo|inprogress|done|blocked
            </span>
            <span>
              <span className="font-medium">priority:</span>high|medium|low
            </span>
            <span>
              <span className="font-medium">due:</span>today|tomorrow|yyyy-mm-dd
            </span>
            <span>
              <span className="font-medium">project:</span>projectName
            </span>
          </div>
        </div>
      )}
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
        >
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.length > 0 && (
              <li className="px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                Recent searches
              </li>
            )}
            
            {history.length > 0 && history.slice(0, 3).map((item, index) => (
              <li 
                key={`history-${index}`}
                className="px-3 py-2 flex items-center text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => selectSuggestion(item)}
              >
                <ClockIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                <span>{item}</span>
              </li>
            ))}
            
            {suggestions.filter(s => !history.includes(s)).map((suggestion, index) => (
              <li 
                key={`suggestion-${index}`}
                className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Filter Pills */}
      {filters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {filters.map((filter) => (
            <div key={`${filter.type}-${filter.value}`}>
              <button
                className={`px-2 py-1 rounded-full text-xs ${
                  activeFilters[filter.type] === filter.value
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => toggleFilter(filter.type, filter.value)}
              >
                {filter.label || `${filter.type}: ${filter.value}`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoSearchFilter; 