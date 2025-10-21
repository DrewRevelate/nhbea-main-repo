'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring, reportWebVitals } from '@/lib/performance';

export function PerformanceMonitor() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Import and setup web vitals reporting
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS(reportWebVitals);
        onFID(reportWebVitals);
        onFCP(reportWebVitals);
        onLCP(reportWebVitals);
        onTTFB(reportWebVitals);
      }).catch(() => {
        // Fallback if web-vitals package is not available
        console.log('Web Vitals monitoring not available');
      });
    }
  }, []);
  
  return null; // This component doesn't render anything
}

// Export a simple version without web-vitals dependency for now
export default function SimplePerformanceMonitor() {
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);
  
  return null;
}