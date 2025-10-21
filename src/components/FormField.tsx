'use client';

import { forwardRef, useState, useEffect } from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  helpText?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  showCharacterCount?: boolean;
  maxCharacters?: number;
  minCharacters?: number;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  successMessage?: string;
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ 
    label, 
    error, 
    helpText, 
    required = false, 
    multiline = false,
    rows = 4,
    showCharacterCount = false,
    maxCharacters,
    minCharacters,
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
    const [localValue, setLocalValue] = useState(value);
    
    const fieldId = id || `field-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const errorId = `${fieldId}-error`;
    const helpId = `${fieldId}-help`;
    const characterCount = String(localValue).length;
    
    // Determine validation state
    useEffect(() => {
      if (isTouched && !error && localValue) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }, [isTouched, error, localValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLocalValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
      if (validateOnChange && !isTouched) {
        setIsTouched(true);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (validateOnBlur) {
        setIsTouched(true);
      }
      if (onBlur) {
        onBlur(e);
      }
    };

    const getFieldStyles = () => {
      let baseStyles = 'w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-200 focus:outline-none ';
      
      if (error && isTouched) {
        baseStyles += 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 ';
      } else if (isValid) {
        baseStyles += 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 ';
      } else {
        baseStyles += 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ';
      }
      
      return baseStyles + className;
    };

    const renderCharacterCount = () => {
      if (!showCharacterCount) return null;
      
      let countColor = 'text-gray-500';
      if (minCharacters && characterCount < minCharacters) {
        countColor = 'text-red-600';
      } else if (maxCharacters && characterCount > maxCharacters * 0.9) {
        countColor = 'text-orange-600';
      } else if (characterCount > 0) {
        countColor = 'text-green-600';
      }
      
      return (
        <div className={`text-sm mt-1 ${countColor}`}>
          {characterCount}
          {maxCharacters && ` / ${maxCharacters}`} characters
          {minCharacters && characterCount < minCharacters && (
            <span className="ml-1">({minCharacters - characterCount} more needed)</span>
          )}
        </div>
      );
    };

    const InputComponent = multiline ? 'textarea' : 'input';
    
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
          <InputComponent
            ref={ref as any}
            id={fieldId}
            value={localValue}
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
            {...(multiline ? { rows } : {})}
            {...props}
          />
          
          {/* Success checkmark icon */}
          {isValid && !error && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Character count */}
        {renderCharacterCount()}
        
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
        {isValid && successMessage && !error && (
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

FormField.displayName = 'FormField';

export default FormField;