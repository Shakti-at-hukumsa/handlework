import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';

const PaymentForm = ({ payment, projectId, onSave, onCancel }) => {
  const { data } = useData();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    projectId: projectId || '',
    date: '',
    dueDate: '',
    status: 'Pending',
    type: 'Invoice',
    invoiceNumber: '',
    clientName: '',
    notes: ''
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        amount: payment.amount ? payment.amount.toString() : '',
        description: payment.description || '',
        projectId: payment.projectId || projectId || '',
        date: payment.date || '',
        dueDate: payment.dueDate || '',
        status: payment.status || 'Pending',
        type: payment.type || 'Invoice',
        invoiceNumber: payment.invoiceNumber || '',
        clientName: payment.clientName || '',
        notes: payment.notes || ''
      });
    } else if (projectId) {
      const project = data.projects.find(p => p.id === projectId);
      setFormData(prev => ({
        ...prev,
        projectId,
        // Auto-fill client name if available in the selected project
        clientName: project?.client || ''
      }));
    }
  }, [payment, projectId, data.projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    const project = data.projects.find(p => p.id === projectId);
    
    setFormData(prev => ({
      ...prev,
      projectId,
      // Auto-fill client name if available in the selected project
      clientName: project?.client || prev.clientName
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.amount || !formData.description) {
      alert('Amount and description are required fields.');
      return;
    }

    // Validate amount is a valid number
    if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount greater than zero.');
      return;
    }

    // Format data before saving
    const formattedData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };
    
    onSave(formattedData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {payment ? 'Edit Payment' : 'New Payment'}
        </h2>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          onClick={onCancel}
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                className="pl-7 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            >
              <option value="Invoice">Invoice</option>
              <option value="Payment">Payment</option>
              <option value="Expense">Expense</option>
              <option value="Refund">Refund</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <input
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            required
          />
        </div>
        
        {!projectId && (
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project
            </label>
            <select
              name="projectId"
              id="projectId"
              value={formData.projectId}
              onChange={handleProjectChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            >
              <option value="">Not project-specific</option>
              {data.projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Invoice Number
            </label>
            <input
              type="text"
              name="invoiceNumber"
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            id="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm"
          />
        </div>
        
        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {payment ? 'Update Payment' : 'Create Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 