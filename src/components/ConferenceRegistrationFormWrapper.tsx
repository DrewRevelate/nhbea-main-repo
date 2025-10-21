'use client';

import { useState } from 'react';
import { ConferenceRegistrationFormData } from '@/lib/conferenceValidation';
import ConferenceRegistrationFormUX from './ConferenceRegistrationFormUX';
import { Conference } from '@/types/conference';

interface ConferenceRegistrationFormWrapperProps {
  conference: Conference;
}

export default function ConferenceRegistrationFormWrapper({
  conference
}: ConferenceRegistrationFormWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ConferenceRegistrationFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Import validation and repository functions
      const { conferenceValidationUtils } = await import('@/lib/conferenceValidation');
      const { registrantsRepository } = await import('@/lib/conference');

      // Validate form data
      const validation = conferenceValidationUtils.validateRegistrationForm(data);
      if (!validation.isValid) {
        throw new Error(validation.errors?.join(', ') || 'Form validation failed');
      }

      const sanitizedData = validation.data!;

      // Prepare registrant data for database storage - match FireCMS collection structure
      const participantInfo = {
        fullName: sanitizedData.fullName.trim(),
        email: sanitizedData.email.toLowerCase().trim(),
        phone: sanitizedData.phone?.trim(),
        institution: sanitizedData.institution.trim(),
        jobTitle: sanitizedData.jobTitle?.trim(),
        membershipId: sanitizedData.membershipId?.trim(),
        membershipStatus: sanitizedData.membershipStatus,
      };
      
      // Handle address info properly - use individual fields from form validation schema
      const addressInfo = (sanitizedData.address || sanitizedData.city || sanitizedData.state || sanitizedData.zipCode) ? {
        street: sanitizedData.address?.trim(),
        city: sanitizedData.city?.trim(),
        state: sanitizedData.state?.trim(),
        zipCode: sanitizedData.zipCode?.trim(),
      } : undefined;

      const emergencyContact = sanitizedData.emergencyContact && 
        (sanitizedData.emergencyContact.name || sanitizedData.emergencyContact.phone) ? {
        name: sanitizedData.emergencyContact.name?.trim(),
        phone: sanitizedData.emergencyContact.phone?.trim(),
        relationship: sanitizedData.emergencyContact.relationship?.trim(),
      } : undefined;

      const registrantData = {
        conferenceId: conference.id,
        participantInfo,
        registrationType: sanitizedData.registrationType,
        ...(addressInfo && { addressInfo }),
        ...(emergencyContact && { emergencyContact }),
        dietaryRestrictions: sanitizedData.dietaryRestrictions?.trim(),
        accessibilityNeeds: sanitizedData.accessibilityNeeds?.trim(),
        sessionPreferences: sanitizedData.sessionPreferences || [],
        networkingOptIn: sanitizedData.networkingOptIn || false,
        marketingConsent: sanitizedData.marketingConsent || false,
        agreeToTerms: sanitizedData.agreeToTerms,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
      };

      // Calculate total amount based on membership status and registration type
      const fees = conference.registration.fees;
      let totalAmount = 0;
      
      if (sanitizedData.registrationType === 'early_bird' && fees.earlyBird) {
        totalAmount = fees.earlyBird.amount;
      } else if (sanitizedData.membershipStatus === 'member') {
        totalAmount = fees.member;
      } else if (sanitizedData.membershipStatus === 'non-member') {
        totalAmount = fees.nonMember;
      } else if (sanitizedData.membershipStatus === 'student') {
        totalAmount = fees.student;
      }

      // Prepare data for API
      const apiData = {
        ...sanitizedData,
        conferenceId: conference.id,
        conferenceTitle: conference.title,
        totalAmount: totalAmount,
        phone: sanitizedData.phone || '',
        dietaryRestrictions: sanitizedData.dietaryRestrictions || '',
        accessibilityNeeds: sanitizedData.accessibilityNeeds || '',
        sessionPreferences: sanitizedData.sessionPreferences || [],
        networkingOptIn: sanitizedData.networkingOptIn || false,
        marketingConsent: sanitizedData.marketingConsent || false
      };

      // Call Firebase Function to process registration and payment
      const functionsUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 
        'https://us-central1-nhbea-64cab.cloudfunctions.net/api/api';
      
      const response = await fetch(`${functionsUrl}/conference/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to process registration');
      }

      // Log successful submission (for monitoring)
      console.log('Conference registration submitted successfully:', {
        registrantId: result.registrantId,
        conferenceId: conference.id,
        participantEmail: sanitizedData.email,
        membershipStatus: sanitizedData.membershipStatus,
        timestamp: new Date().toISOString()
      });

      // Redirect to Square payment
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        // Fallback to success page if no payment URL (shouldn't happen)
        window.location.href = `/conference/success?registrantId=${result.registrantId}`;
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to submit registration')) {
          setError('Unable to submit registration at this time. Please try again later.');
        } else if (error.message.includes('firestore/')) {
          setError('Database connection error. Please check your internet connection and try again.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-[var(--nhbea-error)]/5 border border-[var(--nhbea-error)]/30 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-[var(--nhbea-error)]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-[var(--nhbea-error)]">
                Registration Error
              </h3>
              <div className="mt-2 text-sm text-[var(--nhbea-error)]">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    className="bg-[var(--nhbea-error)]/5 px-2 py-1.5 rounded-md text-sm font-medium text-[var(--nhbea-error)] hover:bg-[var(--nhbea-error)]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--nhbea-error)]/5 focus:ring-[var(--nhbea-error)]"
                    onClick={() => setError(null)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConferenceRegistrationFormUX
        conference={conference}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}