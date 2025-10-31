import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm'; 

const JobCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateJob = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create job');
      }

      const savedJob = await response.json();
      

      navigate('/admin/jobs', { 
        state: { successMessage: `Job "${savedJob.title}" created successfully!` } 
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Job</h1>
        <JobForm 
          onSave={handleCreateJob} 
          isLoading={isLoading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default JobCreate;