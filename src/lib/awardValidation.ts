import { z } from 'zod';

/**
 * Validation schemas for award nominations
 * Follows patterns established in membershipValidation.ts
 */

// Reusable validation patterns
const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters');

const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\-\.\']+$/, 'Name can only contain letters, spaces, hyphens, periods, and apostrophes');

const organizationSchema = z.string()
  .min(1, 'Organization is required')
  .max(200, 'Organization name must be less than 200 characters');

const positionSchema = z.string()
  .max(100, 'Position title must be less than 100 characters')
  .optional();

// Award categories validation
export const awardCategorySchema = z.enum([
  'Excellence',
  'Lifetime',
  'Innovation', 
  'Service'
], {
  errorMap: () => ({ message: 'Please select a valid award category' })
});

// Nomination text validation (50-2000 characters as per story requirements)
const nominationTextSchema = z.string()
  .min(50, 'Nomination statement must be at least 50 characters')
  .max(2000, 'Nomination statement must be less than 2000 characters')
  .refine(
    (text) => text.trim().length >= 50,
    'Nomination statement must contain at least 50 meaningful characters'
  );


/**
 * Nominee Information Schema
 */
export const nomineeInfoSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  organization: organizationSchema.optional(),
  position: positionSchema,
});

/**
 * Nominator Information Schema
 */
export const nominatorInfoSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  organization: organizationSchema.optional(),
  position: positionSchema,
});

/**
 * Complete Award Nomination Form Schema
 */
export const awardNominationFormSchema = z.object({
  // Award selection
  awardId: z.string().min(1, 'Please select an award'),
  awardCategory: awardCategorySchema,
  
  // Nominee information
  nomineeInfo: nomineeInfoSchema,
  
  // Nominator information  
  nominatorInfo: nominatorInfoSchema,
  
  // Nomination content
  nominationText: nominationTextSchema,
  
  // Terms and conditions
  agreedToTerms: z.boolean().refine(
    (agreed) => agreed === true,
    'You must agree to the terms and conditions'
  ),
});

/**
 * Multi-step form schemas for better UX
 */

// Step 1: Award Selection
export const awardSelectionSchema = z.object({
  awardId: z.string().min(1, 'Please select an award'),
  awardCategory: awardCategorySchema,
});

// Step 2: Nominee Information
export const nomineeInformationSchema = z.object({
  nomineeInfo: nomineeInfoSchema,
});

// Step 3: Nominator Information
export const nominatorInformationSchema = z.object({
  nominatorInfo: nominatorInfoSchema,
});

// Step 4: Nomination Details
export const nominationDetailsSchema = z.object({
  nominationText: nominationTextSchema,
  agreedToTerms: z.boolean().refine(
    (agreed) => agreed === true,
    'You must agree to the terms and conditions'
  ),
});

/**
 * Type definitions for form data
 */
export type AwardNominationFormData = z.infer<typeof awardNominationFormSchema>;
export type NomineeInfo = z.infer<typeof nomineeInfoSchema>;
export type NominatorInfo = z.infer<typeof nominatorInfoSchema>;
export type AwardSelectionData = z.infer<typeof awardSelectionSchema>;
export type NomineeInformationData = z.infer<typeof nomineeInformationSchema>;
export type NominatorInformationData = z.infer<typeof nominatorInformationSchema>;
export type NominationDetailsData = z.infer<typeof nominationDetailsSchema>;

/**
 * Validation helper functions
 */
export const awardValidationUtils = {
  /**
   * Validate award nomination form data
   */
  validateNominationForm(data: unknown): { 
    isValid: boolean; 
    data?: AwardNominationFormData; 
    errors?: string[] 
  } {
    try {
      const validatedData = awardNominationFormSchema.parse(data);
      return {
        isValid: true,
        data: validatedData
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(issue => 
          issue.path.length > 0 ? `${issue.path.join('.')}: ${issue.message}` : issue.message
        );
        return {
          isValid: false,
          errors
        };
      }
      return {
        isValid: false,
        errors: ['Unknown validation error']
      };
    }
  },

  /**
   * Validate individual form steps
   */
  validateStep(step: number, data: unknown): { isValid: boolean; errors?: string[] } {
    try {
      switch (step) {
        case 1:
          awardSelectionSchema.parse(data);
          break;
        case 2:
          nomineeInformationSchema.parse(data);
          break;
        case 3:
          nominatorInformationSchema.parse(data);
          break;
        case 4:
          nominationDetailsSchema.parse(data);
          break;
        default:
          throw new Error('Invalid step number');
      }
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(issue => 
          issue.path.length > 0 ? `${issue.path.join('.')}: ${issue.message}` : issue.message
        );
        return { isValid: false, errors };
      }
      return { isValid: false, errors: ['Unknown validation error'] };
    }
  },

  /**
   * Sanitize text input to prevent XSS
   */
  sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .slice(0, 2000); // Max length enforcement
  },

  /**
   * Format error messages for display
   */
  formatErrorMessage(fieldPath: string, message: string): string {
    const fieldNames: Record<string, string> = {
      'awardId': 'Award Selection',
      'awardCategory': 'Award Category',
      'nomineeInfo.name': 'Nominee Name',
      'nomineeInfo.email': 'Nominee Email',
      'nomineeInfo.organization': 'Nominee Organization',
      'nomineeInfo.position': 'Nominee Position',
      'nominatorInfo.name': 'Your Name',
      'nominatorInfo.email': 'Your Email',
      'nominatorInfo.organization': 'Your Organization',
      'nominatorInfo.position': 'Your Position',
      'nominationText': 'Nomination Statement',
      'supportingDocuments': 'Supporting Documents',
      'agreedToTerms': 'Terms and Conditions'
    };

    const fieldName = fieldNames[fieldPath] || fieldPath;
    return `${fieldName}: ${message}`;
  }
};