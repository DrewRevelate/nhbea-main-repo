import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { HomepageContent, ContentSection } from '@/types/content';
import { 
  validateHomepageContent, 
  performContentIntegrityCheck, 
  logContentWarning,
  createSafeContent 
} from './contentValidation';

/**
 * Converts Firebase Timestamps and other complex objects to plain objects
 * to prevent "toJSON" method serialization issues with Client Components
 */
function serializeFirestoreData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (data.toDate && typeof data.toDate === 'function') {
    // Firebase Timestamp
    return data.toDate().toISOString();
  }
  
  if (data.seconds !== undefined && data.nanoseconds !== undefined) {
    // Firebase Timestamp object format
    return new Date(data.seconds * 1000 + data.nanoseconds / 1000000).toISOString();
  }
  
  if (Array.isArray(data)) {
    return data.map(serializeFirestoreData);
  }
  
  if (typeof data === 'object' && data !== null) {
    const serialized: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        serialized[key] = serializeFirestoreData(data[key]);
      }
    }
    return serialized;
  }
  
  return data;
}

export async function getHomepageContent(): Promise<HomepageContent | null> {
  try {
    const docRef = doc(db, 'content', 'homepage');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const rawData = docSnap.data();
      
      // Convert Firebase Timestamps to plain objects
      const data = serializeFirestoreData(rawData);
      
      // Perform content integrity check
      const validationResult = await performContentIntegrityCheck(data, 'homepage');
      
      if (validationResult.warnings.length > 0) {
        logContentWarning('homepage', validationResult.warnings);
      }
      
      if (!validationResult.isValid) {
        logContentWarning('homepage', validationResult.errors);
        // Return fallback content if validation fails
        return null;
      }
      
      // Create safe content with fallbacks for any missing fields
      const safeContent = createSafeContent(data, defaultHomepageContent);
      
      return safeContent;
    } else {
      console.warn('No homepage content found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    throw new Error('Failed to fetch homepage content');
  }
}

export async function getContentSections(): Promise<ContentSection[]> {
  try {
    const q = query(collection(db, 'content'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const sections: ContentSection[] = [];
    
    // Process each document with validation
    for (const docSnapshot of querySnapshot.docs) {
      if (docSnapshot.id !== 'homepage') {
        const rawData = { id: docSnapshot.id, ...docSnapshot.data() };
        
        // Convert Firebase Timestamps to plain objects
        const data = serializeFirestoreData(rawData);
        
        // Perform content integrity check
        const validationResult = await performContentIntegrityCheck(data, 'section');
        
        if (validationResult.warnings.length > 0) {
          logContentWarning(`content section ${docSnapshot.id}`, validationResult.warnings);
        }
        
        if (validationResult.isValid && validationResult.validatedData) {
          sections.push(validationResult.validatedData as ContentSection);
        } else {
          logContentWarning(`content section ${docSnapshot.id}`, validationResult.errors);
          // Skip invalid sections rather than including them
        }
      }
    }
    
    return sections;
  } catch (error) {
    console.error('Error fetching content sections:', error);
    throw new Error('Failed to fetch content sections');
  }
}

// Default content fallback for when Firestore is unavailable
export const defaultHomepageContent: HomepageContent = {
  heroTitle: "New Hampshire Business Educators Association",
  heroSubtitle: "Promoting excellence in business education throughout New Hampshire",
  missionTitle: "Our Mission",
  missionContent: "The New Hampshire Business Educators Association is dedicated to promoting excellence in business education through professional development, networking, and advocacy for educators across the state.",
  aboutTitle: "About NHBEA",
  aboutContent: "Founded to support business educators in New Hampshire, NHBEA provides resources, professional development opportunities, and a community for educators to share best practices and advance the field of business education."
};