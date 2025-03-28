import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowTrendingUpIcon, 
  ClockIcon, 
  CheckBadgeIcon, 
  CreditCardIcon 
} from '@heroicons/react/24/outline';

// Sample data
const stats = [
  { name: 'Active Projects', stat: '5', icon: ArrowTrendingUpIcon, color: 'bg-blue-500' },
  { name: 'Hours This Week', stat: '32', icon: ClockIcon, color: 'bg-purple-500' },
  { name: 'Tasks Completed', stat: '12', icon: CheckBadgeIcon, color: 'bg-green-500' },
  { name: 'Earnings', stat: '$1,250', icon: CreditCardIcon, color: 'bg-amber-500' },
];

const projectsData = [
  { id: 1, name: 'E-commerce Website', client: 'Client A', status: 'In Progress', deadline: '15 Apr 2023', progress: 75 },
  { id: 2, name: 'Mobile App Development', client: 'Client B', status: 'Planning', deadline: '30 Apr 2023', progress: 25 },
  { id: 3, name: 'API Integration', client: 'Client C', status: 'In Progress', deadline: '22 Apr 2023', progress: 40 },
];

const tasksData = [
  { id: 1, name: 'Fix login issue', project: 'E-commerce Website', priority: 'High', status: 'In Progress' },
  { id: 2, name: 'Design landing page', project: 'Mobile App Development', priority: 'Medium', status: 'Todo' },
  { id: 3, name: 'Add payment methods', project: 'E-commerce Website', priority: 'High', status: 'Todo' },
  { id: 4, name: 'Create user documentation', project: 'API Integration', priority: 'Low', status: 'Todo' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Dashboard = () => {
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
          <div key={item.name} className="card overflow-hidden">
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
      <div className="card overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Active Projects</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Your current project status</p>
          </div>
          <Link to="/projects" className="text-primary hover:text-primary-dark text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="border-t border-gray-200 dark:border-dark-lightest">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-lightest">
              <thead className="bg-gray-50 dark:bg-dark-lighter">
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
              <tbody className="bg-white dark:bg-dark-DEFAULT divide-y divide-gray-200 dark:divide-dark-lightest">
                {projectsData.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {project.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'In Progress' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' 
                          : 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {project.deadline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 dark:bg-dark-lightest rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 inline-block">
                        {project.progress}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent tasks */}
      <div className="card overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Tasks</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Your pending and in-progress tasks</p>
          </div>
          <Link to="/tasks" className="text-primary hover:text-primary-dark text-sm font-medium">
            View All
          </Link>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-dark-lightest">
          {tasksData.map((task) => (
            <li key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-dark-lighter transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id={`task-${task.id}`}
                    name={`task-${task.id}`}
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary rounded"
                  />
                  <label htmlFor={`task-${task.id}`} className="ml-3 block">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{task.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 block">
                      {task.project}
                    </span>
                  </label>
                </div>
                <div className="flex items-center">
                  <span
                    className={classNames(
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      task.priority === 'High' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' 
                        : task.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                        : 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                    )}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={classNames(
                      'ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      task.status === 'In Progress' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                    )}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard; 