'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NewsletterFormData, NewsletterSubmissionResult } from '@/types/newsletter';
import { addNewsletterSubscriber } from '@/lib/newsletter';

// Zod schema for email validation
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long')
});

interface NewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export default function NewsletterSignup({ 
  className = '', 
  variant = 'default' 
}: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<NewsletterSubmissionResult | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema)
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const result = await addNewsletterSubscriber(data.email);
      setSubmissionResult(result);

      if (result.success) {
        reset(); // Clear form on success
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setSubmissionResult({
        success: false,
        message: 'Something went wrong. Please try again later.',
        error: 'Network error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <section 
      className={`relative ${isCompact ? 'py-8' : 'py-24'} ${className}`}
      role="region"
      aria-label="Newsletter subscription"
    >
      {/* Clean professional background with clear differentiation */}
      <div className="absolute inset-0 bg-[var(--nhbea-gray-100)] border-t border-[var(--nhbea-gray-200)]"></div>
      

      <div className="relative container mx-auto px-6">
        <div className={`max-w-2xl mx-auto text-center ${isCompact ? 'space-y-6' : 'space-y-8'}`}>
          {/* Header */}
          <div className="space-y-5">
            <h2 className={`font-black ${isCompact ? 'text-2xl' : 'text-4xl lg:text-5xl'}`}>
              <span className="text-[var(--nhbea-royal-blue)]">
                Never Miss an Opportunity
              </span>
            </h2>
            <p className={`text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed font-light ${isCompact ? 'text-base' : 'text-xl'}`}>
              Get exclusive access to professional development opportunities, networking events, and resources that advance your career in business education.
            </p>
            
            {/* Trust signals */}
            <div className="flex items-center justify-center space-x-6 pt-2">
              <div className="flex items-center space-x-2 text-[var(--color-text-muted)] text-sm">
                <svg className="w-4 h-4 text-[var(--nhbea-success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No spam, ever</span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--color-text-muted)] text-sm">
                <svg className="w-4 h-4 text-[var(--nhbea-royal-blue)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </div>

          {/* Newsletter Form with professional styling */}
          <div className={`p-8 ${isCompact ? 'lg:p-10' : 'lg:p-12'} rounded-xl bg-white border border-[var(--nhbea-gray-200)] shadow-lg hover:shadow-xl transition-all duration-300`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate role="form">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email address"
                    {...register('email')}
                    disabled={isSubmitting}
                    className={`
                      w-full px-4 py-3 rounded-lg border bg-white
                      placeholder:text-[var(--nhbea-gray-400)] text-[var(--nhbea-gray-900)]
                      focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-royal-blue)]/20 focus:border-[var(--nhbea-royal-blue)]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200 ease-out
                      ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[var(--nhbea-gray-300)]'}
                    `}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p 
                      id="email-error" 
                      className="mt-2 text-sm text-red-600"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    px-8 py-4 rounded-lg font-light text-white
                    bg-[var(--nhbea-royal-blue)]
                    hover:bg-[var(--nhbea-royal-blue-dark)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--nhbea-royal-blue)]/20 focus:ring-offset-2 focus:ring-offset-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 ease-out
                    shadow-sm hover:shadow-md
                    min-h-[48px] flex items-center justify-center
                    ${isCompact ? 'text-sm' : 'text-base'}
                  `}
                  aria-label={isSubmitting ? 'Subscribing to newsletter...' : 'Subscribe to newsletter'}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="relative">
                        <svg 
                          className="animate-spin h-5 w-5" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <div className="absolute inset-0 animate-ping rounded-full bg-white/20"></div>
                      </div>
                      <span className="animate-pulse">Subscribing...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Subscribe
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Success/Error Messages */}
            {submissionResult && (
              <div 
                className={`mt-4 p-4 rounded-lg ${
                  submissionResult.success 
                    ? 'bg-green-50/80 border border-green-200 text-green-800' 
                    : 'bg-red-50/80 border border-red-200 text-red-800'
                }`}
                role={submissionResult.success ? 'status' : 'alert'}
                aria-live="polite"
              >
                <p className="text-sm font-light">
                  {submissionResult.message}
                </p>
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-[var(--color-text-muted)] max-w-md mx-auto">
            We respect your privacy. Unsubscribe at any time. 
            By subscribing, you agree to our privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}