import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowTrendingUpIcon, 
  ClockIcon, 
  CheckBadgeIcon, 
  CreditCardIcon 
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Helper function to calculate status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
    case 'On Hold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
  }
};

// Helper function to calculate priority color
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
    case 'Low':
      return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
  }
};

// Helper function to calculate task status color
const getTaskStatusColor = (status) => {
  switch (status) {
    case 'Done':
      return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
    case 'Blocked':
      return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
  }
};

// Helper function to calculate progress based on tasks
const calculateProgress = (projectId, tasks) => {
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  
  const completedTasks = projectTasks.filter(task => task.status === 'Done').length;
  return Math.round((completedTasks / projectTasks.length) * 100);
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

const Dashboard = () => {
  const { data } = useData();
  const { projects, tasks, schedules, payments } = data;
  
  // Performance monitoring state
  const [performanceMetrics, setPerformanceMetrics] = useState({
    memoryUsage: 0,
    loadTime: 0,
    storageSize: 0
  });

  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  
  // Calculate performance metrics on mount
  useEffect(() => {
    // Measure load time (simple approximation)
    const loadTimeStart = performance.now();
    
    const measurePerformance = () => {
      // Calculate storage size in KB
      const storageSize = Math.round(JSON.stringify(data).length / 1024);
      
      // Estimate memory usage (this is not fully accurate in browsers)
      // For a real implementation, you would use performance.memory in Chrome
      let memoryUsage = 0;
      if (window.performance && window.performance.memory) {
        memoryUsage = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
      }
      
      // Calculate page load time
      const loadTime = Math.round(performance.now() - loadTimeStart);
      
      setPerformanceMetrics({
        memoryUsage,
        loadTime,
        storageSize
      });
    };
    
    // Wait for page to render completely
    setTimeout(measurePerformance, 100);
    
    // Setup periodic updates
    const intervalId = setInterval(measurePerformance, 10000);
    
    return () => clearInterval(intervalId);
  }, [data]);
  
  // Calculate stats
  const stats = useMemo(() => {
    // Active projects (not cancelled or completed)
    const activeProjects = projects.filter(p => 
      p.status !== 'Completed' && p.status !== 'Cancelled'
    ).length;
    
    // Tasks completed this week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const tasksCompletedThisWeek = tasks.filter(task => {
      if (task.status !== 'Done') return false;
      
      const taskDate = new Date(task.completedAt || task.updatedAt || task.createdAt);
      return taskDate >= startOfWeek;
    }).length;
    
    // Scheduled hours this week
    const scheduledHoursThisWeek = schedules
      .filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= startOfWeek && scheduleDate <= today && schedule.startTime && schedule.endTime;
      })
      .reduce((total, schedule) => {
        if (!schedule.startTime || !schedule.endTime) return total;
        
        const [startHours, startMinutes] = schedule.startTime.split(':').map(Number);
        const [endHours, endMinutes] = schedule.endTime.split(':').map(Number);
        
        const duration = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
        return total + (duration / 60);
      }, 0);
    
    // Total earnings (paid invoices)
    const totalEarnings = payments
      .filter(payment => payment.type === 'Invoice' && payment.status === 'Paid')
      .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    
    return [
      { name: 'Active Projects', stat: activeProjects.toString(), icon: ArrowTrendingUpIcon, color: 'bg-blue-500' },
      { name: 'Tasks Completed', stat: tasksCompletedThisWeek.toString(), icon: CheckBadgeIcon, color: 'bg-green-500' },
      { name: 'Hours This Week', stat: scheduledHoursThisWeek.toFixed(1), icon: ClockIcon, color: 'bg-purple-500' },
      { name: 'Earnings', stat: formatCurrency(totalEarnings), icon: CreditCardIcon, color: 'bg-amber-500' },
    ];
  }, [projects, tasks, schedules, payments]);
  
  // Get recent projects (limited to 3, sorted by recently updated)
  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [projects]);
  
  // Get upcoming tasks (limited to 4, sorted by due date)
  const upcomingTasks = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return [...tasks]
      .filter(task => task.status !== 'Done' && task.dueDate)
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      })
      .slice(0, 4);
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Welcome back! Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${item.color}`}>
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{item.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">{item.stat}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects list */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Active Projects</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Your current project status</p>
          </div>
          <Link to="/projects" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
            View All
          </Link>
        </div>
        {recentProjects.length === 0 ? (
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No projects yet. Create a new project to get started.</p>
            <div className="mt-3">
              <Link
                to="/projects"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Create Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentProjects.map((project) => {
                    const progress = calculateProgress(project.id, tasks);
                    return (
                      <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {project.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {project.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-primary-600 h-2.5 rounded-full" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">
                            {progress}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Recent tasks */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Upcoming Tasks</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Your pending and in-progress tasks</p>
          </div>
          <Link to="/tasks" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
            View All
          </Link>
        </div>
        {upcomingTasks.length === 0 ? (
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No upcoming tasks. Create a new task to get started.</p>
            <div className="mt-3">
              <Link
                to="/tasks"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Create Task
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingTasks.map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              
              return (
                <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project ? project.name : 'Unknown Project'}
                          {task.dueDate && (
                            <span className="ml-2 text-xs">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTaskStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Performance monitor */}
      <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm">
        <div 
          className="px-4 py-3 sm:px-6 flex justify-between items-center cursor-pointer"
          onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md p-1.5 bg-purple-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v9.375c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v4.875c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 18v-4.875z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium leading-6 text-gray-900 dark:text-white">Developer Performance Monitor</h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{showPerformanceMonitor ? '▼' : '►'}</span>
        </div>
        
        {showPerformanceMonitor && (
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Load Time</h4>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    performanceMetrics.loadTime > 500 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {performanceMetrics.loadTime > 500 ? 'Slow' : 'Fast'}
                  </span>
                </div>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{performanceMetrics.loadTime} ms</p>
                <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${
                      performanceMetrics.loadTime > 1000 
                        ? 'bg-red-500' 
                        : performanceMetrics.loadTime > 500 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`} 
                    style={{ width: `${Math.min(100, performanceMetrics.loadTime / 10)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Memory Usage</h4>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    performanceMetrics.memoryUsage > 50
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {performanceMetrics.memoryUsage > 0 
                      ? (performanceMetrics.memoryUsage > 50 ? 'Moderate' : 'Good') 
                      : 'Unknown'}
                  </span>
                </div>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {performanceMetrics.memoryUsage > 0 
                    ? `${performanceMetrics.memoryUsage} MB` 
                    : 'Not available'}
                </p>
                {performanceMetrics.memoryUsage > 0 && (
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full ${
                        performanceMetrics.memoryUsage > 100 
                          ? 'bg-red-500' 
                          : performanceMetrics.memoryUsage > 50
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      }`} 
                      style={{ width: `${Math.min(100, performanceMetrics.memoryUsage)}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">Storage Size</h4>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    performanceMetrics.storageSize > 500
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {performanceMetrics.storageSize > 500 ? 'Large' : 'Small'}
                  </span>
                </div>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{performanceMetrics.storageSize} KB</p>
                <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${
                      performanceMetrics.storageSize > 1000 
                        ? 'bg-red-500' 
                        : performanceMetrics.storageSize > 500 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`} 
                    style={{ width: `${Math.min(100, performanceMetrics.storageSize / 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">Performance Tips</h4>
              <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1 pl-5 list-disc">
                <li>Use pagination for large data sets to improve rendering performance</li>
                <li>Consider using memoization for expensive calculations</li>
                <li>Backup your data regularly to prevent loss</li>
                <li>Clean up completed projects to reduce storage size</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 