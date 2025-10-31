import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PencilSquareIcon, PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Assessments() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobsOverview = async () => {
      setLoading(true);
      try {
     
        const response = await fetch("/api/assessments/overview");
        if (!response.ok) throw new Error("Failed to fetch jobs overview");
        const data = await response.json();
        setJobs(data.jobsOverview || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobsOverview();
  }, []);

  const filtered = jobs.filter(
    job =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||

      (job.assessmentTitle || "").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageJobs = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
  
      <button onClick={() => navigate('/')} className="flex items-center mb-6 text-indigo-600 hover:text-indigo-800">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Manage Assessments</h1>
      </div>
      <input
        type="text"
        placeholder="Search job or assessment…"
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        className="mb-6 w-full border rounded px-3 py-2"
      />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : pageJobs.length === 0 ? (
        <p className="text-center text-gray-500">No jobs found.</p>
      ) : (
        <div className="space-y-4">
          {pageJobs.map((job) => (
            <div key={job.id} className="flex items-center bg-white rounded-lg shadow px-5 py-4 justify-between">
              <div>
                <h2 className="font-bold">{job.title}</h2>
          
                {job.hasAssessment ? (
                  <p className="text-xs text-green-600">Assessment: {job.assessmentTitle || "Created"}</p>
                ) : (
                  <p className="text-xs text-gray-400">No assessment yet</p>
                )}
              </div>
              
   
              <Link
                to={`/assessments/${job.id}/build`} 
           
                className={`flex items-center px-4 py-2 rounded text-white gap-2 ${job.hasAssessment ? "bg-indigo-600 hover:bg-indigo-700" : "bg-green-500 hover:bg-green-600"}`}
              >
         
                {job.hasAssessment ? (
                  <>
                    <PencilSquareIcon className="w-5 h-5" />
                    Edit Assessment
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5" />
                    Build Assessment
                  </>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded disabled:opacity-60 bg-gray-200">
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded disabled:opacity-60 bg-gray-200">
          Next
        </button>
      </div>
    </div>
  );
}