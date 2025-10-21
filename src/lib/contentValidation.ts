import { z } from 'zod';
import { HomepageContent, ContentSection } from '@/types/content';

// Zod schemas for content validation
export const HomepageContentSchema = z.object({
  heroTitle: z.string().min(1, 'Hero title is required'),
  heroSubtitle: z.string().min(1, 'Hero subtitle is required'),
  heroImageURL: z.string().url().optional().or(z.literal('')),
  missionTitle: z.string().min(1, 'Mission title is required'),
  missionContent: z.string().min(1, 'Mission content is required'),
  aboutTitle: z.string().min(1, 'About title is required'),
  aboutContent: z.string().min(1, 'About content is required')
});

export const ContentSectionSchema = z.object({
  id: z.string().min(1, 'Content section ID is required'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  imageURL: z.string().url().optional().or(z.literal('')),
  order: z.number().int().min(0, 'Order must be a non-negative integer')
});

/**
 * Validates homepage content against the required schema
 * @param content - The content to validate
 * @returns Object with validation result and any errors
 */
export function validateHomepageContent(content: unknown): {
  isValid: boolean;
  data?: HomepageContent;
  errors?: string[];
} {
  try {
    const validatedData = HomepageContentSchema.parse(content);
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
 * Validates a content section against the required schema
 * @param content - The content section to validate
 * @returns Object with validation result and any errors
 */
export function validateContentSection(content: unknown): {
  isValid: boolean;
  data?: ContentSection;
  errors?: string[];
} {
  try {
    const validatedData = ContentSectionSchema.parse(content);
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
 * Validates that all required fields exist and are non-empty
 * @param content - The content object to validate
 * @param requiredFields - Array of field names that must exist and be non-empty
 * @returns Object with validation result and missing fields
 */
export function validateRequiredFields(
  content: Record<string, any>, 
  requiredFields: string[]
): {
  isValid: boolean;
  missingFields: string[];
  emptyFields: string[];
} {
  const missingFields: string[] = [];
  const emptyFields: string[] = [];

  for (const field of requiredFields) {
    if (!(field in content)) {
      missingFields.push(field);
    } else if (!content[field] || (typeof content[field] === 'string' && content[field].trim() === '')) {
      emptyFields.push(field);
    }
  }

  return {
    isValid: missingFields.length === 0 && emptyFields.length === 0,
    missingFields,
    emptyFields
  };
}

/**
 * Validates image URLs to ensure they are accessible
 * @param imageURL - The image URL to validate
 * @returns Promise<boolean> indicating if the image is accessible
 */
export async function validateImageURL(imageURL: string): Promise<boolean> {
  if (!imageURL || imageURL.trim() === '') {
    return true; // Empty URLs are valid (optional images)
  }

  try {
    // Basic URL format validation
    new URL(imageURL);
    
    // In a browser environment, we can't easily do a HEAD request due to CORS
    // So we'll just validate the URL format for now
    // In a server environment, you could add actual HTTP validation here
    return true;
  } catch {
    return false;
  }
}

/**
 * Performs comprehensive content integrity checks
 * @param content - The content to check
 * @param contentType - Type of content being validated
 * @returns Promise<object> with detailed validation results
 */
export async function performContentIntegrityCheck(
  content: unknown,
  contentType: 'homepage' | 'section'
): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validatedData?: HomepageContent | ContentSection;
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic type validation
  if (!content || typeof content !== 'object') {
    errors.push('Content must be a valid object');
    return { isValid: false, errors, warnings };
  }

  // Schema validation
  let validationResult;
  if (contentType === 'homepage') {
    validationResult = validateHomepageContent(content);
  } else {
    validationResult = validateContentSection(content);
  }

  if (!validationResult.isValid) {
    errors.push(...(validationResult.errors || []));
    return { isValid: false, errors, warnings };
  }

  const validatedData = validationResult.data!;

  // Additional checks for image URLs
  if ('heroImageURL' in validatedData && validatedData.heroImageURL) {
    const isImageValid = await validateImageURL(validatedData.heroImageURL);
    if (!isImageValid) {
      warnings.push('Hero image URL appears to be invalid or inaccessible');
    }
  }

  if ('imageURL' in validatedData && validatedData.imageURL) {
    const isImageValid = await validateImageURL(validatedData.imageURL);
    if (!isImageValid) {
      warnings.push('Content image URL appears to be invalid or inaccessible');
    }
  }

  // Content quality checks
  if ('missionContent' in validatedData && validatedData.missionContent.length < 50) {
    warnings.push('Mission content seems too short for effective communication');
  }

  if ('aboutContent' in validatedData && validatedData.aboutContent.length < 50) {
    warnings.push('About content seems too short for effective communication');
  }

  if ('content' in validatedData && validatedData.content.length < 20) {
    warnings.push('Content section seems too short');
  }

  return {
    isValid: true,
    errors,
    warnings,
    validatedData
  };
}

/**
 * Development mode warning for missing or invalid content
 * @param contentType - Type of content that has issues
 * @param issues - Array of issues found
 */
export function logContentWarning(contentType: string, issues: string[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Content validation issues for ${contentType}:`, issues);
  }
}

/**
 * Creates a safe content object with fallbacks for missing fields
 * @param content - Original content object
 * @param fallback - Fallback content object
 * @returns Merged content with all required fields
 */
export function createSafeContent<T extends Record<string, any>>(
  content: Partial<T> | null | undefined,
  fallback: T
): T {
  if (!content) {
    return fallback;
  }

  const safeContent = { ...fallback };
  
  // Merge non-empty values from content
  for (const key in content) {
    const value = content[key];
    if (value !== null && value !== undefined && value !== '') {
      safeContent[key] = value;
    }
  }

  return safeContent;
}