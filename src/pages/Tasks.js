import React, { useState } from 'react';
import { 
  PlusIcon, 
  ArrowsUpDownIcon, 
  AdjustmentsHorizontalIcon, 
  CheckCircleIcon,
  ChevronDownIcon, 
  CheckIcon
} from '@heroicons/react/24/outline';

// Sample data
const projectOptions = [
  { id: 'all', name: 'All Projects' },
  { id: 'p1', name: 'E-commerce Website' },
  { id: 'p2', name: 'Mobile App Development' },
  { id: 'p3', name: 'API Integration' },
  { id: 'p4', name: 'Website Redesign' },
  { id: 'p5', name: 'Database Migration' },
];

const initialTasks = [
  { 
    id: 1, 
    title: 'Fix login issue', 
    description: 'Users are unable to login with Google OAuth on Firefox',
    project: 'p1', 
    priority: 'High', 
    status: 'In Progress',
    dueDate: '2023-04-18',
    assignee: 'John D.',
    completed: false 
  },
  { 
    id: 2, 
    title: 'Design landing page', 
    description: 'Create a responsive landing page design with dark mode support',
    project: 'p2', 
    priority: 'Medium', 
    status: 'To Do',
    dueDate: '2023-04-22',
    assignee: 'Sarah M.',
    completed: false 
  },
  { 
    id: 3, 
    title: 'Add payment methods', 
    description: 'Integrate PayPal and Stripe payment gateways',
    project: 'p1', 
    priority: 'High', 
    status: 'To Do',
    dueDate: '2023-04-25',
    assignee: 'Alex K.',
    completed: false 
  },
  { 
    id: 4, 
    title: 'Create API documentation', 
    description: 'Document all API endpoints using Swagger',
    project: 'p3', 
    priority: 'Low', 
    status: 'To Do',
    dueDate: '2023-04-30',
    assignee: 'Robert J.',
    completed: false 
  },
  { 
    id: 5, 
    title: 'Optimize database queries', 
    description: 'Improve performance of slow running queries',
    project: 'p5', 
    priority: 'Medium', 
    status: 'In Progress',
    dueDate: '2023-04-28',
    assignee: 'Amanda L.',
    completed: false 
  },
  { 
    id: 6, 
    title: 'Fix responsive layout', 
    description: 'Fix UI issues on mobile devices',
    project: 'p4', 
    priority: 'Medium', 
    status: 'Completed',
    dueDate: '2023-04-15',
    assignee: 'Nina T.',
    completed: true 
  },
];

// Helper for conditional class names
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedProject, setSelectedProject] = useState('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortBy, setSortBy] = useState('dueDate');
  
  // Filter tasks based on selection
  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProject === 'all' || task.project === selectedProject;
    const matchesCompleted = showCompleted ? true : !task.completed;
    return matchesProject && matchesCompleted;
  });
  
  // Sort tasks based on selection
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === 'priority') {
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  // Toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, status: !task.completed ? 'Completed' : 'In Progress' } 
        : task
    ));
  };
  
  // Get project name by id
  const getProjectName = (projectId) => {
    const project = projectOptions.find(p => p.id === projectId);
    return project ? project.name : '';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tasks</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Manage and organize your development tasks
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          <span>New Task</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-auto">
            <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Project
            </label>
            <select
              id="project-select"
              className="block w-full rounded-md border-0 py-1.5 px-3 bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary sm:text-sm"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projectOptions.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <div className="relative">
              <select
                id="sort-select"
                className="block w-full rounded-md border-0 py-1.5 px-3 bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary sm:text-sm appearance-none pr-8"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                <ArrowsUpDownIcon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          </div>
          
          <div className="flex items-end">
            <div className="flex items-center h-9">
              <input
                id="show-completed"
                name="show-completed"
                type="checkbox"
                className="h-4 w-4 rounded text-primary focus:ring-primary border-gray-300 dark:border-gray-600"
                checked={showCompleted}
                onChange={() => setShowCompleted(!showCompleted)}
              />
              <label htmlFor="show-completed" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Show completed tasks
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tasks list */}
      <div className="card overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            {filteredTasks.length} Tasks
          </h3>
          <button
            type="button"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
            Customize View
          </button>
        </div>
        
        <div className="border-t border-gray-200 dark:border-dark-lighter">
          {sortedTasks.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-dark-lighter">
              {sortedTasks.map((task) => (
                <li key={task.id} className={classNames(
                  "px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-dark-lighter transition-colors",
                  task.completed ? "bg-gray-50 dark:bg-dark-lighter" : ""
                )}>
                  <div className="flex items-start gap-x-3">
                    <div className="flex-shrink-0 pt-1">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={classNames(
                          "h-5 w-5 rounded-full flex items-center justify-center",
                          task.completed 
                            ? "bg-green-500 text-white" 
                            : "border border-gray-300 dark:border-gray-600"
                        )}
                      >
                        {task.completed && <CheckIcon className="h-3 w-3" />}
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={classNames(
                          "text-sm font-medium", 
                          task.completed 
                            ? "text-gray-500 dark:text-gray-400 line-through" 
                            : "text-gray-900 dark:text-white"
                        )}>
                          {task.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className={classNames(
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                            task.priority === 'High' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                              : task.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          )}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {task.description}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Project: </span>
                            <span className="text-gray-700 dark:text-gray-300">{getProjectName(task.project)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Due: </span>
                            <span className={classNames(
                              "text-gray-700 dark:text-gray-300",
                              new Date(task.dueDate) < new Date() && !task.completed ? "text-red-600 dark:text-red-400" : ""
                            )}>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-dark-lighter dark:text-gray-200">
                            {task.assignee}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
              No tasks found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks; 