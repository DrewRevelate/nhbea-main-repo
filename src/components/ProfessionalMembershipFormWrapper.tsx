'use client';

import ProfessionalMembershipForm from './ProfessionalMembershipForm';
import { MembershipSubmissionResult } from '@/types/membership';
import type { ProfessionalMembershipFormData } from '@/lib/membershipValidation';

async function submitMembershipApplication(data: ProfessionalMembershipFormData): Promise<MembershipSubmissionResult> {
  try {
    const response = await fetch('/api/membership', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || 'Failed to process application',
        error: errorData.error
      };
    }

    return response.json();
  } catch (error) {
    console.error('Network error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.',
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

export default function ProfessionalMembershipFormWrapper() {
  return <ProfessionalMembershipForm onSubmit={submitMembershipApplication} />;
}