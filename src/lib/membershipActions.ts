'use server';

import { createProfessionalMembershipPayment } from './payments';
import { validateProfessionalMembershipForm } from './membershipValidation';
import { MembershipSubmissionResult } from '@/types/membership';
import type { ProfessionalMembershipFormData } from './membershipValidation';

/**
 * Server action to process professional membership application
 * @param formData - The membership form data
 * @returns Promise<MembershipSubmissionResult> with payment URL or error
 */
export async function submitProfessionalMembershipApplication(
  formData: ProfessionalMembershipFormData
): Promise<MembershipSubmissionResult> {
  try {
    // Validate form data on server side
    const validation = validateProfessionalMembershipForm(formData);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Form validation failed',
        error: validation.errors?.join(', ') || 'Invalid form data'
      };
    }

    // Sanitize and prepare data
    const sanitizedData = validation.data!;

    // TODO: Store membership application in database
    // This would typically save to a "membershipApplications" collection
    // For now, we'll just log it
    console.log('Membership application received:', {
      name: `${sanitizedData.firstName} ${sanitizedData.lastName}`,
      email: sanitizedData.email,
      institution: sanitizedData.institution,
      membershipType: sanitizedData.membershipType,
      timestamp: new Date().toISOString()
    });

    // Create return URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/membership/success`;
    const failureUrl = `${baseUrl}/membership/failure`;

    // Create Square payment link
    const paymentResult = await createProfessionalMembershipPayment(
      sanitizedData,
      successUrl,
      failureUrl
    );

    if (!paymentResult.success) {
      return {
        success: false,
        message: 'Failed to create payment link. Please try again.',
        error: paymentResult.error
      };
    }

    return {
      success: true,
      message: 'Application processed successfully. Redirecting to payment...',
      paymentUrl: paymentResult.paymentUrl
    };

  } catch (error) {
    console.error('Error processing membership application:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Server action to save membership data to database (for future implementation)
 * @param membershipData - The validated membership data
 * @param paymentId - The Square payment ID
 * @returns Promise<boolean> indicating success
 */
export async function saveMembershipApplication(
  membershipData: ProfessionalMembershipFormData,
  paymentId?: string
): Promise<boolean> {
  try {
    // This would save to Firebase Firestore
    // For now, just return true as placeholder
    console.log('Saving membership application:', {
      membershipData,
      paymentId,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error saving membership application:', error);
    return false;
  }
}

/**
 * Server action to generate member number (for future implementation)
 * @param membershipData - The membership data
 * @returns Promise<string> the generated member number
 */
export async function generateMemberNumber(
  membershipData: ProfessionalMembershipFormData
): Promise<string> {
  try {
    // Generate a member number based on year and sequence
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const memberNumber = `NHBEA-${year}-${sequence}`;
    
    console.log('Generated member number:', memberNumber);
    return memberNumber;
  } catch (error) {
    console.error('Error generating member number:', error);
    throw new Error('Failed to generate member number');
  }
}