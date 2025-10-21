import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// TODO: Replace with actual Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;

/**
 * Convert a Firebase Storage URL to a public URL without authentication tokens
 * This is specifically for images stored in the /public/ path that should be publicly accessible
 */
export function getPublicStorageUrl(url: string): string {
  if (!url) return url;
  
  // Check if it's already a Firebase Storage URL
  if (url.includes('firebasestorage.googleapis.com')) {
    // Remove any existing token parameter to make it truly public
    const urlWithoutToken = url.split('&token=')[0].split('?token=')[0];
    
    // Ensure it uses ?alt=media for direct access (no authentication required for /public/ paths)
    if (!urlWithoutToken.includes('?alt=media')) {
      return urlWithoutToken + (urlWithoutToken.includes('?') ? '&alt=media' : '?alt=media');
    }
    return urlWithoutToken;
  }
  
  // Return the original URL if it's not a Firebase Storage URL
  return url;
}