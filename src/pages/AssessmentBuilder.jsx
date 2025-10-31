import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  XMarkIcon,
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import AssessmentForm from "../components/AssessmentForm";

const QUESTION_TYPES = [
  { id: "short-text", name: "Short Text" },
  { id: "long-text", name: "Long Text" },
  { id: "single-choice", name: "Single Choice" },
  { id: "multi-choice", name: "Multi Choice" },
  { id: "numeric", name: "Numeric" },
  { id: "file-upload", name: "File Upload" },
];
const QuestionEditor = ({ question, index, allQuestions, onUpdate, onRemove, onMove }) => {
  const [localQuestion, setLocalQuestion] = useState(question);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("conditional.")) {
      const field = name.split(".")[1];
      setLocalQuestion(prev => ({
        ...prev,
        conditional: {
          ...prev.conditional,
          [field]: field === 'enabled' ? checked : value
        }
      }));
      return; 
    }
    setLocalQuestion((prev) => {
      const newState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      
      if (name === 'type' && (value === 'single-choice' || value === 'multi-choice')) {
        if (!newState.options || newState.options.length === 0) {
          newState.options = [{ id: `opt-${Date.now()}`, text: "" }];
        }
      }
      return newState;
    });
  };

  const handleOptionChange = (optIndex, value) => {
    const currentOptions = localQuestion.options || [];
    const newOptions = [...currentOptions];
    newOptions[optIndex] = { ...newOptions[optIndex], text: value };
    setLocalQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    const newOptions = [
      ...(localQuestion.options || []),
      { id: `opt-${Date.now()}`, text: "" },
    ];
    setLocalQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  const removeOption = (optIndex) => {
    const newOptions = (localQuestion.options || []).filter((_, i) => i !== optIndex);
    setLocalQuestion((prev) => ({ ...prev, options: newOptions }));
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      onUpdate(localQuestion);
    }, 500);
    return () => clearTimeout(handler);
  }, [localQuestion, onUpdate]);


  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <select
          name="type"
          value={localQuestion.type}
          onChange={handleChange}
          className="font-semibold border-gray-300 rounded-md"
        >
          {QUESTION_TYPES.map((qt) => (
            <option key={qt.id} value={qt.id}>
              {qt.name}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          <button onClick={() => onMove(-1)} className="p-2 hover:bg-gray-100 rounded">
            <ChevronUpIcon className="w-5 h-5" />
          </button>
          <button onClick={() => onMove(1)} className="p-2 hover:bg-gray-100 rounded">
            <ChevronDownIcon className="w-5 h-5" />
          </button>
          <button onClick={onRemove} className="p-2 text-red-600 hover:bg-red-50 rounded">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <textarea
        name="question"
        value={localQuestion.question}
        onChange={handleChange}
        placeholder="Type your question here..."
        className="w-full p-2 border border-gray-300 rounded-md"
        rows={2}
      />
      
      {(localQuestion.type === "single-choice" ||
        localQuestion.type === "multi-choice") && (
        <div className="mt-4 space-y-2">
          {(localQuestion.options || []).map((opt, i) => ( 
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={opt.text}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-grow border-gray-300 rounded-md"
              />
              <button onClick={() => removeOption(i)} className="text-gray-500 hover:text-red-600">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={addOption} className="text-sm text-blue-600 hover:underline">
            + Add option
          </button>
        </div>
      )}
      <div className="mt-4 border-t pt-4 space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="conditional.enabled"
            checked={!!localQuestion.conditional?.enabled}
            onChange={handleChange}
            className="rounded"
          />
          <span className="text-sm font-medium">Enable Conditional Logic</span>
        </label>

        {localQuestion.conditional?.enabled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-md border">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Show if question...</label>
              <select
                name="conditional.source"
                value={localQuestion.conditional?.source || ''}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md text-sm"
              >
                <option value="">Select question...</option>
                {allQuestions
                  .filter((q, i) => i !== index && 
                    (q.type === 'single-choice' || q.type === 'short-text' || q.type === 'numeric')
                  )
                  .map((q) => (
                    <option key={q.id} value={q.id}>
                      {`(${q.type}) ${q.question.substring(0, 20) || q.id}...`}
                    </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">...is...</label>
              <select
                name="conditional.operator"
                value={localQuestion.conditional?.operator || 'eq'}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-md text-sm"
              >
                <option value="eq">Equal to</option>
                <option value="neq">Not equal to</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">...this value...</label>
              <input
                type="text"
                name="conditional.value"
                value={localQuestion.conditional?.value || ''}
                onChange={handleChange}
                placeholder="e.g., Yes"
                className="w-full border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 border-t pt-4 flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="required"
            checked={!!localQuestion.required}
            onChange={handleChange}
            className="rounded"
          />
          <span className="text-sm">Required</span>
        </label>
        
        {(localQuestion.type === "short-text" || localQuestion.type === "long-text") && (
          <input
            type="number"
            name="maxLength"
            value={localQuestion.maxLength || ''}
            onChange={handleChange}
            placeholder="Max Length"
            className="w-28 border-gray-300 rounded-md text-sm"
            min="1"
          />
        )}
        
        {localQuestion.type === "numeric" && (
          <>
             <input type="number" name="min" value={localQuestion.min || ''} onChange={handleChange} placeholder="Min" className="w-20 border-gray-300 rounded-md text-sm"/>
             <input type="number" name="max" value={localQuestion.max || ''} onChange={handleChange} placeholder="Max" className="w-20 border-gray-300 rounded-md text-sm"/>
          </>
        )}
      </div>
    </div>
  );
};

const AssessmentBuilder = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/assessments/${jobId}`);
        if (!res.ok) throw new Error("Failed to load assessment");
        const data = await res.json();
        
        let sections = data.data.sections || [];
        if (sections.length === 0 && data.data.questions?.length > 0) {
          sections = [
            { 
              id: `sec-${Date.now()}`, 
              title: "Section 1", 
              questions: data.data.questions 
            }
          ];
        }
        
        setAssessment({
            ...data,
            data: {
                title: data.data.title || "",
                description: data.data.description || "",
                sections: sections,
            }
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [jobId]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/assessments/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessment.data),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Assessment saved!");
      navigate("/assessments");
    } catch (err){
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setAssessment(prev => ({
        ...prev,
        data: {
            ...prev.data,
            [field]: value
        }
    }));
  };

  
  const addSection = () => {
    const newSection = {
      id: `sec-${Date.now()}`,
      title: `New Section ${ (assessment.data.sections || []).length + 1 }`,
      questions: [],
    };
    const currentSections = assessment?.data?.sections || [];
    updateField("sections", [...currentSections, newSection]);
  };
  
  const updateSection = (sectionIndex, field, value) => {
    const currentSections = [...(assessment.data.sections || [])];
    currentSections[sectionIndex] = {
      ...currentSections[sectionIndex],
      [field]: value,
    };
    updateField("sections", currentSections);
  };
  
  const removeSection = (sectionIndex) => {
    if (!window.confirm("Are you sure you want to delete this section and all its questions?")) {
      return;
    }
    const currentSections = (assessment.data.sections || []).filter((_, i) => i !== sectionIndex);
    updateField("sections", currentSections);
  };


  const addQuestion = (sectionIndex) => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      question: "",
      type: "short-text",
      required: false,
      options: []
    };
    
    const currentSections = [...(assessment.data.sections || [])];
    const targetSection = currentSections[sectionIndex];
    
    if (targetSection) {
      const updatedQuestions = [...(targetSection.questions || []), newQuestion];
      targetSection.questions = updatedQuestions;
      updateField("sections", currentSections);
    }
  };

  const updateQuestion = (sectionIndex, questionIndex, updatedQuestion) => {
    const currentSections = [...(assessment.data.sections || [])];
    const targetSection = currentSections[sectionIndex];
    
    if (targetSection) {
      const newQuestions = [...(targetSection.questions || [])];
      newQuestions[questionIndex] = updatedQuestion;
      targetSection.questions = newQuestions;
      updateField("sections", currentSections);
    }
  };

  const removeQuestion = (sectionIndex, questionIndex) => {
    const currentSections = [...(assessment.data.sections || [])];
    const targetSection = currentSections[sectionIndex];
    
    if (targetSection) {
      const newQuestions = (targetSection.questions || []).filter((_, i) => i !== questionIndex);
      targetSection.questions = newQuestions;
      updateField("sections", currentSections);
    }
  };
  
  const moveQuestion = (sectionIndex, questionIndex, direction) => {
     const currentSections = [...(assessment.data.sections || [])];
     const targetSection = currentSections[sectionIndex];
     
     if (!targetSection) return;
     
     const currentQuestions = targetSection.questions || [];
     if (currentQuestions.length === 0) return;

     const newIndex = questionIndex + direction;
     if (newIndex < 0 || newIndex >= currentQuestions.length) return;
     
     const newQuestions = [...currentQuestions];
     const [moved] = newQuestions.splice(questionIndex, 1);
     newQuestions.splice(newIndex, 0, moved);
     targetSection.questions = newQuestions;
     updateField("sections", currentSections);
  };


  if (loading) return <p className="text-center mt-10">Loading Builder...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!assessment) return <p className="text-center mt-10">Assessment data not found.</p>;


  const allQuestions = (assessment.data.sections || []).flatMap(s => s.questions || []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link
        to="/assessments"
        className="flex items-center gap-2 text-indigo-600 mb-4 hover:underline"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Assessments List
      </Link>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Assessment Builder</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {showPreview ? <PencilIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            {showPreview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save Assessment"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`space-y-6 ${showPreview ? 'hidden lg:block' : 'block'} ${showPreview ? 'lg:col-start-1' : ''}`}>
          <div className="bg-white p-4 rounded-lg shadow">
            <label htmlFor="assessment-title" className="block text-sm font-medium text-gray-700">Assessment Title</label>
            <input
              id="assessment-title"
              type="text"
              value={assessment.data.title || ''}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 w-full text-xl font-medium border-gray-300 rounded-md"
            />
             <label htmlFor="assessment-desc" className="mt-2 block text-sm font-medium text-gray-700">Description</label>
             <textarea
              id="assessment-desc"
              value={assessment.data.description || ''}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-1 w-full border-gray-300 rounded-md"
              rows={2}
            />
          </div>
          {(assessment.data.sections || []).map((section, secIndex) => (
            <div key={section.id || secIndex} className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(secIndex, "title", e.target.value)}
                  placeholder="Section Title"
                  className="text-lg font-semibold border-gray-300 rounded-md flex-grow"
                />
                <button
                  onClick={() => removeSection(secIndex)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {(section.questions || []).map((q, qIndex) => (
                  <QuestionEditor
                    key={q.id || qIndex}
                    question={q}
                    index={qIndex} 
                    allQuestions={allQuestions} 
                    onUpdate={(updated) => updateQuestion(secIndex, qIndex, updated)}
                    onRemove={() => removeQuestion(secIndex, qIndex)}
                    onMove={(dir) => moveQuestion(secIndex, qIndex, dir)}
                  />
                ))}
              </div>
              
              <button
                onClick={() => addQuestion(secIndex)}
                className="w-full flex justify-center items-center gap-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-white transition-colors mt-4"
              >
                <PlusIcon className="w-5 h-5" />
                Add Question to Section
              </button>
            </div>
          ))}
          
          <button
            onClick={addSection}
            className="w-full flex justify-center items-center gap-2 py-3 border-2 border-dashed border-blue-400 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <DocumentPlusIcon className="w-6 h-6" />
            Add New Section
          </button>
        </div>
        <div className={`lg:col-start-2 ${!showPreview ? 'hidden lg:block' : 'block'}`}>
           <h2 className="text-xl font-semibold mb-4 sticky top-4 bg-gray-50 py-2">Live Preview</h2>
           <div className="bg-white p-6 rounded-lg shadow-xl border sticky top-20">
             {assessment.data ? (
                 <AssessmentForm 
                    assessmentData={assessment.data}
                    isPreview={true} 
                 />
             ) : (
                 <p>Preview loading...</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentBuilder;