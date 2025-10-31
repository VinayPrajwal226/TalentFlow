import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JobForm from '../components/JobForm'; 
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const JobEdit = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [jobData, setJobData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [saveError, setSaveError] = useState('');


  useEffect(() => {
    const fetchJob = async () => {
      setIsFetching(true);
      setFetchError('');
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || `Failed to fetch job (ID: ${id})`);
        }
        const data = await response.json();
        setJobData(data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchJob();
  }, [id]);


  const handleUpdateJob = async (formData) => {
    setIsSaving(true);
    setSaveError('');

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update job');
      }

      const savedJob = await response.json();
      

      navigate('/admin/jobs', { 
        state: { successMessage: `Job "${savedJob.title}" updated successfully!` } 
      });

    } catch (err) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return <div className="max-w-3xl mx-auto px-4 py-10 text-center">Loading job data...</div>;
  }

  if (fetchError) {
    return <div className="max-w-3xl mx-auto px-4 py-10 text-center text-red-600">Error: {fetchError}</div>;
  }

  if (!jobData) {
    return <div className="max-w-3xl mx-auto px-4 py-10 text-center">Job not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
           <button 
             onClick={() => navigate('/admin/jobs')} 
             className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" 
             title="Back to Manage Jobs"
           >
             <ArrowLeftIcon className="w-6 h-6" />
           </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Job
          </h1>
        </div>
        
        <JobForm 
          onSave={handleUpdateJob} 
          isLoading={isSaving} 
          error={saveError}
          initialData={jobData} 
        />
      </div>
    </div>
  );
};

export default JobEdit;