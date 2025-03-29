import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ClipboardDocumentCheckIcon, 
  CalendarIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import ProjectForm from '../components/modals/ProjectForm';

// Helper function to calculate progress based on tasks
const calculateProgress = (projectId, tasks) => {
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  if (projectTasks.length === 0) return 0;
  
  const completedTasks = projectTasks.filter(task => task.status === 'Done').length;
  return Math.round((completedTasks / projectTasks.length) * 100);
};

// Helper function to calculate status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
    case 'On Hold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
  }
};

const Projects = () => {
  const { 
    data: { projects, tasks }, 
    addProject,
    updateProject,
    deleteProject
  } = useData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Open form for creating a new project
  const handleAddProject = () => {
    setCurrentProject(null);
    setIsFormOpen(true);
  };

  // Open form for editing an existing project
  const handleEditProject = (project) => {
    setCurrentProject(project);
    setIsFormOpen(true);
  };

  // Handle saving project (create or update)
  const handleSaveProject = (formData) => {
    if (currentProject) {
      updateProject(currentProject.id, formData);
    } else {
      addProject(formData);
    }
    setIsFormOpen(false);
  };

  // Open delete confirmation
  const handleDeleteClick = (projectId) => {
    setConfirmDelete(projectId);
  };

  // Confirm and execute project deletion
  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteProject(confirmDelete);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Projects</h1>
        <button
          type="button"
          onClick={handleAddProject}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          New Project
        </button>
      </div>
      
      {/* Project Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <ProjectForm
                project={currentProject}
                onSave={handleSaveProject}
                onCancel={() => setIsFormOpen(false)}
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
                    Delete Project
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this project? All related tasks, schedules, and payments will also be deleted. This action cannot be undone.
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
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new project.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddProject}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Project
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const progress = calculateProgress(project.id, tasks);
            return (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{project.name}</h3>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-2">Client:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{project.client}</span>
                  </div>
                  
                  {project.startDate && project.endDate && (
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {project.budget > 0 && (
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>Budget: ${project.budget.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
                    </div>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <PencilIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(project.id)}
                        className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/tasks?projectId=${project.id}`}
                        className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <ClipboardDocumentCheckIcon className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <Link 
                        to={`/schedule?projectId=${project.id}`}
                        className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <Link 
                        to={`/payments?projectId=${project.id}`}
                        className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <CreditCardIcon className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Projects; 