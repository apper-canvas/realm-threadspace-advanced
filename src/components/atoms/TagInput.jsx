import React, { useState, useRef } from 'react';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const TagInput = ({ 
  label, 
  value = [], 
  onChange, 
  error,
  placeholder = "Add tags...",
  maxTags = 10,
  maxLength = 30
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    
    if (!trimmedTag) return;
    
    if (trimmedTag.length > maxLength) {
      return;
    }
    
    if (value.includes(trimmedTag)) {
      return;
    }
    
    if (value.length >= maxTags) {
      return;
    }
    
    onChange([...value, trimmedTag]);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div 
        className={cn(
          "min-h-[44px] px-3 py-2 border rounded-lg bg-white transition-colors duration-200",
          "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
          error ? "border-error" : "border-gray-300 hover:border-gray-400"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors duration-200"
              >
                <ApperIcon name="X" size={14} />
              </button>
            </span>
          ))}
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            placeholder={value.length === 0 ? placeholder : ''}
            disabled={value.length >= maxTags}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
          />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      
      <p className="text-xs text-gray-500">
        {value.length}/{maxTags} tags • Press Enter or comma to add • Max {maxLength} characters per tag
      </p>
    </div>
  );
};

export default TagInput;