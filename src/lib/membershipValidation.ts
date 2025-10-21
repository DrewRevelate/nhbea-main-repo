import { z } from 'zod';

// US states for validation
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
] as const;

// Phone number regex - allows various formats
const phoneRegex = /^[\+]?[1]?[\s\-\.]?[\(]?[\d]{3}[\)]?[\s\-\.]?[\d]{3}[\s\-\.]?[\d]{4}$/;

// Zod schema for professional membership form validation
export const professionalMembershipSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'First name contains invalid characters'),
    
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Last name contains invalid characters'),
    
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
    
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid phone number'),
    
  // Professional Information
  institution: z
    .string()
    .min(1, 'Institution is required')
    .max(100, 'Institution name must be less than 100 characters'),
    
  position: z
    .string()
    .min(1, 'Position is required')
    .max(100, 'Position must be less than 100 characters'),
    
  yearsExperience: z
    .number({
      message: 'Years of experience must be a number'
    })
    .int('Years of experience must be a whole number')
    .min(0, 'Years of experience cannot be negative')
    .max(70, 'Years of experience seems too high'),
    
  // Address Information
  address: z
    .string()
    .min(1, 'Address is required')
    .max(200, 'Address must be less than 200 characters'),
    
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City name must be less than 100 characters'),
    
  state: z
    .enum(US_STATES, {
      message: 'Please select a valid state'
    }),
    
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'),
    
  // Membership Information
  membershipType: z
    .enum(['new', 'renewal'], {
      message: 'Please select a valid membership type'
    }),
    
  previousMemberNumber: z
    .string()
    .optional(),
    
  // Communication Preferences
  communicationPreferences: z.object({
    newsletter: z.boolean().default(true),
    updates: z.boolean().default(true),
    events: z.boolean().default(true)
  })
}).refine((data) => {
  // If renewal membership, previous member number is required
  if (data.membershipType === 'renewal' && (!data.previousMemberNumber || data.previousMemberNumber.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Previous member number is required for renewal memberships',
  path: ['previousMemberNumber']
});

export type ProfessionalMembershipFormData = z.infer<typeof professionalMembershipSchema>;

/**
 * Validates professional membership form data
 * @param data - The form data to validate
 * @returns Object with validation result and any errors
 */
export function validateProfessionalMembershipForm(data: unknown): {
  isValid: boolean;
  data?: ProfessionalMembershipFormData;
  errors?: string[];
} {
  try {
    const validatedData = professionalMembershipSchema.parse(data);
    return {
      isValid: true,
      data: validatedData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      isValid: false,
      errors: ['Unknown validation error']
    };
  }
}

/**
 * Validates that required fields for renewal membership are present
 * @param data - The form data to validate
 * @returns Object with validation result and missing fields
 */
export function validateRenewalRequirements(data: Partial<ProfessionalMembershipFormData>): {
  isValid: boolean;
  missingFields: string[];
} {
  const missingFields: string[] = [];
  
  if (data.membershipType === 'renewal') {
    if (!data.previousMemberNumber || data.previousMemberNumber.trim() === '') {
      missingFields.push('previousMemberNumber');
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}