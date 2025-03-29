import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import PaymentForm from '../components/modals/PaymentForm';

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'Overdue':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'Cancelled':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
};

// Get payment type icon
const getPaymentTypeIcon = (type) => {
  switch (type) {
    case 'Invoice':
      return <DocumentTextIcon className="h-4 w-4" />;
    case 'Expense':
      return <ArrowDownTrayIcon className="h-4 w-4 rotate-180" />;
    default:
      return <BanknotesIcon className="h-4 w-4" />;
  }
};

const Payments = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectIdFromUrl = queryParams.get('projectId');
  
  const { 
    data: { payments, projects }, 
    addPayment,
    updatePayment,
    deletePayment
  } = useData();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState({
    projectId: projectIdFromUrl || 'all',
    status: 'all',
    type: 'all',
    timeframe: 'all' // all, current-month, last-month, current-year
  });
  
  // Reset project filter when projectId from URL changes
  useEffect(() => {
    if (projectIdFromUrl) {
      setActiveFilter(prev => ({
        ...prev,
        projectId: projectIdFromUrl
      }));
    }
  }, [projectIdFromUrl]);

  // Open form for creating a new payment
  const handleAddPayment = () => {
    setCurrentPayment(null);
    setIsFormOpen(true);
  };

  // Open form for editing an existing payment
  const handleEditPayment = (payment) => {
    setCurrentPayment(payment);
    setIsFormOpen(true);
  };

  // Handle saving payment (create or update)
  const handleSavePayment = (formData) => {
    if (currentPayment) {
      updatePayment(currentPayment.id, formData);
    } else {
      addPayment(formData);
    }
    setIsFormOpen(false);
  };

  // Open delete confirmation
  const handleDeleteClick = (paymentId) => {
    setConfirmDelete(paymentId);
  };

  // Confirm and execute payment deletion
  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deletePayment(confirmDelete);
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

  // Filter payments based on active filters
  const filteredPayments = payments.filter(payment => {
    const projectMatch = activeFilter.projectId === 'all' || payment.projectId === activeFilter.projectId;
    const statusMatch = activeFilter.status === 'all' || payment.status === activeFilter.status;
    const typeMatch = activeFilter.type === 'all' || payment.type === activeFilter.type;
    
    let timeframeMatch = true;
    const paymentDate = new Date(payment.date);
    const now = new Date();
    
    if (activeFilter.timeframe === 'current-month') {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      timeframeMatch = paymentDate >= firstDayOfMonth && paymentDate <= lastDayOfMonth;
    } else if (activeFilter.timeframe === 'last-month') {
      const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      timeframeMatch = paymentDate >= firstDayOfLastMonth && paymentDate <= lastDayOfLastMonth;
    } else if (activeFilter.timeframe === 'current-year') {
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
      const lastDayOfYear = new Date(now.getFullYear(), 11, 31);
      timeframeMatch = paymentDate >= firstDayOfYear && paymentDate <= lastDayOfYear;
    }
    
    return projectMatch && statusMatch && typeMatch && timeframeMatch;
  });
  
  // Calculate totals
  const totals = {
    income: filteredPayments
      .filter(p => p.type === 'Invoice' && p.status !== 'Cancelled')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0),
    expenses: filteredPayments
      .filter(p => p.type === 'Expense' && p.status !== 'Cancelled')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0),
    pending: filteredPayments
      .filter(p => p.status === 'Pending' && p.type === 'Invoice')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
  };

  // Get project name for a given project ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Payments</h1>
        <button
          type="button"
          onClick={handleAddPayment}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          New Payment
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                <BanknotesIcon className="h-6 w-6 text-green-600 dark:text-green-200" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Income
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatCurrency(totals.income)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-md p-3">
                <ArrowDownTrayIcon className="h-6 w-6 text-red-600 dark:text-red-200 rotate-180" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Expenses
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatCurrency(totals.expenses)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-3">
                <DocumentTextIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-200" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatCurrency(totals.pending)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <select
          value={activeFilter.projectId}
          onChange={(e) => handleFilterChange('projectId', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
        
        <select
          value={activeFilter.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        
        <select
          value={activeFilter.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Types</option>
          <option value="Invoice">Invoice</option>
          <option value="Expense">Expense</option>
          <option value="Other">Other</option>
        </select>
        
        <select
          value={activeFilter.timeframe}
          onChange={(e) => handleFilterChange('timeframe', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Time</option>
          <option value="current-month">Current Month</option>
          <option value="last-month">Last Month</option>
          <option value="current-year">This Year</option>
        </select>
      </div>
      
      {/* Payment Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <PaymentForm
                payment={currentPayment}
                onSave={handleSavePayment}
                onCancel={() => setIsFormOpen(false)}
                projectId={currentPayment ? currentPayment.projectId : activeFilter.projectId !== 'all' ? activeFilter.projectId : undefined}
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
                    Delete Payment
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this payment? This action cannot be undone.
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
      
      {/* Payments Table */}
      {filteredPayments.length === 0 ? (
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No payments</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new payment record.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleAddPayment}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                          {getPaymentTypeIcon(payment.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.type}
                          </div>
                          {payment.invoiceNumber && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              #{payment.invoiceNumber}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                        {payment.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {payment.projectId ? getProjectName(payment.projectId) : '-'}
                      </div>
                      {payment.clientName && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.clientName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                      {payment.dueDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditPayment(payment)}
                          className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <PencilIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(payment.id)}
                          className="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <TrashIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments; 