import React, { useState } from "react";


const MENTION_SUGGESTIONS = [
  { id: 1, name: "John Smith", email: "john@company.com" },
  { id: 2, name: "Sarah Johnson", email: "sarah@company.com" },
  { id: 3, name: "Mike Wilson", email: "mike@company.com" },
  { id: 4, name: "Emily Davis", email: "emily@company.com" },
];

const AddNoteModal = ({ candidateName, candidateId, onClose, onSave }) => {
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const text = e.target.value;
    setNote(text);
 
    if (text.endsWith("@")) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name) => {
 
    setNote(note + name + " ");
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/candidates/${candidateId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note }),
      });
      if (!response.ok) throw new Error("Failed to save note");

      onSave(note); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Add Note for {candidateName}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={note}
              onChange={handleChange}
              rows={4}
              placeholder="Add a quick note... (use @ to mention team members)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
    
            {showSuggestions && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg -mt-2">
                <ul>
                  {MENTION_SUGGESTIONS.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => handleSuggestionClick(user.name)}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !note}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoteModal;