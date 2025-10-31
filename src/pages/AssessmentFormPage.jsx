import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import AssessmentForm from '../components/AssessmentForm'; 

const SubmitSuccess = () => (
  <div className="bg-white p-8 rounded-lg shadow-xl text-center">
    <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto" />
    <h2 className="mt-4 text-2xl font-semibold text-gray-900">
      Assessment Submitted!
    </h2>
    <p className="mt-2 text-gray-600">
      Thank you. Your responses have been recorded.
    </p>
    <Link
      to="/jobs"
      className="mt-6 inline-block px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-all"
    >
      Back to All Jobs
    </Link>
  </div>
);

const AssessmentFormPage = () => {
  const { jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);


  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/assessments/${jobId}`);
        if (!res.ok) throw new Error("Failed to load assessment");
        const data = await res.json();
        setAssessment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [jobId]);


  const handleFormSubmit = async (formData) => {
    setError(null);
    try {
      const response = await fetch(`/api/assessments/${jobId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });

      if (!response.ok) throw new Error("Failed to submit");
      
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError("An error occurred while submitting. Please try again.");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading assessment...</p>;
  if (error) 
    return <p className="text-center mt-10 text-red-500">{error}</p>;


  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {isSubmitted ? (
        <SubmitSuccess />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-xl border">
          <AssessmentForm
            assessmentData={assessment.data}
            onSubmit={handleFormSubmit}
            isPreview={false} 
          />
        </div>
      )}
    </div>
  );
};

export default AssessmentFormPage;