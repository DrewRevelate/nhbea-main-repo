import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { StudentMembershipFormData, StudentApplicationSubmissionResult } from '@/types/membership';

/**
 * Submits a student membership application to Firestore
 * @param applicationData - The validated student application data
 * @returns Promise<StudentApplicationSubmissionResult> with success/error information
 */
export async function submitStudentApplication(
  applicationData: StudentMembershipFormData
): Promise<StudentApplicationSubmissionResult> {
  try {
    // Prepare data for Firestore with server timestamp
    const firestoreData = {
      personalInfo: applicationData.personalInfo,
      academicInfo: applicationData.academicInfo,
      essay: applicationData.essay,
      references: applicationData.references,
      submittedAt: serverTimestamp(),
      status: 'pending' as const,
      reviewNotes: ''
    };

    // Add document to studentApplicants collection
    const docRef = await addDoc(collection(db, 'studentApplicants'), firestoreData);

    console.log('Student application submitted successfully:', {
      applicationId: docRef.id,
      studentName: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`,
      studentEmail: applicationData.personalInfo.email,
      institution: applicationData.academicInfo.institution,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Your student membership application has been submitted successfully. You will be notified once the board has reviewed your application.'
    };

  } catch (error) {
    console.error('Error submitting student application:', error);
    
    return {
      success: false,
      message: 'Failed to submit application. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Validates that the student application data matches Firestore schema requirements
 * @param data - Student application data to validate
 * @returns boolean indicating if data is valid for Firestore storage
 */
export function validateFirestoreSchema(data: StudentMembershipFormData): boolean {
  try {
    // Check required fields exist
    if (!data.personalInfo?.firstName || !data.personalInfo?.lastName || 
        !data.personalInfo?.email || !data.personalInfo?.phone) {
      return false;
    }

    if (!data.academicInfo?.institution || !data.academicInfo?.major || 
        !data.academicInfo?.graduationYear || data.academicInfo?.gpa === undefined) {
      return false;
    }

    if (!data.essay || data.essay.length === 0) {
      return false;
    }

    if (!data.references || data.references.length < 2) {
      return false;
    }

    // Validate references structure
    for (const ref of data.references) {
      if (!ref.name || !ref.email || !ref.relationship) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Schema validation error:', error);
    return false;
  }
}

/**
 * Sanitizes user input to prevent XSS and injection attacks
 * @param input - Raw input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .slice(0, 2000); // Enforce maximum length
}

/**
 * Sanitizes the entire student application data
 * @param data - Raw application data
 * @returns Sanitized application data
 */
export function sanitizeApplicationData(data: StudentMembershipFormData): StudentMembershipFormData {
  return {
    personalInfo: {
      firstName: sanitizeInput(data.personalInfo.firstName),
      lastName: sanitizeInput(data.personalInfo.lastName),
      email: sanitizeInput(data.personalInfo.email.toLowerCase()),
      phone: sanitizeInput(data.personalInfo.phone)
    },
    academicInfo: {
      institution: sanitizeInput(data.academicInfo.institution),
      major: sanitizeInput(data.academicInfo.major),
      graduationYear: data.academicInfo.graduationYear,
      gpa: data.academicInfo.gpa
    },
    essay: sanitizeInput(data.essay),
    references: data.references.map(ref => ({
      name: sanitizeInput(ref.name),
      email: sanitizeInput(ref.email.toLowerCase()),
      relationship: sanitizeInput(ref.relationship)
    }))
  };
}