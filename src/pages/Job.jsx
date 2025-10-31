import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  CurrencyDollarIcon, 
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

import ApplicationForm from '../components/ApplicationForm';

const formatCurrency = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const ApplicationSuccess = () => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center shadow-sm">
    <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto" />
    <h2 className="mt-4 text-2xl font-semibold text-gray-900">
      Application Submitted!
    </h2>
    <p className="mt-2 text-gray-600">
      Thank you for applying. We have received your application and will
      be in touch soon.
    </p>
    <Link
      to="/jobs"
      className="mt-6 inline-block px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-all"
    >
      Back to All Jobs
    </Link>
  </div>
);


const Job = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const [isSubmitted, setIsSubmitted] = useState(false);
  

  const [showForm, setShowForm] = useState(false);

  const applyRef = useRef(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setJob(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    setShowForm(true); 
    
    setTimeout(() => {
      applyRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); 
  };



  const handleApplicationSuccess = () => {
    setIsSubmitted(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading job details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!job) return <p className="text-center mt-10 text-lg">Job not found.</p>;

 
  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <ApplicationSuccess />
      </div>
    );
  }


  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-4">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to All Jobs
        </Link>
      </div>
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          
     
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 mt-3">
            {job.isRemote && (
              <div className="flex items-center gap-1.5">
                <BuildingOfficeIcon className="w-5 h-5" />
                <span>Remote</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="w-5 h-5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CurrencyDollarIcon className="w-5 h-5" />
              <span>{formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}</span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <button
            onClick={handleApplyClick}
            className="mt-6 w-full px-6 py-3 bg-teal-600 text-white rounded-lg text-lg font-medium hover:bg-teal-700 transition-all shadow-md"
          >
            Apply Now
          </button>
          

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Job Description</h2>
            <p className="mt-3 text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Requirements</h2>
            <ul className="mt-3 list-disc list-inside text-gray-600 space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
          
          
          {showForm && (
            <div className="mt-10 pt-6 border-t" ref={applyRef}>
              <ApplicationForm 
                jobTitle={job.title}
                jobId={job.id}
                onApplicationSuccess={handleApplicationSuccess}
              />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Job;