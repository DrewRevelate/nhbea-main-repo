import { NextRequest, NextResponse } from 'next/server';
import { nominationsRepository } from '@/lib/awards';
import { awardValidationUtils, type AwardNominationFormData } from '@/lib/awardValidation';

interface NominationSubmissionResult {
  success: boolean;
  message: string;
  nominationId?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    // Validate form data on server side
    const validation = awardValidationUtils.validateNominationForm(formData);
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Form validation failed',
        error: validation.errors?.join(', ') || 'Invalid form data'
      } as NominationSubmissionResult, { status: 400 });
    }

    // Sanitize and prepare data
    const sanitizedData: AwardNominationFormData = validation.data!;

    // Prepare nomination data for database storage - only include non-empty optional fields
    const nomineeInfo = {
      name: sanitizedData.nomineeInfo.name.trim(),
      email: sanitizedData.nomineeInfo.email?.toLowerCase().trim(),
      organization: sanitizedData.nomineeInfo.organization?.trim() || undefined,
      position: sanitizedData.nomineeInfo.position?.trim() || undefined,
    };
    
    const nominatorInfo = {
      name: sanitizedData.nominatorInfo.name.trim(),
      email: sanitizedData.nominatorInfo.email.toLowerCase().trim(),
      organization: sanitizedData.nominatorInfo.organization?.trim() || undefined,
      position: sanitizedData.nominatorInfo.position?.trim() || undefined,
    };

    const nominationData = {
      awardId: sanitizedData.awardId,
      awardCategory: sanitizedData.awardCategory,
      nomineeInfo,
      nominatorInfo,
      nominationText: awardValidationUtils.sanitizeText(sanitizedData.nominationText),
      status: 'pending' as const,
    };

    // Store nomination in database
    const nominationId = await nominationsRepository.createNomination(nominationData);

    // Log successful submission (for monitoring)
    console.log('Award nomination submitted successfully:', {
      nominationId,
      awardId: sanitizedData.awardId,
      nomineeEmail: sanitizedData.nomineeInfo.email,
      nominatorEmail: sanitizedData.nominatorInfo.email,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Nomination submitted successfully! Thank you for recognizing excellence in business education.',
      nominationId
    } as NominationSubmissionResult);

  } catch (error) {
    console.error('Error processing award nomination:', error);
    console.error('Full error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: (error as any)?.code,
      details: (error as any)?.details
    });
    
    // Return appropriate error response based on error type
    if (error instanceof Error) {
      if (error.message.includes('Failed to submit nomination')) {
        console.log('Database error detected, returning 503');
        return NextResponse.json({
          success: false,
          message: 'Unable to submit nomination at this time. Please try again later.',
          error: 'Database error',
          details: error.message // Add more details for debugging
        } as NominationSubmissionResult, { status: 503 });
      }
      
      // Check for Firebase-specific errors
      if ((error as any)?.code?.startsWith('firestore/')) {
        console.log('Firestore error detected:', (error as any).code);
        return NextResponse.json({
          success: false,
          message: 'Database connection error. Please try again later.',
          error: 'Firestore error',
          details: (error as any).code
        } as NominationSubmissionResult, { status: 503 });
      }
    }

    console.log('Unknown error, returning 500');
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    } as NominationSubmissionResult, { status: 500 });
  }
}