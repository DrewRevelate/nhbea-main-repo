import { z } from 'zod';
import { StudentMembershipFormData } from '@/types/membership';

// Phone number regex - allows various formats
const phoneRegex = /^[\+]?[1]?[\s\-\.]?[\(]?[\d]{3}[\)]?[\s\-\.]?[\d]{3}[\s\-\.]?[\d]{4}$/;

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Current year for graduation year validation
const currentYear = new Date().getFullYear();

// Zod schema for student membership application validation
export const studentMembershipSchema = z.object({
  // Personal Information
  personalInfo: z.object({
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
      .regex(emailRegex, 'Please enter a valid email address')
      .max(255, 'Email is too long'),
      
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(phoneRegex, 'Please enter a valid phone number')
  }),

  // Academic Information
  academicInfo: z.object({
    institution: z
      .string()
      .min(1, 'Institution is required')
      .max(100, 'Institution name must be less than 100 characters'),
      
    major: z
      .string()
      .min(1, 'Major/field of study is required')
      .max(100, 'Major must be less than 100 characters'),
      
    graduationYear: z
      .number({
        message: 'Graduation year must be a number'
      })
      .int('Graduation year must be a whole number')
      .min(currentYear, `Graduation year must be ${currentYear} or later`)
      .max(currentYear + 10, `Graduation year cannot be more than 10 years in the future`),
      
    gpa: z
      .number({
        message: 'GPA must be a number'
      })
      .min(0.0, 'GPA cannot be less than 0.0')
      .max(4.0, 'GPA cannot be greater than 4.0')
      .multipleOf(0.01, 'GPA must have at most 2 decimal places')
  }),

  // Application Essay
  essay: z
    .string()
    .min(1, 'Essay is required')
    .min(100, 'Essay must be at least 100 characters')
    .max(2000, 'Essay must be less than 2000 characters'),

  // References (optional)
  references: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, 'Reference name is required')
          .max(100, 'Reference name must be less than 100 characters')
          .regex(/^[a-zA-Z\s\-'\.]+$/, 'Reference name contains invalid characters'),
          
        email: z
          .string()
          .min(1, 'Reference email is required')
          .regex(emailRegex, 'Please enter a valid email address for reference')
          .max(255, 'Reference email is too long'),
          
        relationship: z
          .string()
          .min(1, 'Relationship to reference is required')
          .max(100, 'Relationship description must be less than 100 characters')
      })
    )
    .max(3, 'Maximum 3 references allowed')
    .optional()
    .default([])
});

// Verify that the Zod schema matches our TypeScript interface
type _SchemaValidation = StudentMembershipFormData extends z.infer<typeof studentMembershipSchema> ? true : never;
type _InterfaceValidation = z.infer<typeof studentMembershipSchema> extends StudentMembershipFormData ? true : never;

/**
 * Validates student membership application form data
 * @param data - The form data to validate
 * @returns Object with validation result and any errors
 */
export function validateStudentMembershipForm(data: unknown): {
  isValid: boolean;
  data?: StudentMembershipFormData;
  errors?: string[];
} {
  try {
    const validatedData = studentMembershipSchema.parse(data);
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
 * Validates individual reference entry
 * @param reference - The reference data to validate
 * @returns Object with validation result
 */
export function validateReference(reference: unknown): {
  isValid: boolean;
  errors?: string[];
} {
  const referenceSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().regex(emailRegex, 'Valid email is required'),
    relationship: z.string().min(1, 'Relationship is required')
  });

  try {
    referenceSchema.parse(reference);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.issues.map(err => err.message)
      };
    }
    return {
      isValid: false,
      errors: ['Unknown validation error']
    };
  }
}