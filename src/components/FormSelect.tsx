'use client';

import { forwardRef, useState } from 'react';
import { FieldError } from 'react-hook-form';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: FieldError;
  helpText?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  successMessage?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ 
    label, 
    error, 
    helpText, 
    required = false, 
    options,
    placeholder = 'Select an option',
    validateOnBlur = true,
    validateOnChange = false,
    successMessage,
    className = '',
    id,
    value = '',
    onChange,
    onBlur,
    ...props 
  }, ref) => {
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState(false);
    
    const fieldId = id || `select-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const errorId = `${fieldId}-error`;
    const helpId = `${fieldId}-help`;
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (validateOnChange && !isTouched) {
        setIsTouched(true);
      }
      // Set valid if a value is selected
      if (e.target.value && e.target.value !== '') {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      if (validateOnBlur) {
        setIsTouched(true);
      }
      if (onBlur) {
        onBlur(e);
      }
      // Check validity on blur
      if (e.target.value && e.target.value !== '') {
        setIsValid(true);
      }
    };

    const getFieldStyles = () => {
      let baseStyles = 'w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-200 focus:outline-none appearance-none bg-white pr-10 ';
      
      if (error && isTouched) {
        baseStyles += 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 ';
      } else if (isValid && value) {
        baseStyles += 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 ';
      } else {
        baseStyles += 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ';
      }
      
      return baseStyles + className;
    };
    
    return (
      <div className="space-y-1">
        <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
        
        {helpText && !error && !isValid && (
          <p id={helpId} className="text-sm text-gray-500">
            {helpText}
          </p>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getFieldStyles()}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={[
              error && isTouched ? errorId : null,
              helpText && !error && !isValid ? helpId : null,
              isValid && successMessage ? `${fieldId}-success` : null
            ].filter(Boolean).join(' ') || undefined}
            aria-required={required}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Success checkmark icon */}
          {isValid && !error && value && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && isTouched && (
          <p id={errorId} className="text-sm text-red-600 flex items-center mt-1" role="alert">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error.message}
          </p>
        )}
        
        {/* Success message */}
        {isValid && successMessage && !error && value && (
          <p id={`${fieldId}-success`} className="text-sm text-green-600 flex items-center mt-1">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;