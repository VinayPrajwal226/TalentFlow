import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import KanbanCard from "./KanbanCard";


const STAGE_COLORS = {
 
  applied: "bg-blue-100 text-blue-800",
  screen: "bg-yellow-100 text-yellow-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  hired: "bg-emerald-100 text-emerald-800",
};

const KanbanColumn = ({ stage, candidates, onDelete }) => { 
  return (
    <div className="bg-gray-50 rounded-lg shadow-sm">
  
      <div
        className={`p-3 rounded-t-lg flex justify-between items-center ${
          STAGE_COLORS[stage] || "bg-gray-100"
        }`}
      >
        <h2 className="text-lg font-medium capitalize">{stage}</h2>
        <span className="font-bold text-sm">{candidates.length}</span>
      </div>

     
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-3 min-h-[400px] transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50" : "bg-transparent"
            }`}
          >
            {candidates.map((candidate, index) => (
              <KanbanCard
                key={candidate.id}
                candidate={candidate}
                index={index}
                onDelete={onDelete} 
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;