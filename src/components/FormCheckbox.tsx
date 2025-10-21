'use client';

import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode;
  error?: FieldError;
  helpText?: string;
  required?: boolean;
}

const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ 
    label, 
    error, 
    helpText, 
    required = false, 
    className = '',
    id,
    ...props 
  }, ref) => {
    const fieldId = id || `checkbox-${typeof label === 'string' ? label.replace(/\s+/g, '-').toLowerCase() : 'field'}`;
    const errorId = `${fieldId}-error`;
    const helpId = `${fieldId}-help`;
    
    return (
      <div className="space-y-1">
        <label htmlFor={fieldId} className="flex items-start space-x-3 cursor-pointer">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              id={fieldId}
              type="checkbox"
              className={`
                h-4 w-4 rounded border-gray-300 text-blue-600 
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-colors duration-200
                ${error ? 'border-red-500' : ''}
                ${className}
              `}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={[
                error ? errorId : null,
                helpText ? helpId : null
              ].filter(Boolean).join(' ') || undefined}
              aria-required={required}
              {...props}
            />
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-700">
              {label}
              {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
            </span>
            
            {helpText && (
              <p id={helpId} className="text-sm text-gray-500 mt-1">
                {helpText}
              </p>
            )}
          </div>
        </label>
        
        {/* Error message */}
        {error && (
          <p id={errorId} className="text-sm text-red-600 flex items-center mt-1 ml-7" role="alert">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox;