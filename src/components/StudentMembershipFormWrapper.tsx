'use client';

import StudentMembershipForm from './StudentMembershipForm';
import { StudentApplicationSubmissionResult } from '@/types/membership';
import { StudentMembershipFormData } from '@/types/membership';
import { submitStudentApplication as submitToFirestore, sanitizeApplicationData } from '@/lib/studentApplications';
import { validateStudentMembershipForm } from '@/lib/studentApplicationValidation';

async function submitStudentApplication(data: StudentMembershipFormData): Promise<StudentApplicationSubmissionResult> {
  try {
    // Validate form data client-side
    const validation = validateStudentMembershipForm(data);
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Please check your form and correct any errors.',
        error: validation.errors?.join(', ') || 'Invalid form data'
      };
    }

    // Sanitize the validated data
    const sanitizedData = sanitizeApplicationData(validation.data!);

    // Submit directly to Firestore
    return await submitToFirestore(sanitizedData);
  } catch (error) {
    console.error('Application submission error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default function StudentMembershipFormWrapper() {
  return <StudentMembershipForm onSubmit={submitStudentApplication} />;
}