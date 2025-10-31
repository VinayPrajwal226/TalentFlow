import React from "react";
import { Link } from "react-router-dom";
import { EyeIcon, ChatBubbleBottomCenterTextIcon, TrashIcon } from "@heroicons/react/24/outline";


const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const CandidateListCard = ({ candidate, onAddNote, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between">

      <div>
        <p className="font-semibold text-indigo-700">{candidate.name}</p>
        <p className="text-sm text-gray-600 truncate mb-2">{candidate.email}</p>
        
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">
            {candidate.jobTitle || "Unknown Job"}
          </span>
          <br />
          Applied: {formatDate(candidate.appliedDate)}
        </p>

   
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {candidate.skills.slice(0, 3).map((skill, i) => ( 
              <span
                key={i}
                className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs"
              >
                {skill}
              </span>
            ))}
            {candidate.skills.length > 3 && (
               <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                +{candidate.skills.length - 3}
              </span>
            )}
          </div>
        )}

        <p className="text-sm text-gray-500 mt-2 truncate">
          {candidate.experience || "No experience listed."}
        </p>
      </div>
      

      <div className="flex items-center gap-1 mt-3 border-t pt-2">
        <Link
          to={`/candidates/${candidate.id}`}
          title="View Profile"
          className="flex-1 flex justify-center items-center gap-1 p-1 text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded"
        >
          <EyeIcon className="w-4 h-4" /> View
        </Link>
        <button
          onClick={() => onAddNote(candidate)}
          title="Add Quick Note"
          className="flex-1 flex justify-center items-center gap-1 p-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
        >
          <ChatBubbleBottomCenterTextIcon className="w-4 h-4" /> Note
        </button>
        <button
          onClick={() => onDelete(candidate.id)}
          title="Delete Candidate"
          className="flex-1 flex justify-center items-center gap-1 p-1 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
        >
          <TrashIcon className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
};

export default CandidateListCard;