'use client';

import React from 'react';

interface StandardErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{error: string; retry?: () => void}>;
  onError?: (error: Error, errorInfo: any) => void;
}

interface StandardErrorBoundaryState {
  hasError: boolean;
  error: string | null;
  retryCount: number;
}

export class StandardErrorBoundary extends React.Component<
  StandardErrorBoundaryProps,
  StandardErrorBoundaryState
> {
  constructor(props: StandardErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<StandardErrorBoundaryState> {
    return {
      hasError: true,
      error: error.message
      // Don't reset retryCount - preserve existing count
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('StandardErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Log error for monitoring in production
    if (process.env.NODE_ENV === 'production') {
      // In a real app, this would send to monitoring service
      console.error('Production error:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        retryCount: this.state.retryCount
      });
    }
  }

  retry = () => {
    if (this.state.retryCount < 3) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || StandardErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error || 'Unknown error'}
          retry={this.state.retryCount < 3 ? this.retry : undefined}
        />
      );
    }

    return this.props.children;
  }
}

interface StandardErrorFallbackProps {
  error: string;
  retry?: () => void;
  variant?: 'page' | 'section' | 'inline';
}

export function StandardErrorFallback({
  error,
  retry,
  variant = 'section'
}: StandardErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const variantStyles = {
    page: 'min-h-screen flex items-center justify-center bg-gray-50',
    section: 'py-16 px-4 bg-gray-50 rounded-lg my-8',
    inline: 'py-4 px-4 bg-red-50 border border-red-200 rounded-md my-4'
  };

  return (
    <div className={variantStyles[variant]} role="alert" aria-live="polite">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {variant === 'page' ? 'Page Unavailable' : 'Content Unavailable'}
        </h3>
        
        <p className="text-gray-600 mb-6" id="error-description">
          {isDevelopment 
            ? `Development Notice: ${error}`
            : 'We apologize for the inconvenience. Please try again.'}
        </p>
        
        <div className="space-y-3">
          {retry && (
            <button
              onClick={retry}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              aria-describedby="error-description"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          )}
          
          {variant === 'page' && (
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = '/'}
                className="block w-full px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-md hover:bg-gray-300 transition-colors"
              >
                Go to Homepage
              </button>
              <button
                onClick={() => window.location.href = '/contact'}
                className="block w-full text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Contact Support
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}