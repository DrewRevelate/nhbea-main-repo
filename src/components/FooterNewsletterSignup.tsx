'use client';

import { useState, useEffect } from 'react';
import { addNewsletterSubscriber } from '@/lib/newsletter';
import { NewsletterSubmissionResult } from '@/types/newsletter';

export default function FooterNewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<NewsletterSubmissionResult | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure component is mounted and Firebase is ready
    setIsReady(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isReady) {
      setResult({
        success: false,
        message: 'Please wait...',
        error: 'Not ready'
      });
      return;
    }
    
    if (!email.trim()) {
      setResult({
        success: false,
        message: 'Please enter your email address.',
        error: 'Empty email'
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const submissionResult = await addNewsletterSubscriber(email, 'website');
      setResult(submissionResult);
      
      if (submissionResult.success) {
        setEmail(''); // Clear form on success
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setResult({
        success: false,
        message: 'Something went wrong. Please try again later.',
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={isSubmitting || !isReady}
          required
          className="w-full px-3 py-2 text-sm rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-accent-gold)] focus:border-[var(--nhbea-accent-gold)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Email address for newsletter"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-3 py-2 text-sm font-medium bg-[var(--nhbea-accent-gold)] hover:bg-[var(--nhbea-accent-gold-dark)] text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {/* Success/Error Messages */}
      {result && (
        <div 
          className={`p-2 rounded-lg text-xs ${
            result.success 
              ? 'bg-green-500/20 border border-green-400/30 text-green-300' 
              : 'bg-red-500/20 border border-red-400/30 text-red-300'
          }`}
          role={result.success ? 'status' : 'alert'}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}