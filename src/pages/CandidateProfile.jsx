import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";


const STAGES = ["applied", "screen", "interview", "offer", "rejected", "hired"];

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const CandidateProfile = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [noteError, setNoteError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/candidates/${id}`);
      if (!res.ok) throw new Error("Candidate not found");
      const data = await res.json();
      setCandidate(data);

      setNotes(data.notes || []); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);


  const handleStageChange = async (e) => {
    const newStage = e.target.value;
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!response.ok) throw new Error("Failed to update stage");
      const updatedCandidate = await response.json();
      setCandidate(updatedCandidate);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote) return;

    try {
      const response = await fetch(`/api/candidates/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote }),
      });
      if (!response.ok) throw new Error("Failed to save note");
      const savedNote = await response.json();

      setNotes([savedNote, ...notes]);
      setNewNote(""); 
      setNoteError("");
    } catch (err) {
      setNoteError(err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading profile...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        Error: {error}
      </p>
    );
  if (!candidate)
    return (
      <p className="text-center mt-10 text-lg">Candidate not found.</p>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
  
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {candidate.name}
          </h1>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <EnvelopeIcon className="w-5 h-5" /> {candidate.email}
          </p>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <BriefcaseIcon className="w-5 h-5" /> Applied for:{" "}
            <span className="font-medium">{candidate.jobTitle || "N/A"}</span>
          </p>
        </div>
        <Link
          to={-1} 
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </Link>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-8">
        
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Current Status
            </h2>
            <div className="flex items-center gap-4">
              <span
                className={`capitalize px-3 py-1 rounded-full text-sm font-medium ${
                  candidate.stage === "hired"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {candidate.stage}
              </span>
              <span className="text-gray-500">
                Since {formatDate(candidate.lastUpdated)}
              </span>
              <select
                value={candidate.stage}
                onChange={handleStageChange}
                className="ml-auto border-gray-300 rounded-md shadow-sm"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

       
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Application Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Applied Date
                </dt>
                <dd className="mt-1">{formatDate(candidate.appliedDate)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated
                </dt>
                <dd className="mt-1">{formatDate(candidate.lastUpdated)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1">{candidate.phone || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Education
                </dt>
                <dd className="mt-1">{candidate.education || "N/A"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Experience
                </dt>
                <dd className="mt-1 whitespace-pre-line">
                  {candidate.experience || "N/A"}
                </dd>
              </div>
            </div>
          </div>


          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notes</h2>

            <form onSubmit={handleAddNote} className="mb-6">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                placeholder="Add a note about this candidate... (use @ to mention)"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
              {noteError && (
                <p className="text-sm text-red-600 mt-1">{noteError}</p>
              )}
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Note
              </button>
            </form>
      
            <ul className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-gray-500">No notes yet.</p>
              ) : (
                notes.map((note) => (
                  <li key={note.id} className="border-b pb-4">
                    <p className="text-gray-800">{note.text}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDateTime(note.date)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Timeline
            </h2>
            <ul className="space-y-6">
            
              {(candidate.timeline || []) 
                .slice() 
                .reverse() 
                .map((item) => (
                  <li key={item.id} className="flex gap-4">
               
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.stage
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.stage ? (
                        <ClockIcon className="w-5 h-5" />
                      ) : (
                        <PencilIcon className="w-5 h-5" />
                      )}
                    </div>
            
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.message}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(item.date)}
                      </p>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;