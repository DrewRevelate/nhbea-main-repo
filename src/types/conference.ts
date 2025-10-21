export interface Conference {
  // Document ID: conference-2025, conference-2026, etc.
  id: string;
  
  // Basic Information
  title: string;
  description: string;
  year: number;
  
  // Event Details
  schedule: {
    date: Date;
    startTime: string; // "09:00"
    endTime: string;   // "17:00"
    timezone: string;  // "America/New_York"
  };
  
  // Location
  location: {
    venue: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    virtualOption?: boolean;
    virtualLink?: string;
  };
  
  // Registration Management
  registration: {
    isOpen: boolean;
    openDate: Date;
    closeDate: Date;
    capacity: number;
    currentCount: number; // Maintained via Cloud Functions
    waitlistEnabled: boolean;
    
    // Pricing
    fees: {
      member: number;
      nonMember: number;
      student: number;
      earlyBird?: {
        amount: number;
        deadline: Date;
      };
    };
    
    // Requirements
    requiredFields: string[];
    waitingList: string[]; // Array of member IDs
  };
  
  // Content & Media
  media: {
    imageURL?: string;
    brochureURL?: string;
    programURL?: string;
  };
  
  // Enhanced Conference Features for Story 3.4
  agenda?: ConferenceAgenda;
  speakers?: ConferenceSpeaker[];
  faqs?: ConferenceFAQ[];
  venueDetails?: VenueDetails;
  socialMedia?: SocialMediaConfig;
  theme?: ConferenceTheme;

  // AI/Automation Hints
  aiHint?: string; // For automated content generation
  
  // Status Management
  status: 'draft' | 'published' | 'registration_open' | 'registration_closed' | 'completed' | 'cancelled';
  
  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    featured: boolean;
  };
}

export interface Registrant {
  // Document ID: auto-generated
  id: string;
  
  // Conference Reference
  conferenceId: string;
  conferenceTitle: string; // Denormalized for easy queries
  conferenceYear: number;
  
  // Registrant Information
  participant: {
    fullName: string;
    email: string;
    phone?: string;
    institution: string;
    membershipId?: string; // Link to members collection
    membershipStatus: 'member' | 'non-member' | 'student';
  };
  
  // Registration Details
  registration: {
    registrationDate: Date;
    registrationType: 'regular' | 'early_bird' | 'student' | 'speaker';
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'cancelled';
    totalAmount: number;
    discountApplied?: string;
    
    // Payment Integration
    paymentDetails?: {
      squareOrderId?: string;
      transactionId?: string;
      paymentMethod: string;
      paidAt?: Date;
    };
  };
  
  // Preferences
  preferences: {
    dietaryRestrictions?: string;
    accessibilityNeeds?: string;
    sessionPreferences?: string[];
    networkingOptIn: boolean;
  };
  
  // Status Tracking
  status: 'registered' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show';
  
  // Communication Log
  communications: {
    confirmationSent: boolean;
    remindersSent: number;
    lastContactDate?: Date;
  };
  
  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    source: 'website' | 'admin' | 'import';
  };
}

// Utility types for conference operations
export type CreateConferenceData = Omit<Conference, 'id' | 'metadata'> & {
  metadata?: Partial<Conference['metadata']>;
};

export type UpdateConferenceData = Partial<Omit<Conference, 'id' | 'metadata'>> & {
  metadata?: Partial<Conference['metadata']>;
};

export type CreateRegistrantData = Omit<Registrant, 'id' | 'metadata'> & {
  metadata?: Partial<Registrant['metadata']>;
};

export type UpdateRegistrantData = Partial<Omit<Registrant, 'id' | 'metadata'>> & {
  metadata?: Partial<Registrant['metadata']>;
};

// Enhanced Conference Features - Story 3.4

export interface ConferenceAgenda {
  sessions: ConferenceSession[];
  tracks: string[];
  timeSlots: string[];
}

export interface ConferenceSession {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  track: string;
  type: 'keynote' | 'workshop' | 'panel' | 'networking' | 'break';
  speaker?: string; // Speaker ID reference
  speakers?: string[]; // Multiple speaker IDs for panels
  room?: string;
  capacity?: number;
  learningObjectives?: string[];
  materials?: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  tags?: string[];
}

export interface ConferenceSpeaker {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  photoURL?: string;
  linkedInURL?: string;
  twitterHandle?: string;
  websiteURL?: string;
  expertise: string[];
  sessionIds: string[]; // References to sessions they're speaking at
  isKeynote: boolean;
  featured: boolean;
}

export interface ConferenceFAQ {
  id: string;
  category: 'registration' | 'venue' | 'sessions' | 'accommodation' | 'general';
  question: string;
  answer: string;
  order: number;
  tags?: string[];
  lastUpdated: Date;
}

export interface VenueDetails {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  facilities: VenueFacility[];
  accessibility: AccessibilityInfo;
  parking: ParkingInfo;
  nearbyAccommodations: AccommodationInfo[];
  transportation: TransportationInfo;
  photos?: string[];
  website?: string;
  phone?: string;
}

export interface VenueFacility {
  name: string;
  description: string;
  available: boolean;
  iconName?: string;
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  elevatorAccess: boolean;
  accessibleParking: boolean;
  accessibleRestrooms: boolean;
  hearingLoopAvailable: boolean;
  signLanguageInterpreter: boolean;
  largeTextMaterials: boolean;
  additionalNotes?: string;
}

export interface ParkingInfo {
  available: boolean;
  free: boolean;
  cost?: number;
  spaces: number;
  validationAvailable: boolean;
  alternatives?: string[];
  notes?: string;
}

export interface AccommodationInfo {
  name: string;
  type: 'hotel' | 'inn' | 'b&b';
  distanceFromVenue: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  website?: string;
  phone?: string;
  specialRates?: boolean;
  bookingDeadline?: Date;
  amenities: string[];
}

export interface TransportationInfo {
  publicTransit: boolean;
  airportShuttles: string[];
  rideshareRecommended: boolean;
  walkingDistance: {
    fromDowntown: string;
    fromStation: string;
  };
  drivingDirections?: string;
}

export interface SocialMediaConfig {
  hashtag: string;
  twitterHandle?: string;
  linkedInPage?: string;
  instagramHandle?: string;
  enableTwitterFeed: boolean;
  enableInstagramFeed: boolean;
  enableSocialSharing: boolean;
  liveUpdatesEnabled: boolean;
}

export interface ConferenceTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundGradient?: {
    from: string;
    to: string;
  };
  typography?: {
    headingFont?: string;
    bodyFont?: string;
  };
  logoURL?: string;
  brandingElements: {
    shapingTheFuture: boolean;
    animatedElements: boolean;
    customCSS?: string;
  };
}