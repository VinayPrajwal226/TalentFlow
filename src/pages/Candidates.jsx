import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  EyeIcon,
  ChatBubbleBottomCenterTextIcon,
  TrashIcon,
  ArrowLeftIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BriefcaseIcon
} from "@heroicons/react/24/outline";
import AddNoteModal from "../components/AddNoteModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const STAGE_PROPS = {
  applied: { label: "Applied", icon: UserGroupIcon, color: "bg-blue-100 text-blue-700" },
  screen: { label: "Screen", icon: MagnifyingGlassIcon, color: "bg-purple-100 text-purple-700" },
  interview: { label: "Interview", icon: ClipboardDocumentListIcon, color: "bg-yellow-100 text-yellow-700" },
  offer: { label: "Offer", icon: BriefcaseIcon, color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", icon: XMarkIcon, color: "bg-red-100 text-red-700" },
  hired: { label: "Hired", icon: UserGroupIcon, color: "bg-teal-100 text-teal-700" },
};
const STAGES = Object.keys(STAGE_PROPS);

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [stageFilter, setStageFilter] = useState(searchParams.get("stage") || "");
  const jobId = searchParams.get("jobId");

  
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (jobId) params.set("jobId", jobId);
      if (stageFilter) params.set("stage", stageFilter);
      if (searchTerm) params.set("search", searchTerm);
      setSearchParams(params, { replace: true });

      try {
        const response = await fetch(`/api/candidates?${params.toString()}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCandidates(data.candidates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [jobId, stageFilter, searchTerm, setSearchParams]);


  const groupByStage = (list) => {
    const map = {};
    STAGES.forEach((s) => (map[s] = []));
    list.forEach((c) => {
      const s = c.stage && STAGES.includes(c.stage) ? c.stage : "applied";
      map[s].push(c);
    });
    return map;
  };


  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    const fromStage = source.droppableId;
    const toStage = destination.droppableId;
    setCandidates((prev) => {
      const grouped = groupByStage(prev);
      const movingList = Array.from(grouped[fromStage]);
      const [moved] = movingList.splice(source.index, 1);
      const targetList = Array.from(grouped[toStage]);
      targetList.splice(destination.index, 0, moved);
      const reconstructed = STAGES.reduce((acc, stage) => {
        if (stage === fromStage) acc.push(...movingList);
        else if (stage === toStage) acc.push(...targetList);
        else acc.push(...grouped[stage]);
        return acc;
      }, []);
      return reconstructed;
    });
    try {
      const response = await fetch(`/api/candidates/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: toStage }),
      });
      if (!response.ok) throw new Error("Failed to update stage on server");
      const updated = await response.json();
      setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err) {
      setError(err.message);
      try {
        const resp = await fetch(`/api/candidates`);
        if (resp.ok) {
          const data = await resp.json();
          setCandidates(data.candidates);
        }
      } catch (e) { }
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStageFilter("");
  };

  const handleDelete = async (candidateId) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
    } catch (err) {
      setError(err.message);
    }
  };

  const openNoteModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsNoteModalOpen(true);
  };
  const handleSaveNote = (note) => {
    setIsNoteModalOpen(false);
    setSelectedCandidate(null);
  };

  const grouped = groupByStage(candidates);

  return (
    <>
      
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded hover:bg-indigo-100 border border-transparent"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-semibold">All Candidates</h1>
      </div>


      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Name/Email</label>
            <div className="relative mt-1">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., John Doe"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-gray-700">Filter by Stage</label>
            <div className="relative mt-1">
              <select
                id="stage"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              >
                <option value="">All Stages</option>
                {STAGES.map((stage) => (
                  <option key={stage} value={stage}>{STAGE_PROPS[stage].label}</option>
                ))}
              </select>
              <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={handleClearFilters} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300">
              <XMarkIcon className="w-5 h-5" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4">
        {loading && <p className="text-center mt-10 text-lg">Loading candidates...</p>}
        {error && <p className="text-center mt-10 text-red-500">{error}</p>}
        {!loading && candidates.length === 0 && <p className="text-gray-600 text-center">No candidates found.</p>}

        {!loading && candidates.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-6">
              {STAGES.map((stage) => {
  const Icon = STAGE_PROPS[stage].icon;  

  return(
                <Droppable droppableId={stage} key={stage}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-w-[270px] max-w-xs bg-gray-50 rounded-xl shadow-lg 
                        flex flex-col border border-gray-200 
                        ${snapshot.isDraggingOver ? "ring-2 ring-indigo-300 bg-white" : ""}`}
                      style={{ transition: "background .2s" }}
                    >
                      <div className={`flex items-center justify-between px-4 py-2 rounded-t-xl font-bold ${STAGE_PROPS[stage].color}`}>
                     

                      <span className="flex items-center gap-1">
                        <Icon className="w-5 h-5 mr-1" />
                        <span className="capitalize">{STAGE_PROPS[stage].label}</span>
                      </span>

                        <span className="text-sm px-2 py-1 rounded-full bg-white text-gray-700 border ml-2">{grouped[stage]?.length || 0}</span>
                      </div>
                      <div className="flex-1 space-y-4 px-4 py-3">
                        {grouped[stage] && grouped[stage].length === 0 && (
                          <div className="text-xs text-gray-400 italic mt-10">No candidates</div>
                        )}

                        {grouped[stage].map((candidate, index) => (
                          <Draggable draggableId={String(candidate.id)} index={index} key={candidate.id}>
                            {(dragProvided, dragSnapshot) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className={`p-3 bg-white shadow rounded-lg border
                                  hover:shadow-xl transition-shadow duration-150
                                  ${dragSnapshot.isDragging ? "ring-2 ring-indigo-200 border-indigo-200" : "border-gray-200"}`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <Link to={`/candidates/${candidate.id}`} className="font-medium text-indigo-600 hover:underline text-lg">
                                      {candidate.name}
                                    </Link>
                                    <p className="text-xs text-gray-600">{candidate.email}</p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <Link to={`/candidates/${candidate.id}`} title="View Profile"
                                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full">
                                      <EyeIcon className="w-4 h-4" />
                                    </Link>
                                    <button onClick={() => openNoteModal(candidate)} title="Add Quick Note"
                                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full">
                                      <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(candidate.id)} title="Delete Candidate"
                                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full">
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-2 flex justify-start">
                                  <span className={`text-xs px-2 py-0.5 rounded-full border 
                                    ${stage === "hired" ? "bg-teal-100 text-teal-700" : stage === "rejected"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-gray-100 text-gray-800"} border-gray-200`}>
                                    {STAGE_PROPS[stage].label}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              )})}
            </div>
          </DragDropContext>
        )}
      </div>

     
      {isNoteModalOpen && selectedCandidate && (
        <AddNoteModal
          candidateName={selectedCandidate.name}
          candidateId={selectedCandidate.id}
          onClose={() => setIsNoteModalOpen(false)}
          onSave={handleSaveNote}
        />
      )}
    </>
  );
};

export default Candidates;
