import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc, increment, serverTimestamp } from 'firebase/firestore';
import { Conference, ConferenceRegistrant } from '@/types/dataModels';
// Legacy types for backward compatibility
import { Conference as LegacyConference, Registrant as LegacyRegistrant } from '@/types/conference';

/**
 * Conference and Registration Management API for NHBEA
 * Enhanced to support new data models with virtual conferences and proper references
 */

// ===============================
// ENHANCED DATA MODEL FUNCTIONS
// ===============================

// Get current active conference using enhanced data model
export async function getCurrentConferenceEnhanced(): Promise<Conference | null> {
  try {
    const currentYear = new Date().getFullYear();
    const q = query(
      collection(db, 'conference'),
      where('isActive', '==', true),
      where('isRegistrationOpen', '==', true),
      orderBy('startDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to Date objects
        startDate: data.startDate?.toDate() || new Date(),
        endDate: data.endDate?.toDate() || new Date(),
        registrationDeadline: data.registrationDeadline?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        agenda: data.agenda?.map((session: any) => ({
          ...session,
          startTime: session.startTime?.toDate() || new Date(),
          endTime: session.endTime?.toDate() || new Date()
        })) || []
      } as LegacyConference;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching current conference (enhanced):', error);
    throw new Error('Failed to fetch current conference');
  }
}

// Get all conference registrants using enhanced data model
export async function getConferenceRegistrantsEnhanced(conferenceId: string): Promise<ConferenceRegistrant[]> {
  try {
    const q = query(
      collection(db, 'registrants'),
      where('conferenceId', '==', conferenceId),
      orderBy('registrationDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const registrants: ConferenceRegistrant[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      registrants.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to Date objects
        registrationDate: data.registrationDate?.toDate() || new Date(),
        paymentDate: data.paymentDate?.toDate(),
        checkInTime: data.checkInTime?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as ConferenceRegistrant);
    });
    
    return registrants;
  } catch (error) {
    console.error('Error fetching conference registrants (enhanced):', error);
    throw new Error('Failed to fetch conference registrants');
  }
}

// Create conference registrant using enhanced data model
export async function createConferenceRegistrantEnhanced(
  registrantData: Omit<ConferenceRegistrant, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const now = new Date();
    const registrantWithMetadata = {
      ...registrantData,
      registrationStatus: 'pending',
      paymentStatus: 'pending',
      checkedIn: false,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'registrants'), registrantWithMetadata);
    return docRef.id;
  } catch (error) {
    console.error('Error creating conference registrant (enhanced):', error);
    throw new Error('Failed to create conference registrant');
  }
}

// Create conference using enhanced data model
export async function createConferenceEnhanced(
  conferenceData: Omit<Conference, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const now = new Date();
    const conferenceWithMetadata = {
      ...conferenceData,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    
    const docRef = await addDoc(collection(db, 'conference'), conferenceWithMetadata);
    return docRef.id;
  } catch (error) {
    console.error('Error creating conference (enhanced):', error);
    throw new Error('Failed to create conference');
  }
}

// Update conference using enhanced data model
export async function updateConferenceEnhanced(
  conferenceId: string, 
  updateData: Partial<Omit<Conference, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    const updateWithMetadata = {
      ...updateData,
      updatedAt: new Date()
    };
    
    const docRef = doc(db, 'conference', conferenceId);
    await updateDoc(docRef, updateWithMetadata);
  } catch (error) {
    console.error('Error updating conference (enhanced):', error);
    throw new Error('Failed to update conference');
  }
}

// ===============================
// LEGACY FUNCTIONS (for backward compatibility)
// ===============================

// Get current active conference
export async function getCurrentConference(): Promise<LegacyConference | null> {
  try {
    const currentYear = new Date().getFullYear();
    const q = query(
      collection(db, 'conference'),
      where('year', '==', currentYear),
      where('status', 'in', ['published', 'registration_open'])
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        schedule: {
          ...data.schedule,
          date: data.schedule?.date?.toDate() || new Date()
        },
        registration: {
          ...data.registration,
          openDate: data.registration?.openDate?.toDate() || new Date(),
          closeDate: data.registration?.closeDate?.toDate() || new Date(),
          fees: {
            ...data.registration?.fees,
            earlyBird: data.registration?.fees?.earlyBird ? {
              ...data.registration.fees.earlyBird,
              deadline: data.registration.fees.earlyBird.deadline?.toDate() || new Date()
            } : undefined
          }
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as LegacyConference;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching current conference:', error);
    throw new Error('Failed to fetch current conference');
  }
}

// Get all conferences
export async function getAllConferences(): Promise<LegacyConference[]> {
  try {
    const q = query(collection(db, 'conference'), orderBy('year', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const conferences: LegacyConference[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      conferences.push({
        id: doc.id,
        ...data,
        schedule: {
          ...data.schedule,
          date: data.schedule?.date?.toDate() || new Date()
        },
        registration: {
          ...data.registration,
          openDate: data.registration?.openDate?.toDate() || new Date(),
          closeDate: data.registration?.closeDate?.toDate() || new Date(),
          fees: {
            ...data.registration?.fees,
            earlyBird: data.registration?.fees?.earlyBird ? {
              ...data.registration.fees.earlyBird,
              deadline: data.registration.fees.earlyBird.deadline?.toDate() || new Date()
            } : undefined
          }
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as Conference);
    });
    
    return conferences;
  } catch (error) {
    console.error('Error fetching conferences:', error);
    throw new Error('Failed to fetch conferences');
  }
}

// Get conference by ID
export async function getConferenceById(conferenceId: string): Promise<LegacyConference | null> {
  try {
    const docRef = doc(db, 'conference', conferenceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        schedule: {
          ...data.schedule,
          date: data.schedule?.date?.toDate() || new Date()
        },
        registration: {
          ...data.registration,
          openDate: data.registration?.openDate?.toDate() || new Date(),
          closeDate: data.registration?.closeDate?.toDate() || new Date(),
          fees: {
            ...data.registration?.fees,
            earlyBird: data.registration?.fees?.earlyBird ? {
              ...data.registration.fees.earlyBird,
              deadline: data.registration.fees.earlyBird.deadline?.toDate() || new Date()
            } : undefined
          }
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as LegacyConference;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching conference by ID:', error);
    throw new Error('Failed to fetch conference');
  }
}

// Create a new conference
export async function createConference(conferenceData: Omit<LegacyConference, 'id' | 'metadata'> & {metadata?: Partial<LegacyConference['metadata']>}): Promise<string> {
  try {
    const now = new Date();
    const conferenceWithMetadata = {
      ...conferenceData,
      registration: {
        ...conferenceData.registration,
        currentCount: 0
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
        featured: false,
        ...conferenceData.metadata
      }
    };
    
    const docRef = await addDoc(collection(db, 'conference'), conferenceWithMetadata);
    return docRef.id;
  } catch (error) {
    console.error('Error creating conference:', error);
    throw new Error('Failed to create conference');
  }
}

// Update an existing conference
export async function updateConference(conferenceId: string, updateData: Partial<Omit<LegacyConference, 'id' | 'metadata'>> & {metadata?: Partial<LegacyConference['metadata']>}): Promise<void> {
  try {
    const docRef = doc(db, 'conference', conferenceId);
    const updateWithMetadata = {
      ...updateData,
      metadata: {
        ...updateData.metadata,
        updatedAt: new Date()
      }
    };
    
    await updateDoc(docRef, updateWithMetadata);
  } catch (error) {
    console.error('Error updating conference:', error);
    throw new Error('Failed to update conference');
  }
}

// REGISTRANT MANAGEMENT

// Get all registrants for a specific conference
export async function getConferenceRegistrants(conferenceId: string): Promise<LegacyRegistrant[]> {
  try {
    const q = query(
      collection(db, 'registrants'),
      where('conferenceId', '==', conferenceId),
      orderBy('registration.registrationDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const registrants: LegacyRegistrant[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      registrants.push({
        id: doc.id,
        ...data,
        registration: {
          ...data.registration,
          registrationDate: data.registration?.registrationDate?.toDate() || new Date(),
          paymentDetails: data.registration?.paymentDetails ? {
            ...data.registration.paymentDetails,
            paidAt: data.registration.paymentDetails.paidAt?.toDate()
          } : undefined
        },
        communications: {
          ...data.communications,
          lastContactDate: data.communications?.lastContactDate?.toDate()
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as LegacyRegistrant);
    });
    
    return registrants;
  } catch (error) {
    console.error('Error fetching conference registrants:', error);
    throw new Error('Failed to fetch conference registrants');
  }
}

// Register a participant for a conference
export async function registerForConference(registrantData: Omit<LegacyRegistrant, 'id' | 'metadata'> & {metadata?: Partial<LegacyRegistrant['metadata']>}): Promise<string> {
  try {
    const now = new Date();
    const registrantWithMetadata = {
      ...registrantData,
      status: 'registered',
      communications: {
        ...registrantData.communications,
        confirmationSent: false,
        remindersSent: 0
      },
      metadata: {
        createdAt: now,
        updatedAt: now,
        source: 'website',
        ...registrantData.metadata
      }
    };
    
    const docRef = await addDoc(collection(db, 'registrants'), registrantWithMetadata);
    
    // Update conference registration count
    await updateConferenceRegistrationCount(registrantData.conferenceId, 1);
    
    return docRef.id;
  } catch (error) {
    console.error('Error registering for conference:', error);
    throw new Error('Failed to register for conference');
  }
}

// Update registrant information
export async function updateRegistrant(registrantId: string, updateData: Partial<Omit<LegacyRegistrant, 'id' | 'metadata'>> & {metadata?: Partial<LegacyRegistrant['metadata']>}): Promise<void> {
  try {
    const docRef = doc(db, 'registrants', registrantId);
    const updateWithMetadata = {
      ...updateData,
      metadata: {
        ...updateData.metadata,
        updatedAt: new Date()
      }
    };
    
    await updateDoc(docRef, updateWithMetadata);
  } catch (error) {
    console.error('Error updating registrant:', error);
    throw new Error('Failed to update registrant');
  }
}

// Cancel a registration
export async function cancelRegistration(registrantId: string): Promise<void> {
  try {
    const registrant = await getRegistrantById(registrantId);
    if (!registrant) {
      throw new Error('Registrant not found');
    }
    
    await updateRegistrant(registrantId, {
      status: 'cancelled',
      metadata: { updatedAt: new Date() }
    });
    
    // Update conference registration count
    await updateConferenceRegistrationCount(registrant.conferenceId, -1);
  } catch (error) {
    console.error('Error cancelling registration:', error);
    throw new Error('Failed to cancel registration');
  }
}

// Get registrant by ID
export async function getRegistrantById(registrantId: string): Promise<LegacyRegistrant | null> {
  try {
    const docRef = doc(db, 'registrants', registrantId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        registration: {
          ...data.registration,
          registrationDate: data.registration?.registrationDate?.toDate() || new Date(),
          paymentDetails: data.registration?.paymentDetails ? {
            ...data.registration.paymentDetails,
            paidAt: data.registration.paymentDetails.paidAt?.toDate()
          } : undefined
        },
        communications: {
          ...data.communications,
          lastContactDate: data.communications?.lastContactDate?.toDate()
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as LegacyRegistrant;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching registrant by ID:', error);
    throw new Error('Failed to fetch registrant');
  }
}

// Update conference registration count (helper function)
async function updateConferenceRegistrationCount(conferenceId: string, incrementValue: number): Promise<void> {
  try {
    const docRef = doc(db, 'conference', conferenceId);
    await updateDoc(docRef, {
      'registration.currentCount': increment(incrementValue)
    });
  } catch (error) {
    console.error('Error updating registration count:', error);
    // Don't throw here to avoid breaking registration flow
  }
}

// Check if registration is available for a conference
export async function checkRegistrationAvailability(conferenceId: string): Promise<{
  isAvailable: boolean;
  spotsRemaining: number;
  registrationStatus: 'open' | 'closed' | 'full' | 'not_started';
}> {
  try {
    const conference = await getConferenceById(conferenceId);
    if (!conference) {
      return {
        isAvailable: false,
        spotsRemaining: 0,
        registrationStatus: 'closed'
      };
    }
    
    const now = new Date();
    const { registration } = conference;
    
    // Check if registration period is active
    if (now < registration.openDate) {
      return {
        isAvailable: false,
        spotsRemaining: registration.capacity - registration.currentCount,
        registrationStatus: 'not_started'
      };
    }
    
    if (now > registration.closeDate || !registration.isOpen) {
      return {
        isAvailable: false,
        spotsRemaining: registration.capacity - registration.currentCount,
        registrationStatus: 'closed'
      };
    }
    
    const spotsRemaining = registration.capacity - registration.currentCount;
    
    if (spotsRemaining <= 0) {
      return {
        isAvailable: registration.waitlistEnabled,
        spotsRemaining: 0,
        registrationStatus: 'full'
      };
    }
    
    return {
      isAvailable: true,
      spotsRemaining,
      registrationStatus: 'open'
    };
  } catch (error) {
    console.error('Error checking registration availability:', error);
    return {
      isAvailable: false,
      spotsRemaining: 0,
      registrationStatus: 'closed'
    };
  }
}

// Registrant creation and management for new registration flow
export async function createRegistrantWithPendingPayment(
  conferenceId: string,
  registrationData: any
): Promise<string> {
  try {
    const now = new Date();
    
    // Create registrant record using the new enhanced data model
    const registrantData: Omit<LegacyRegistrant, 'id' | 'metadata'> = {
      conferenceId,
      conferenceTitle: '', // Will be populated by the API
      conferenceYear: new Date().getFullYear(),
      participant: {
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone || '',
        institution: registrationData.institution,
        membershipId: registrationData.membershipId,
        membershipStatus: registrationData.membershipStatus
      },
      registration: {
        registrationDate: now,
        registrationType: registrationData.registrationType,
        paymentStatus: 'pending',
        totalAmount: 0, // Will be updated by the API based on pricing
        discountApplied: registrationData.registrationType === 'early_bird' ? 'Early Bird' : undefined
      },
      preferences: {
        dietaryRestrictions: registrationData.dietaryRestrictions,
        accessibilityNeeds: registrationData.accessibilityNeeds,
        sessionPreferences: registrationData.sessionPreferences || [],
        networkingOptIn: registrationData.networkingOptIn || false
      },
      status: 'registered',
      communications: {
        confirmationSent: false,
        remindersSent: 0
      }
    };

    const registrantId = await registerForConference(registrantData);
    return registrantId;
  } catch (error) {
    console.error('Error creating registrant with pending payment:', error);
    throw new Error('Failed to create registration record');
  }
}

// Update registrant payment status after successful payment
export async function updateRegistrantPaymentStatus(
  registrantId: string,
  paymentDetails: {
    squareOrderId?: string;
    transactionId?: string;
    paymentMethod: string;
    paidAt: Date;
  }
): Promise<void> {
  try {
    await updateRegistrant(registrantId, {
      registration: {
        paymentStatus: 'paid',
        paymentDetails
      } as any,
      status: 'registered',
      communications: {
        confirmationSent: true,
        remindersSent: 0,
        lastContactDate: new Date()
      }
    });
  } catch (error) {
    console.error('Error updating registrant payment status:', error);
    throw new Error('Failed to update payment status');
  }
}

// Find registrant by payment metadata for confirmation workflow
export async function findRegistrantByPaymentMetadata(
  conferenceId: string,
  searchCriteria: {
    email?: string;
    orderReference?: string;
  }
): Promise<LegacyRegistrant | null> {
  try {
    const registrants = await getConferenceRegistrants(conferenceId);
    
    // Search by email first
    if (searchCriteria.email) {
      const found = registrants.find(r => 
        r.participant.email.toLowerCase() === searchCriteria.email.toLowerCase()
      );
      if (found) return found;
    }
    
    // Search by order reference if provided
    if (searchCriteria.orderReference) {
      const found = registrants.find(r => 
        r.registration.paymentDetails?.squareOrderId === searchCriteria.orderReference ||
        r.registration.paymentDetails?.transactionId === searchCriteria.orderReference
      );
      if (found) return found;
    }
    
    return null;
  } catch (error) {
    console.error('Error finding registrant by payment metadata:', error);
    return null;
  }
}

// Cache management for conference data (1-minute caching as specified)
const CACHE_TIMES = {
  CONFERENCE: 60 // 1 minute in seconds
};

let conferenceCache: {
  data: LegacyConference | null;
  timestamp: number;
} | null = null;

export async function getCachedCurrentConference(): Promise<LegacyConference | null> {
  const now = Date.now();
  
  // Return cached data if it's still valid
  if (conferenceCache && (now - conferenceCache.timestamp) < (CACHE_TIMES.CONFERENCE * 1000)) {
    return conferenceCache.data;
  }
  
  // Fetch fresh data
  try {
    const conference = await getCurrentConference();
    conferenceCache = {
      data: conference,
      timestamp: now
    };
    return conference;
  } catch (error) {
    console.error('Error fetching cached conference:', error);
    // Return stale cache if available, otherwise null
    return conferenceCache?.data || null;
  }
}

// Clear conference cache (useful for admin operations)
export function clearConferenceCache(): void {
  conferenceCache = null;
}

// ===============================
// ENHANCED CONFERENCE FEATURES (Story 3.4)
// ===============================

import { 
  ConferenceAgenda, 
  ConferenceSpeaker, 
  ConferenceFAQ, 
  VenueDetails, 
  SocialMediaConfig,
  ConferenceTheme,
  ConferenceSession
} from '@/types/conference';

// Get conference speakers
export async function getConferenceSpeakers(conferenceId: string): Promise<ConferenceSpeaker[]> {
  try {
    // Check if the subcollection exists first
    const speakersRef = collection(db, `conference/${conferenceId}/speakers`);
    const speakersSnapshot = await getDocs(speakersRef);
    
    if (speakersSnapshot.empty) {
      // No speakers subcollection exists, return empty array
      return [];
    }

    const q = query(
      collection(db, `conference/${conferenceId}/speakers`),
      orderBy('featured', 'desc'),
      orderBy('name', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const speakers: ConferenceSpeaker[] = [];
    querySnapshot.forEach((doc) => {
      speakers.push({
        id: doc.id,
        ...doc.data()
      } as ConferenceSpeaker);
    });
    
    return speakers;
  } catch (error) {
    // Silently handle missing subcollections or permission errors
    console.warn('Conference speakers subcollection not available:', error);
    return [];
  }
}

// Get conference agenda/sessions
export async function getConferenceAgenda(conferenceId: string): Promise<ConferenceAgenda | null> {
  try {
    const sessionsRef = collection(db, `conference/${conferenceId}/sessions`);
    const sessionsSnapshot = await getDocs(sessionsRef);
    
    if (sessionsSnapshot.empty) {
      return null;
    }

    const sessionsQuery = query(
      collection(db, `conference/${conferenceId}/sessions`),
      orderBy('startTime', 'asc')
    );
    const orderedSnapshot = await getDocs(sessionsQuery);
    
    const sessions: ConferenceSession[] = [];
    const tracks = new Set<string>();
    const timeSlots = new Set<string>();
    
    orderedSnapshot.forEach((doc) => {
      const data = doc.data();
      const session: ConferenceSession = {
        id: doc.id,
        ...data,
        startTime: data.startTime?.toDate() || new Date(),
        endTime: data.endTime?.toDate() || new Date()
      };
      
      sessions.push(session);
      tracks.add(session.track);
      
      // Extract time slot
      const startTime = session.startTime;
      const timeSlot = startTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      });
      timeSlots.add(timeSlot);
    });
    
    return {
      sessions,
      tracks: Array.from(tracks).sort(),
      timeSlots: Array.from(timeSlots).sort()
    };
  } catch (error) {
    console.warn('Conference agenda subcollection not available:', error);
    return null;
  }
}

// Get conference FAQs
export async function getConferenceFAQs(conferenceId: string): Promise<ConferenceFAQ[]> {
  try {
    const faqsRef = collection(db, `conference/${conferenceId}/faqs`);
    const faqsSnapshot = await getDocs(faqsRef);
    
    if (faqsSnapshot.empty) {
      return [];
    }

    const q = query(
      collection(db, `conference/${conferenceId}/faqs`),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const faqs: ConferenceFAQ[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      faqs.push({
        id: doc.id,
        ...data,
        lastUpdated: data.lastUpdated?.toDate() || new Date()
      } as ConferenceFAQ);
    });
    
    return faqs;
  } catch (error) {
    console.warn('Conference FAQs subcollection not available:', error);
    return [];
  }
}

// Get venue details
export async function getVenueDetails(conferenceId: string): Promise<VenueDetails | null> {
  try {
    const docRef = doc(db, `conference/${conferenceId}/venue`, 'details');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        nearbyAccommodations: data.nearbyAccommodations?.map((acc: any) => ({
          ...acc,
          bookingDeadline: acc.bookingDeadline?.toDate()
        })) || []
      } as VenueDetails;
    }
    
    return null;
  } catch (error) {
    console.warn('Venue details not available:', error);
    return null;
  }
}

// Get social media configuration
export async function getSocialMediaConfig(conferenceId: string): Promise<SocialMediaConfig | null> {
  try {
    const docRef = doc(db, `conference/${conferenceId}/settings`, 'social');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as SocialMediaConfig;
    }
    
    return null;
  } catch (error) {
    console.warn('Social media config not available:', error);
    return null;
  }
}

// Get conference theme
export async function getConferenceTheme(conferenceId: string): Promise<ConferenceTheme | null> {
  try {
    const docRef = doc(db, `conference/${conferenceId}/settings`, 'theme');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as ConferenceTheme;
    }
    
    return null;
  } catch (error) {
    console.warn('Conference theme not available:', error);
    return null;
  }
}

// Get complete enhanced conference data
export async function getEnhancedConferenceData(conferenceId: string): Promise<LegacyConference & {
  agenda?: ConferenceAgenda;
  speakers?: ConferenceSpeaker[];
  faqs?: ConferenceFAQ[];
  venueDetails?: VenueDetails;
  socialMedia?: SocialMediaConfig;
  theme?: ConferenceTheme;
} | null> {
  try {
    // Get base conference data
    const conference = await getConferenceById(conferenceId);
    if (!conference) return null;
    
    // Fetch all enhanced features in parallel
    const [agenda, speakers, faqs, venueDetails, socialMedia, theme] = await Promise.all([
      getConferenceAgenda(conferenceId),
      getConferenceSpeakers(conferenceId),
      getConferenceFAQs(conferenceId),
      getVenueDetails(conferenceId),
      getSocialMediaConfig(conferenceId),
      getConferenceTheme(conferenceId)
    ]);
    
    return {
      ...conference,
      agenda: agenda || undefined,
      speakers: speakers.length > 0 ? speakers : undefined,
      faqs: faqs.length > 0 ? faqs : undefined,
      venueDetails: venueDetails || undefined,
      socialMedia: socialMedia || undefined,
      theme: theme || undefined
    };
  } catch (error) {
    console.error('Error fetching enhanced conference data:', error);
    return null;
  }
}

// Default fallback conference for development/testing
export const defaultConference: LegacyConference = {
  id: 'conference-2025',
  title: '2025 NHBEA Annual Conference',
  description: 'Join us for our annual conference featuring the latest in business education trends, networking opportunities, and professional development sessions.',
  year: 2025,
  schedule: {
    date: new Date('2025-10-15'),
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'America/New_York'
  },
  location: {
    venue: 'Manchester Downtown Hotel',
    address: {
      street: '700 Elm St',
      city: 'Manchester',
      state: 'NH',
      zipCode: '03101'
    },
    virtualOption: false
  },
  registration: {
    isOpen: true,
    openDate: new Date('2025-07-01'),
    closeDate: new Date('2025-10-10'),
    capacity: 150,
    currentCount: 0,
    waitlistEnabled: true,
    fees: {
      member: 100,
      nonMember: 150,
      student: 50,
      earlyBird: {
        amount: 75,
        deadline: new Date('2025-09-01')
      }
    },
    requiredFields: ['fullName', 'email', 'institution'],
    waitingList: []
  },
  media: {
    imageURL: '/images/conference-2025.jpg'
  },
  status: 'registration_open',
  metadata: {
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system',
    featured: true
  }
};

// ===============================
// REGISTRANTS REPOSITORY (for FireCMS integration)
// ===============================

export interface ConferenceRegistrantData {
  conferenceId: string;
  participantInfo: {
    fullName: string;
    email: string;
    phone?: string;
    institution: string;
    jobTitle?: string;
    membershipId?: string;
    membershipStatus: 'member' | 'non-member' | 'student';
  };
  registrationType: 'regular' | 'early_bird' | 'student' | 'speaker';
  addressInfo?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  sessionPreferences?: string[];
  specialRequests?: string;
  networkingOptIn: boolean;
  marketingConsent: boolean;
  agreeToTerms: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

/**
 * Registrants repository for managing conference registrations in FireCMS
 */
export const registrantsRepository = {
  /**
   * Submit a new conference registration
   */
  async createRegistrant(registrantData: ConferenceRegistrantData): Promise<string> {
    try {
      const registrantsRef = collection(db, 'registrants');
      
      // Clean the data to remove undefined values that might cause Firestore issues
      const cleanData = {
        conferenceId: registrantData.conferenceId,
        participantInfo: {
          fullName: registrantData.participantInfo.fullName,
          email: registrantData.participantInfo.email,
          institution: registrantData.participantInfo.institution,
          membershipStatus: registrantData.participantInfo.membershipStatus,
          ...(registrantData.participantInfo.phone && { phone: registrantData.participantInfo.phone }),
          ...(registrantData.participantInfo.jobTitle && { jobTitle: registrantData.participantInfo.jobTitle }),
          ...(registrantData.participantInfo.membershipId && { membershipId: registrantData.participantInfo.membershipId })
        },
        registrationType: registrantData.registrationType,
        ...(registrantData.addressInfo && {
          addressInfo: {
            ...(registrantData.addressInfo.street && { street: registrantData.addressInfo.street }),
            ...(registrantData.addressInfo.city && { city: registrantData.addressInfo.city }),
            ...(registrantData.addressInfo.state && { state: registrantData.addressInfo.state }),
            ...(registrantData.addressInfo.zipCode && { zipCode: registrantData.addressInfo.zipCode })
          }
        }),
        ...(registrantData.emergencyContact && {
          emergencyContact: {
            ...(registrantData.emergencyContact.name && { name: registrantData.emergencyContact.name }),
            ...(registrantData.emergencyContact.phone && { phone: registrantData.emergencyContact.phone }),
            ...(registrantData.emergencyContact.relationship && { relationship: registrantData.emergencyContact.relationship })
          }
        }),
        ...(registrantData.dietaryRestrictions && { dietaryRestrictions: registrantData.dietaryRestrictions }),
        ...(registrantData.accessibilityNeeds && { accessibilityNeeds: registrantData.accessibilityNeeds }),
        sessionPreferences: registrantData.sessionPreferences || [],
        ...(registrantData.specialRequests && { specialRequests: registrantData.specialRequests }),
        networkingOptIn: registrantData.networkingOptIn,
        marketingConsent: registrantData.marketingConsent,
        agreeToTerms: registrantData.agreeToTerms,
        status: registrantData.status,
        paymentStatus: registrantData.paymentStatus,
        submissionDate: serverTimestamp()
      };
      
      const docRef = await addDoc(registrantsRef, cleanData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating registrant:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        code: (error as any)?.code
      });
      throw new Error('Failed to submit registration');
    }
  },

  /**
   * Get all registrants for a conference
   */
  async getRegistrantsByConference(conferenceId: string): Promise<ConferenceRegistrantData[]> {
    try {
      const registrantsRef = collection(db, 'registrants');
      const q = query(
        registrantsRef,
        where('conferenceId', '==', conferenceId),
        orderBy('submissionDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const registrants: ConferenceRegistrantData[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        registrants.push({
          ...data,
          submissionDate: data.submissionDate?.toDate() || new Date()
        } as ConferenceRegistrantData);
      });
      
      return registrants;
    } catch (error) {
      console.error('Error fetching registrants:', error);
      throw new Error('Failed to fetch registrants');
    }
  },

  /**
   * Update registrant status (for admin use)
   */
  async updateRegistrantStatus(registrantId: string, status: ConferenceRegistrantData['status']): Promise<void> {
    try {
      const docRef = doc(db, 'registrants', registrantId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating registrant status:', error);
      throw new Error('Failed to update registrant status');
    }
  },

  /**
   * Update payment status (for payment processing)
   */
  async updatePaymentStatus(registrantId: string, paymentStatus: ConferenceRegistrantData['paymentStatus']): Promise<void> {
    try {
      const docRef = doc(db, 'registrants', registrantId);
      await updateDoc(docRef, {
        paymentStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }
};