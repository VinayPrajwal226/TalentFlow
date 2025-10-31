import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "../components/KanbanColumn";


const reorderCandidates = (candidates, dragResult) => {
  const { source, destination } = dragResult;
  const [movedCandidate] = candidates.filter(
    (c) => c.id === dragResult.draggableId
  );
  const updatedCandidate = { ...movedCandidate, stage: destination.droppableId };
  const newCandidates = candidates.map((c) =>
    c.id === updatedCandidate.id ? updatedCandidate : c
  );
  return newCandidates;
};

const STAGES = ["applied", "screen", "interview", "offer", "rejected", "hired"];

const CandidateKanban = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchAllCandidates = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/candidates"); 
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCandidates(data.candidates || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllCandidates();
  }, []);


  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newCandidates = reorderCandidates(candidates, result);
    setCandidates(newCandidates);
    updateCandidateStage(draggableId, destination.droppableId);
  };


  const updateCandidateStage = async (candidateId, newStage) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!response.ok) {
        throw new Error("Failed to update stage");
      }
    } catch (err) {
      console.error("Failed to save stage change:", err);
      setError("Failed to save a change. Please refresh.");
    }
  };

  const handleDelete = async (candidateId) => {
    if (
      !window.confirm("Are you sure you want to delete this candidate?")
    ) {
      return;
    }
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");

      setCandidates(candidates.filter((c) => c.id !== candidateId));
    } catch (err) {
      setError(err.message);
    }
  };



  const columns = STAGES.reduce((acc, stage) => {
    acc[stage] = candidates.filter((c) => c.stage === stage);
    return acc;
  }, {});

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading candidates...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
    
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Candidates</h1>
          <p className="text-gray-600">Manage candidate applications</p>
        </div>
        <div className="text-lg text-gray-700">
          Total: <span className="font-bold text-indigo-600">{candidates.length}</span> candidates
        </div>
      </div>


      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              candidates={columns[stage]}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CandidateKanban;