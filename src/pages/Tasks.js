import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ChevronDoubleUpIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import TaskForm from '../components/modals/TaskForm';
import TaskMultiSelect from '../components/TaskMultiSelect';
import AutoSearchFilter from '../components/AutoSearchFilter';
import DataSyncStatus from '../components/DataSyncStatus';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import { trackPageVisit } from '../utils/userPreferences';

// Helper function to get priority icon and classes
const getPriorityDetails = (priority) => {
  switch (priority) {
    case 'High':
      return {
        icon: <ChevronDoubleUpIcon className="h-4 w-4" />,
        className: 'text-red-600 dark:text-red-400'
      };
    case 'Medium':
      return {
        icon: <ChevronUpIcon className="h-4 w-4" />,
        className: 'text-yellow-600 dark:text-yellow-400'
      };
    case 'Low':
      return {
        icon: <ChevronDownIcon className="h-4 w-4" />,
        className: 'text-green-600 dark:text-green-400'
      };
    default:
      return {
        icon: <ChevronDownIcon className="h-4 w-4" />,
        className: 'text-gray-500'
      };
  }
};

// Helper function to get status icon and classes
const getStatusDetails = (status) => {
  switch (status) {
    case 'Done':
      return {
        icon: <CheckCircleIcon className="h-4 w-4" />,
        className: 'text-green-600 dark:text-green-400',
        bgClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      };
    case 'In Progress':
      return {
        icon: <ClockIcon className="h-4 w-4" />,
        className: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      };
    case 'Blocked':
      return {
        icon: <ExclamationCircleIcon className="h-4 w-4" />,
        className: 'text-red-600 dark:text-red-400',
        bgClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      };
    default:
      return {
        icon: <ClockIcon className="h-4 w-4" />,
        className: 'text-gray-500',
        bgClass: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      };
  }
};

const Tasks = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectIdFromUrl = queryParams.get('projectId');
  
  const { 
    data: { tasks, projects, metadata }, 
    addTask,
    updateTask,
    deleteTask,
    batchUpdateTasks,
    batchDeleteTasks
  } = useData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState({
    projectId: projectIdFromUrl || 'all',
    status: 'all',
    priority: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('task-search-history') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [viewMode, setViewMode] = useState('list'); // list, kanban
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Track page visit for history
  useEffect(() => {
    trackPageVisit('/tasks');
  }, []);
  
  // Reset project filter when projectId from URL changes
  useEffect(() => {
    if (projectIdFromUrl) {
      setActiveFilter(prev => ({
        ...prev,
        projectId: projectIdFromUrl
      }));
    }
  }, [projectIdFromUrl]);
  
  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('task-search-history', JSON.stringify(searchHistory));
  }, [searchHistory]);
  
  // Refresh data (simulate)
  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  }, []);
  
  // Set up keyboard shortcuts
  const shortcuts = {
    'n': () => handleAddTask(),
    '/': () => document.querySelector('[data-search-input]')?.focus(),
    'ctrl+a': (e) => {
      e.preventDefault();
      // Select all tasks would be handled by TaskMultiSelect
    },
    'h': () => {
      const newHistory = searchHistory.slice(0, 10);
      if (searchTerm && !newHistory.includes(searchTerm)) {
        setSearchHistory([searchTerm, ...newHistory]);
      }
    }
  };
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts(shortcuts, true);
  
  // Open form for creating a new task
  const handleAddTask = () => {
    setCurrentTask(null);
    setIsFormOpen(true);
  };

  // Open form for editing an existing task
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };

  // Handle task status update
  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  // Handle saving task (create or update)
  const handleSaveTask = (formData) => {
    if (currentTask) {
      updateTask(currentTask.id, formData);
    } else {
      addTask(formData);
    }
    setIsFormOpen(false);
  };

  // Open delete confirmation
  const handleDeleteClick = (taskId) => {
    setConfirmDelete(taskId);
  };

  // Confirm and execute task deletion
  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteTask(confirmDelete);
      setConfirmDelete(null);
    }
  };

  // Update filters
  const handleFilterChange = (filterType, value) => {
    setActiveFilter(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    
    // Add to search history if not empty
    if (term && !searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev.slice(0, 9)]);
    }
  };
  
  // Handle advanced filter changes
  const handleAdvancedFilterChange = (filters) => {
    // Extract project filter if any
    if (filters.project) {
      const projectId = projects.find(p => 
        p.name.toLowerCase() === filters.project.toLowerCase()
      )?.id || 'all';
      
      setActiveFilter(prev => ({
        ...prev,
        projectId
      }));
    }
    
    // Extract status filter if any
    if (filters.status) {
      let status = 'all';
      
      if (filters.status.toLowerCase() === 'todo') {
        status = 'Todo';
      } else if (filters.status.toLowerCase() === 'inprogress' || filters.status.toLowerCase() === 'in progress') {
        status = 'In Progress';
      } else if (filters.status.toLowerCase() === 'done') {
        status = 'Done';
      } else if (filters.status.toLowerCase() === 'blocked') {
        status = 'Blocked';
      }
      
      setActiveFilter(prev => ({
        ...prev,
        status
      }));
    }
    
    // Extract priority filter if any
    if (filters.priority) {
      let priority = 'all';
      
      if (filters.priority.toLowerCase() === 'high') {
        priority = 'High';
      } else if (filters.priority.toLowerCase() === 'medium') {
        priority = 'Medium';
      } else if (filters.priority.toLowerCase() === 'low') {
        priority = 'Low';
      }
      
      setActiveFilter(prev => ({
        ...prev,
        priority
      }));
    }
  };
  
  // Toggle show completed tasks
  const handleToggleShowCompleted = () => {
    setShowCompletedTasks(prev => !prev);
  };
  
  // Filter and search tasks
  const getFilteredTasks = () => {
    return tasks
      .filter(task => {
        // Filter by completion status
        if (!showCompletedTasks && task.status === 'Done') {
          return false;
        }
        
        // Filter by project
        const projectMatch = activeFilter.projectId === 'all' || task.projectId === activeFilter.projectId;
        
        // Filter by status
        const statusMatch = activeFilter.status === 'all' || task.status === activeFilter.status;
        
        // Filter by priority
        const priorityMatch = activeFilter.priority === 'all' || task.priority === activeFilter.priority;
        
        // Search by text
        const searchMatch = !searchTerm || 
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return projectMatch && statusMatch && priorityMatch && searchMatch;
      })
      .map(task => {
        // Add project name for display
        const project = projects.find(p => p.id === task.projectId);
        return {
          ...task, 
          projectName: project ? project.name : 'No Project'
        };
      });
  };
  
  // Get predefined filters for the filter component
  const getPredefinedFilters = () => {
    const statusFilters = [
      { type: 'status', value: 'Todo', label: 'Todo' },
      { type: 'status', value: 'In Progress', label: 'In Progress' },
      { type: 'status', value: 'Done', label: 'Done' },
      { type: 'status', value: 'Blocked', label: 'Blocked' }
    ];
    
    const priorityFilters = [
      { type: 'priority', value: 'High', label: 'High Priority' },
      { type: 'priority', value: 'Medium', label: 'Medium Priority' },
      { type: 'priority', value: 'Low', label: 'Low Priority' }
    ];
    
    return [...statusFilters, ...priorityFilters];
  };
  
  // Get filtered tasks
  const filteredTasks = getFilteredTasks();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tasks</h1>
          {isRefreshing && (
            <ClockIcon className="ml-2 h-5 w-5 text-primary-500 animate-spin" />
          )}
          <div className="ml-4">
            <DataSyncStatus 
              lastSaved={metadata?.updatedAt}
              autoSaveEnabled={true}
            />
          </div>
        </div>
        
        <div className="flex space-x-3">
          <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={showCompletedTasks}
              onChange={handleToggleShowCompleted}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2">Show completed</span>
          </label>
          
          <button
            type="button"
            onClick={handleAddTask}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
            New Task
          </button>
        </div>
      </div>
      
      {/* Advanced Search and Filter */}
      <AutoSearchFilter
        onSearch={handleSearch}
        onFilterChange={handleAdvancedFilterChange}
        placeholder="Search tasks..."
        filters={getPredefinedFilters()}
        searchHistory={searchHistory}
      />
      
      {/* Project Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 text-sm rounded-md ${
            activeFilter.projectId === 'all'
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => handleFilterChange('projectId', 'all')}
        >
          All Projects
        </button>
        
        {projects.map(project => (
          <button
            key={project.id}
            className={`px-3 py-1.5 text-sm rounded-md ${
              activeFilter.projectId === project.id
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleFilterChange('projectId', project.id)}
          >
            {project.name}
          </button>
        ))}
      </div>
      
      {/* TaskMultiSelect Component */}
      <TaskMultiSelect 
        tasks={filteredTasks}
        onTaskUpdate={updateTask}
        onTaskDelete={deleteTask}
        onRefresh={refreshData}
      />
      
      {/* Task Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <TaskForm
                task={currentTask}
                onSave={handleSaveTask}
                onCancel={() => setIsFormOpen(false)}
                projectId={currentTask ? currentTask.projectId : activeFilter.projectId !== 'all' ? activeFilter.projectId : undefined}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
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
                    Delete Task
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this task? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 text-xs border border-gray-200 dark:border-gray-700">
        <div className="text-gray-700 dark:text-gray-300 font-medium mb-1">Keyboard Shortcuts:</div>
        <div className="text-gray-600 dark:text-gray-400">
          <div>
            <span className="inline-block w-10 font-mono">N</span>
            <span>New task</span>
          </div>
          <div>
            <span className="inline-block w-10 font-mono">/</span>
            <span>Focus search</span>
          </div>
          <div>
            <span className="inline-block w-10 font-mono">H</span>
            <span>Save search to history</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks; 