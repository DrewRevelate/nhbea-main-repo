import { z } from 'zod';

// US states for validation (reused from membershipValidation)
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
] as const;

// Phone number regex - Safari compatible version
const phoneRegex = /^[\+]?[1]?[\s\-.]?[(]?[\d]{3}[)]?[\s\-.]?[\d]{3}[\s\-.]?[\d]{4}$/;

// Registration types based on conference pricing tiers
export const registrationTypes = ['regular', 'early_bird', 'student', 'speaker'] as const;

// Membership status options for pricing determination
export const membershipStatuses = ['member', 'non-member', 'student'] as const;

// Zod schema for conference registration form validation
export const conferenceRegistrationSchema = z.object({
  // Participant Information
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods'),
    
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
    
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.trim() === '' || phoneRegex.test(val), {
      message: 'Please enter a valid phone number'
    }),
    
  institution: z
    .string()
    .min(1, 'Institution/Organization is required')
    .max(200, 'Institution name must be less than 200 characters'),
    
  jobTitle: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, {
      message: 'Job title must be less than 100 characters'
    }),
    
  // Membership Information
  membershipStatus: z
    .enum(membershipStatuses, {
      message: 'Please select your membership status'
    }),
    
  membershipId: z
    .string()
    .optional(),
    
  // Address Information (optional but helpful for organization)
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 200, {
      message: 'Address must be less than 200 characters'
    }),
    
  city: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, {
      message: 'City name must be less than 100 characters'
    }),
    
  state: z
    .enum(['', ...US_STATES], {
      message: 'Please select a valid state'
    })
    .optional()
    .transform(val => val === '' ? undefined : val),
    
  zipCode: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{5}(-\d{4})?$/.test(val), {
      message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
    }),
    
  // Registration Type (determined by system but can be overridden)
  registrationType: z
    .enum(registrationTypes, {
      message: 'Invalid registration type'
    }),
    
  // Preferences and Special Requirements
  dietaryRestrictions: z
    .string()
    .max(500, 'Dietary restrictions must be less than 500 characters')
    .optional(),
    
  accessibilityNeeds: z
    .string()
    .max(500, 'Accessibility needs must be less than 500 characters')
    .optional(),
    
  sessionPreferences: z
    .array(z.string())
    .max(10, 'You can select up to 10 session preferences')
    .optional()
    .default([]),
    
  networkingOptIn: z
    .boolean()
    .default(true),
    
  // Agreement and Consent
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, {
      message: 'You must agree to the terms and conditions'
    }),
    
  marketingConsent: z
    .boolean()
    .default(false),
    
  // Emergency Contact (optional)
  emergencyContact: z.object({
    name: z
      .string()
      .max(100, 'Emergency contact name must be less than 100 characters')
      .optional(),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || phoneRegex.test(val), {
        message: 'Please enter a valid emergency contact phone number'
      }),
    relationship: z
      .string()
      .max(50, 'Relationship must be less than 50 characters')
      .optional()
  }).optional()
    
}).refine((data) => {
  // If member status is selected, membership ID should be provided
  if (data.membershipStatus === 'member' && (!data.membershipId || data.membershipId.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Membership ID is required for current members',
  path: ['membershipId']
}).refine((data) => {
  // If emergency contact is provided, at least name or phone should be filled
  if (data.emergencyContact && 
      (!data.emergencyContact.name || data.emergencyContact.name.trim() === '') &&
      (!data.emergencyContact.phone || data.emergencyContact.phone.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Emergency contact must include at least a name or phone number',
  path: ['emergencyContact']
});

export type ConferenceRegistrationFormData = z.infer<typeof conferenceRegistrationSchema>;

/**
 * Validates conference registration form data
 * @param data - The form data to validate
 * @returns Object with validation result and any errors
 */
export function validateConferenceRegistrationForm(data: unknown): {
  isValid: boolean;
  data?: ConferenceRegistrationFormData;
  errors?: string[];
} {
  try {
    const validatedData = conferenceRegistrationSchema.parse(data);
    return {
      isValid: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => {
        // Safari-specific error message handling
        const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
        let message = err.message;
        
        // Make error messages more user-friendly for Safari
        if (message.includes('did not match')) {
          if (err.path.includes('fullName')) {
            message = 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods';
          } else if (err.path.includes('phone')) {
            message = 'Please enter a valid phone number format (e.g., 555-123-4567)';
          } else {
            message = 'Please check the format of this field';
          }
        }
        
        return `${path}${message}`;
      });
      
      return {
        isValid: false,
        errors
      };
    }
    return {
      isValid: false,
      errors: ['Validation error occurred. Please check all fields and try again.']
    };
  }
}

/**
 * Validates that required fields are present based on registration context
 * @param data - The form data to validate
 * @returns Object with validation result and missing fields
 */
export function validateRegistrationRequirements(data: Partial<ConferenceRegistrationFormData>): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];
  
  // Check required fields
  if (!data.fullName || data.fullName.trim() === '') {
    missingFields.push('fullName');
  }
  
  if (!data.email || data.email.trim() === '') {
    missingFields.push('email');
  }
  
  if (!data.institution || data.institution.trim() === '') {
    missingFields.push('institution');
  }
  
  if (!data.membershipStatus) {
    missingFields.push('membershipStatus');
  }
  
  if (!data.registrationType) {
    missingFields.push('registrationType');
  }
  
  if (!data.agreeToTerms) {
    missingFields.push('agreeToTerms');
  }
  
  // If member status is selected, membership ID is required
  if (data.membershipStatus === 'member' && (!data.membershipId || data.membershipId.trim() === '')) {
    missingFields.push('membershipId');
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

/**
 * Sanitizes input data to prevent XSS and other security issues
 * @param data - The raw form data
 * @returns Sanitized data
 */
export function sanitizeRegistrationData(data: any): Partial<ConferenceRegistrationFormData> {
  const sanitizeString = (str: string | undefined): string | undefined => {
    if (!str) return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .substring(0, 1000) // Limit length
      .trim();
  };
  
  return {
    ...data,
    fullName: sanitizeString(data.fullName),
    email: sanitizeString(data.email),
    phone: sanitizeString(data.phone),
    institution: sanitizeString(data.institution),
    jobTitle: sanitizeString(data.jobTitle),
    membershipId: sanitizeString(data.membershipId),
    address: sanitizeString(data.address),
    city: sanitizeString(data.city),
    zipCode: sanitizeString(data.zipCode),
    dietaryRestrictions: sanitizeString(data.dietaryRestrictions),
    accessibilityNeeds: sanitizeString(data.accessibilityNeeds),
    emergencyContact: data.emergencyContact ? {
      name: sanitizeString(data.emergencyContact.name),
      phone: sanitizeString(data.emergencyContact.phone),
      relationship: sanitizeString(data.emergencyContact.relationship)
    } : undefined
  };
}

/**
 * Determines the appropriate registration type based on timing and member status
 * @param membershipStatus - Current membership status
 * @param conferenceEarlyBirdDeadline - Early bird deadline
 * @returns Appropriate registration type
 */
export function determineRegistrationType(
  membershipStatus: string,
  conferenceEarlyBirdDeadline?: Date
): typeof registrationTypes[number] {
  const now = new Date();
  
  // Students always get student pricing regardless of timing
  if (membershipStatus === 'student') {
    return 'student';
  }
  
  // Check if early bird pricing is available
  if (conferenceEarlyBirdDeadline && now <= conferenceEarlyBirdDeadline) {
    return 'early_bird';
  }
  
  // Default to regular pricing
  return 'regular';
}

/**
 * Calculates the registration fee based on registration type and conference pricing
 * @param registrationType - Type of registration
 * @param membershipStatus - Member status for pricing
 * @param conferenceFees - Fee structure from conference data
 * @returns Registration fee amount
 */
export function calculateRegistrationFee(
  registrationType: typeof registrationTypes[number],
  membershipStatus: typeof membershipStatuses[number],
  conferenceFees: {
    member: number;
    nonMember: number;
    student: number;
    earlyBird?: { amount: number; deadline: Date };
  }
): number {
  // Early bird pricing (if available and applicable)
  if (registrationType === 'early_bird' && conferenceFees.earlyBird) {
    return conferenceFees.earlyBird.amount;
  }
  
  // Student pricing
  if (registrationType === 'student' || membershipStatus === 'student') {
    return conferenceFees.student;
  }
  
  // Member vs non-member pricing
  if (membershipStatus === 'member') {
    return conferenceFees.member;
  }
  
  return conferenceFees.nonMember;
}

/**
 * Validation utilities for conference registration (similar to awards validation)
 */
export const conferenceValidationUtils = {
  /**
   * Validates conference registration form data
   */
  validateRegistrationForm(data: unknown): { isValid: boolean; data?: ConferenceRegistrationFormData; errors?: string[] } {
    try {
      const validatedData = conferenceRegistrationSchema.parse(data);
      return { isValid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        );
        return { isValid: false, errors };
      }
      return { isValid: false, errors: ['Invalid data format'] };
    }
  },

  /**
   * Sanitizes text input by removing potentially harmful content
   */
  sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets to prevent basic XSS
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .substring(0, 5000); // Limit length
  },

  /**
   * Validates email format more strictly
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 255;
  },

  /**
   * Validates phone number format
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1]?[\s\-.]?[(]?[\d]{3}[)]?[\s\-.]?[\d]{3}[\s\-.]?[\d]{4}$/;
    return phoneRegex.test(phone);
  }
};