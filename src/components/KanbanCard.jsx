import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";


const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const KanbanCard = ({ candidate, index, onDelete }) => {
  return (
    <Draggable draggableId={candidate.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-lg shadow-md mb-3 ${
            snapshot.isDragging ? "ring-2 ring-blue-500" : ""
          }`}
        >
         
          <p className="font-semibold text-gray-900">{candidate.name}</p>
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
            {candidate.experience}
          </p>
          
      
          <div className="flex items-center gap-1 mt-3 border-t pt-2">
            <Link
              to={`/candidates/${candidate.id}`}
              title="View Profile"
              className="flex-1 flex justify-center items-center gap-1 p-1 text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded"
            >
              <EyeIcon className="w-4 h-4" /> View
            </Link>
            <Link
              to={`/candidates/${candidate.id}`}
              title="Edit Profile"
              className="flex-1 flex justify-center items-center gap-1 p-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
            >
              <PencilIcon className="w-4 h-4" /> Edit
            </Link>
            <button
              onClick={() => onDelete(candidate.id)}
              title="Delete Candidate"
              className="flex-1 flex justify-center items-center gap-1 p-1 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
            >
              <TrashIcon className="w-4 h-4" /> Delete
            </button>
          </div>

        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;