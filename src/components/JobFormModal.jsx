import React, { useState, useEffect } from 'react';


const FormInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

const FormTextarea = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={id}
      {...props}
      rows={4}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
  </div>
);

const JobFormModal = ({ isOpen, onClose, onSave, editingJob }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingJob) {
      setFormData({
        ...editingJob,

        tags: editingJob.tags?.join(', ') || '',
        requirements: editingJob.requirements?.join(', ') || '',
      });
    } else {

      setFormData({
        title: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        status: 'active',
        tags: '',
        requirements: '',
        description: '',
      });
    }
  }, [editingJob, isOpen]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      requirements: formData.requirements.split(',').map(req => req.trim()).filter(Boolean),
   
      salaryMin: Number(formData.salaryMin) || 0,
      salaryMax: Number(formData.salaryMax) || 0,
    };

    const isEditing = !!editingJob;
    const url = isEditing ? `/api/jobs/${editingJob.id}` : '/api/jobs';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save job');
      }

      const savedJob = await response.json();
      onSave(savedJob); 
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!editingJob;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {isEditing ? 'Edit Job' : 'Create New Job'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Job Title"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Location"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Salary Min"
              id="salaryMin"
              name="salaryMin"
              type="number"
              value={formData.salaryMin}
              onChange={handleChange}
            />
            <FormInput
              label="Salary Max"
              id="salaryMax"
              name="salaryMax"
              type="number"
              value={formData.salaryMax}
              onChange={handleChange}
            />
          </div>
          <FormInput
            label="Tags (comma-separated)"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., React, Node.js, Remote"
          />
          <FormTextarea
            label="Description"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <FormTextarea
            label="Requirements (comma-separated)"
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="e.g., 3+ years React, BS in CS"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;