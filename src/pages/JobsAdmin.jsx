import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArchiveBoxIcon,
  ArrowUpOnSquareIcon,
  PencilIcon,
  EyeIcon,
  Bars3Icon,
  UserGroupIcon,
  ArrowLeftIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const formatCurrency = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const JobCard = React.forwardRef(({ job, onArchive, onNavigate, ...props }, ref) => {
  const { status, title, location, salaryMin, salaryMax, tags, candidateCount } = job;
  const isActive = status === 'active';
  const { attributes, listeners } = props;

  return (
    <div ref={ref} style={props.style} className="bg-white dark:bg-gray-800 shadow rounded-lg mb-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start p-4">
        <button 
          {...attributes} 
          {...listeners} 
          className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
          aria-label="Drag to reorder"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <div className="flex-grow ml-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              {title}
            </h3>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}
            >
              {status}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
            <span>{location}</span>
            {(salaryMin || salaryMax) && (
              <span>• {formatCurrency(salaryMin)} - {formatCurrency(salaryMax)}</span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-5 py-3 flex items-center justify-between">
        <Link
          to={`/candidates?jobId=${job.id}`}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          title="View candidates for this job"
        >
          <UserGroupIcon className="w-5 h-5" />
          <span>{candidateCount} Applicants</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(`/ajobs/${job.id}`)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            title="View public job page"
          >
            <EyeIcon className="w-5 h-5 inline-block mr-1" />
            View
          </button>
          <button
            onClick={() => onNavigate(`/admin/jobs/${job.id}/edit`)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            title="Edit job"
          >
            <PencilIcon className="w-5 h-5 inline-block mr-1" />
            Edit
          </button>
          <button
            onClick={() => onNavigate(`/assessments/${job.id}/build`)}
            className={`text-sm font-medium ${
              job.hasAssessment
                ? 'text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300'
                : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
            }`}
            title={job.hasAssessment ? 'Edit assessment' : 'Add assessment'}
          >
            {job.hasAssessment ? (
              <>
                <PencilSquareIcon className="w-5 h-5 inline-block mr-1" />
                <span>Edit Assessment</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5 inline-block mr-1" />
                <span>Add Assessment</span>
              </>
            )}
          </button>
          <button
            onClick={() => onArchive(job.id, isActive ? 'archived' : 'active')}
            className={`text-sm font-medium ${
              isActive
                ? 'text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300'
                : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
            }`}
            title={isActive ? 'Archive job' : 'Reactivate job'}
          >
            {isActive ? (
              <ArchiveBoxIcon className="w-5 h-5 inline-block mr-1" />
            ) : (
              <ArrowUpOnSquareIcon className="w-5 h-5 inline-block mr-1" />
            )}
            {isActive ? 'Archive' : 'Reactivate'}
          </button>
        </div>
      </div>
    </div>
  );
});

const SortableJobCard = ({ job, onArchive, onNavigate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <JobCard
      ref={setNodeRef}
      style={style}
      job={job}
      onArchive={onArchive}
      onNavigate={onNavigate}
      {...attributes}
      listeners={listeners}
    />
  );
};
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; 
  }

  return (
    <div className="mt-6 flex items-center justify-between px-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm text-gray-700 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};


const JobsAdmin = () => {
  const [jobs, setJobs] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm) {
        params.set('search', debouncedSearchTerm);
      }
      if (statusFilter) {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch jobs');
      }
      const data = await response.json();
      
      setJobs(data.jobs); 
      setTotalCount(data.totalCount);

    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, statusFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return jobs.slice(start, end);
  }, [jobs, currentPage, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const jobIds = useMemo(() => paginatedJobs.map((j) => j.id), [paginatedJobs]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleArchive = async (id, newStatus) => {
    setActionError('');
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update status');
      }

      const updatedJob = await response.json();

      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === id ? updatedJob : job))
      );
      
      if (statusFilter) {
        fetchJobs();
      }
      
    } catch (err) {
      setActionError(err.message);
    }
  };
  
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const originalJobs = [...jobs];
      
      const oldIndex = jobs.findIndex((j) => j.id === active.id);
      const newIndex = jobs.findIndex((j) => j.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return;
      }

      const newJobs = arrayMove(jobs, oldIndex, newIndex);
      setJobs(newJobs);
      
      const updates = newJobs.map((job, index) => ({
        id: job.id,
        order: index + 1,
      }));

      try {
        setActionError('');
        const response = await fetch('/api/jobs/reorder', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates }),
        });
        
        if (!response.ok) {
           const err = await response.json();
           throw new Error(err.error || "Server failed to save order");
        }
        
      } catch (err) {
        setActionError(`Failed to save new order: ${err.message}. Reverting.`);
        setJobs(originalJobs);
        setTimeout(() => setActionError(''), 5000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/" 
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            title="Back to Dashboard"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Jobs</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Create, manage, and reorder your job postings.
            </p>
          </div>
        </div>
        <Link
          to="/admin/jobs/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="w-5 h-5" />
          Create Job
        </Link>
      </div>

      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search jobs by title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="relative w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 rounded-lg flex items-center gap-3"
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>{successMessage}</span>
          </motion.div>
        )}
        {actionError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 rounded-lg flex items-center gap-3"
          >
            <XCircleIcon className="w-5 h-5" />
            <span>{actionError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        {isLoading ? (
          <div className="text-center py-10 text-gray-600 dark:text-gray-400">Loading jobs...</div>
        ) : fetchError ? (
          <div className="text-center py-10 text-red-600 dark:text-red-400">{fetchError}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-10 text-gray-600 dark:text-gray-400">
            No jobs found.
          </div>
        ) : (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
                <div>
                  {paginatedJobs.map((job) => (
                    <SortableJobCard
                      key={job.id}
                      job={job}
                      onArchive={handleArchive}
                      onNavigate={navigate}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default JobsAdmin;