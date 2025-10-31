import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      {pages.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md ${
              currentPage === page
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-4 py-2 text-gray-500">
            {page}
          </span>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(value);
};


const PAGE_SIZE = 6;

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
       
        const response = await fetch(
          `/api/jobs?status=active&page=${currentPage}&pageSize=${PAGE_SIZE}`
        );


        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();


        setJobs(data.jobs);
        setTotalJobs(data.totalCount);
        setTotalPages(Math.ceil(data.totalCount / PAGE_SIZE));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [currentPage]);

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading jobs...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Available Jobs
      </h1>
      {jobs.length === 0 ? (
        <p className="text-gray-600 text-center">No active jobs found.</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <Link
                to={`/jobs/${job.id}`}
                key={job.id}
                className="border rounded-xl p-5 shadow-sm hover:shadow-lg transition duration-200 bg-white block"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-indigo-700">
                    {job.title}
                  </h2>
                </div>

                <div className="text-gray-600 mt-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-5 h-5" />
                    <span>
                      {formatCurrency(job.salaryMin)} -{" "}
                      {formatCurrency(job.salaryMax)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{job.location}</span>
                  </div>
                  {job.isRemote && (
                    <div className="flex items-center gap-2">
                      <BuildingOfficeIcon className="w-5 h-5" />
                      <span>Remote</span>
                    </div>
                  )}
                </div>

                {job.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;