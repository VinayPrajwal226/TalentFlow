
import React, { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';

const FormField = ({ question, control, errors, setValue }) => {
  const fieldName = question.id;
  const conditional = question.conditional;
  const sourceValue = useWatch({
    control,
    name: conditional?.source,
    disabled: !conditional?.enabled,
  });

  let isVisible = true;
  if (conditional?.enabled && conditional.source) {
    const { operator, value } = conditional;
    const targetValue = value || "";
    const actualValue = String(sourceValue || ""); 

    if (operator === 'eq') {
      isVisible = (actualValue.toLowerCase() === targetValue.toLowerCase());
    } else if (operator === 'neq') {
      isVisible = (actualValue.toLowerCase() !== targetValue.toLowerCase());
    }
  }

  useEffect(() => {
    if (!isVisible) {
      setValue(fieldName, undefined, { shouldValidate: false, shouldDirty: false });
    }
  }, [isVisible, setValue, fieldName]);

  const rules = {
    required: question.required ? 'This field is required' : false,
    min: question.type === 'numeric' && question.min ? { value: question.min, message: `Must be at least ${question.min}` } : undefined,
    max: question.type === 'numeric' && question.max ? { value: question.max, message: `Must be at most ${question.max}` } : undefined,
    maxLength: (question.type === 'short-text' || question.type === 'long-text') && question.maxLength ? {
        value: parseInt(question.maxLength, 10),
        message: `Must be at most ${question.maxLength} characters`
      } : undefined,
  };

  const renderField = () => {
    switch (question.type) {
      case 'short-text':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={rules}
            render={({ field }) => (
              <input type="text" {...field} className="w-full border-gray-300 rounded-md" />
            )}
          />
        );
      case 'long-text':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={rules}
            render={({ field }) => (
              <textarea {...field} rows={4} className="w-full border-gray-300 rounded-md" />
            )}
          />
        );
      case 'numeric':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={rules}
            render={({ field }) => (
              <input type="number" {...field} className="w-full border-gray-300 rounded-md" />
            )}
          />
        );
      case 'single-choice':
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={rules}
            render={({ field }) => (
              <div className="space-y-2">
                {(question.options || []).map((opt) => ( 
                  <label key={opt.id} className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      onChange={() => field.onChange(opt.text)}
                      checked={field.value === opt.text}
                      name={fieldName}
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            )}
          />
        );
      case 'multi-choice':
        return (
          <div className="space-y-2">
            {(question.options || []).map((opt) => ( 
              <Controller
                key={opt.id}
                name={`${fieldName}.${opt.id}`} 
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      onChange={(e) => field.onChange(e.target.checked)} 
                      checked={!!field.value} 
                    />
                    <span>{opt.text}</span>
                  </label>
                )}
              />
            ))}
          </div>
        );
      case 'file-upload':
        return (
          <div>
            <input type="file" className="w-full" disabled />
            <p className="text-sm text-gray-500">(File upload stub - not functional)</p>
          </div>
        );
      default:
        return <p>Unknown question type</p>;
    }
  };
  
  if (!isVisible) {
    return null;
  }

  return (
     <div className="mb-6 animate-fadeIn">
        <label className="block font-medium mb-2">
          {question.question}
          {question.required && <span className="text-red-500">*</span>}
        </label>
        {renderField()}
        {errors[fieldName] && (
          <p className="text-sm text-red-600 mt-1">{errors[fieldName].message}</p>
        )}
     </div>
  );
};


const AssessmentForm = ({ assessmentData, onSubmit, isPreview = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onFormSubmit = (data) => {
    console.log("Form Data:", data);
    if (onSubmit) { 
      onSubmit(data);
    }
  };

  return (
    <fieldset disabled={isPreview}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <h2 className="text-2xl font-semibold">{assessmentData.title}</h2>
        <p className="text-gray-600 mb-6">{assessmentData.description}</p>
        
        
      
        {(assessmentData.sections || []).map((section, secIndex) => (
        
          <div 
            key={section.id || secIndex} 
            className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50/50"
          >
         
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              {section.title}
            </h3>
            
            <div className="space-y-4">
          
              {(section.questions || []).map((q) => (
                <FormField
                  key={q.id}
                  question={q}
                  control={control}
                  errors={errors}
                  setValue={setValue} 
                />
              ))}
            </div>
          </div>
        ))}
 

        {!isPreview && (
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700"
          >
            Submit Assessment
          </button>
        )}
      </form>
    </fieldset>
  );
};

export default AssessmentForm;