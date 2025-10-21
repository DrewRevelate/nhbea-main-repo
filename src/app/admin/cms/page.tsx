'use client';

import React, { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import app, { db, storage, auth } from '../../../lib/firebase';

// Dynamic imports to reduce initial bundle size  
const EnhancedFireCMS = dynamic(
  () => import('../../../components/cms/FireCMSConfig').then(mod => ({ 
    default: () => mod.createEnhancedFireCMS({ 
      firebaseApp: app, 
      firestore: db, 
      storage, 
      auth 
    })
  })),
  { ssr: false }
);

const SimpleCMS = dynamic(
  () => import('./simple-cms'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-900 mt-4">Loading CMS Components</h2>
        </div>
      </div>
    )
  }
);

export default function CMSPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Check if Firebase services are available
    if (!app || !db || !storage || !auth) {
      setError('Firebase services not properly initialized. Please check your environment variables.');
      setIsLoading(false);
      return;
    }
    
    // Try to initialize FireCMS, fallback to SimpleCMS if there are issues
    try {
      setIsLoading(false);
    } catch (err) {
      console.error('FireCMS initialization failed, using fallback:', err);
      setUseFallback(true);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-900 mt-4">Loading NHBEA CMS</h2>
          <p className="mt-2 text-gray-600">Initializing your enhanced content management system...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">CMS Initialization Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="text-sm text-gray-500">
            <p>Please ensure your Firebase environment variables are properly configured:</p>
            <ul className="mt-2 text-left space-y-1">
              <li>• NEXT_PUBLIC_FIREBASE_API_KEY</li>
              <li>• NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
              <li>• NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
              <li>• NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
              <li>• NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>• NEXT_PUBLIC_FIREBASE_APP_ID</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Use fallback SimpleCMS if FireCMS fails to initialize
  if (useFallback) {
    return <SimpleCMS firebaseApp={app} firestore={db} storage={storage} auth={auth} />;
  }

  // Render the enhanced FireCMS with error boundary
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ErrorBoundary fallback={<SimpleCMS firebaseApp={app} firestore={db} storage={storage} auth={auth} />}>
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center bg-white rounded-lg shadow-lg p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <h2 className="text-xl font-semibold text-gray-900 mt-4">Loading Enhanced CMS</h2>
            </div>
          </div>
        }>
          <EnhancedFireCMS />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Simple Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error('FireCMS Error Boundary caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('FireCMS Error Details:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}