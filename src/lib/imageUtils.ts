import { storage } from './firebase';
import { ref, getDownloadURL } from 'firebase/storage';

/**
 * Get the public download URL for an image stored in Firebase Storage
 * 
 * @param imagePath - The full path to the image in Firebase Storage
 * @returns Promise<string | null> - The download URL or null if not found
 */
export async function getImageUrl(imagePath: string): Promise<string | null> {
  if (!imagePath) {
    return null;
  }

  try {
    const imageRef = ref(storage, imagePath);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.warn('Failed to get image URL for:', imagePath, error);
    return null;
  }
}

/**
 * Get the public download URL for a member image with fallback support
 * Handles both old and new image path formats
 * 
 * @param imagePath - The image path from member data
 * @returns Promise<string | null> - The download URL or null if not found
 */
export async function getMemberImageUrl(imagePath: string): Promise<string | null> {
  if (!imagePath) {
    return null;
  }

  // Try the original path first
  let url = await getImageUrl(imagePath);
  if (url) {
    return url;
  }

  // If original path fails, try public directory
  if (imagePath.startsWith('Member_Images/')) {
    const publicPath = imagePath.replace('Member_Images/', 'public/Member_Images/');
    url = await getImageUrl(publicPath);
    if (url) {
      return url;
    }
  }

  // If public fails, try private directory (for authenticated users)
  if (imagePath.startsWith('Member_Images/')) {
    const privatePath = imagePath.replace('Member_Images/', 'private/Member_Images/');
    url = await getImageUrl(privatePath);
    if (url) {
      return url;
    }
  }

  return null;
}

/**
 * Get the public URL for sponsor images using direct Firebase Storage public URLs
 * This bypasses Firebase Auth and uses direct public access
 * 
 * @param imagePath - The image path from sponsor data
 * @returns Promise<string | null> - The public URL or null if not accessible
 */
export async function getSponsorImageUrl(imagePath: string): Promise<string | null> {
  if (!imagePath) {
    return null;
  }

  try {
    // For public images, construct direct public URL
    if (imagePath.startsWith('public/')) {
      const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      if (!bucketName) {
        console.warn('Firebase storage bucket not configured');
        return null;
      }
      
      const encodedPath = encodeURIComponent(imagePath);
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
      
      // Test if the URL is accessible
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' });
        if (response.ok) {
          return publicUrl;
        }
      } catch (fetchError) {
        console.warn('Public URL not accessible, falling back to Firebase SDK:', fetchError);
      }
    }
    
    // Fallback to Firebase SDK method
    return await getImageUrl(imagePath);
    
  } catch (error) {
    console.warn('Failed to get sponsor image URL for:', imagePath, error);
    return null;
  }
}

/**
 * Check if an image path is using the new organized structure
 */
export function isOrganizedImagePath(imagePath: string): boolean {
  return imagePath.startsWith('public/') || imagePath.startsWith('private/');
}

/**
 * Convert legacy Member_Images path to organized public path
 */
export function convertToPublicPath(imagePath: string): string {
  if (imagePath.startsWith('Member_Images/')) {
    return imagePath.replace('Member_Images/', 'public/Member_Images/');
  }
  return imagePath;
}

/**
 * Convert legacy Member_Images path to organized private path
 */
export function convertToPrivatePath(imagePath: string): string {
  if (imagePath.startsWith('Member_Images/')) {
    return imagePath.replace('Member_Images/', 'private/Member_Images/');
  }
  return imagePath;
}