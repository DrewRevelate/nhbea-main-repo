'use client';

import React from 'react';

interface FormProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
  className?: string;
}

export function FormProgressIndicator({ 
  currentStep, 
  totalSteps, 
  stepNames, 
  className = '' 
}: FormProgressIndicatorProps) {
  return (
    <div className={`mb-8 ${className}`}>
      {/* Step Names */}
      <div className="flex items-center justify-between mb-4">
        {stepNames.map((name, index) => (
          <div 
            key={index}
            className={`text-sm font-medium transition-colors ${
              index < currentStep ? 'text-[var(--nhbea-royal-blue)]' :
              index === currentStep ? 'text-[var(--nhbea-accent-orange)]' :
              'text-gray-400'
            }`}
          >
            <div className="flex items-center">
              {/* Step Number Circle */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-2 transition-colors ${
                  index < currentStep ? 'bg-[var(--nhbea-royal-blue)] text-white' :
                  index === currentStep ? 'bg-[var(--nhbea-accent-orange)] text-white' :
                  'bg-gray-200 text-gray-500'
                }`}
              >
                {index < currentStep ? (
                  // Checkmark for completed steps
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {/* Step Name - Only show on larger screens */}
              <span className="hidden sm:inline">{name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        {/* Background bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          {/* Progress fill */}
          <div 
            className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-accent-orange)] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        
        {/* Step markers */}
        <div className="absolute top-0 left-0 w-full h-2 flex justify-between">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-[var(--nhbea-royal-blue)]' : 'bg-gray-300'
              }`}
              style={{
                marginLeft: index === 0 ? '0' : '-4px',
                marginRight: index === totalSteps - 1 ? '0' : '-4px'
              }}
            />
          ))}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Step {currentStep + 1} of {totalSteps}: 
          <span className="font-medium text-[var(--nhbea-royal-blue)] ml-1">
            {stepNames[currentStep]}
          </span>
        </p>
      </div>
    </div>
  );
}

export default FormProgressIndicator;