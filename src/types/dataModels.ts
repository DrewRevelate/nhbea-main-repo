// =============================================
// NHBEA CMS Data Models - Comprehensive Schema
// =============================================

/**
 * Organizations Collection
 * Tracks educational institutions and other organizations
 */
export interface Organization {
  id: string;
  name: string;
  type: 'school' | 'college' | 'university' | 'business' | 'government' | 'nonprofit' | 'other';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  notes?: string;
}

/**
 * Members Collection (Professional Members)
 * Updated to match actual FireCMS data structure with nested fields
 */
export interface Member {
  id: string;
  
  // Personal Information (nested)
  personalInfo: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  };
  
  // Organization Information (reference)
  organization: {
    address: string; // Reference to Organization document
    title: string; // Position/title at organization
  };
  
  // Membership Information (nested)
  membership: {
    type: 'individual' | 'student' | 'retired' | 'honorary';
    membershipYear?: string;
    status: 'active' | 'inactive' | 'suspended' | 'expired';
    renewalDate?: Date;
    autoRenewal: boolean;
    joinDate?: Date;
  };
  
  // Profile Information (nested)
  profile: {
    activeBoardMember: boolean;
    boardPosition?: string; // e.g., "President", "Vice President", "Secretary", "Treasurer"
    boardOrder?: number; // Display order for board members
    bio?: string;
    
    // Past President Information (now nested map)
    past_president?: {
      past_president: boolean;
      year_started?: number;
      year_ended?: number;
    };
    
    // Legacy fields (for backward compatibility)
    isPastPresident?: boolean;
    presidencyTerm?: string; // e.g., "2022-2023"
    presidencyOrder?: number; // 1 = most recent
    
    // Hall of Fame Information
    isHallOfFame?: boolean;
    hallOfFameYear?: number;
    hallOfFameAwardType?: 'business_educator_of_the_year' | 'lifetime_achievement' | 'other';
    hallOfFameOrder?: number;
    achievements?: string[];
  };
  
  // Preferences (nested)
  preferences: {
    emailNotifications: boolean;
    directoryListing: boolean;
    newsletterSubscription: boolean;
  };
  
  // Metadata (nested)
  metadata: {
    updatedAt: Date;
    createdAt: Date;
    createdBy?: string;
  };
}

/**
 * Payment Records (embedded in Member)
 */
export interface PaymentRecord {
  id: string;
  type: 'membership' | 'conference' | 'event' | 'other';
  amount: number;
  currency: string;
  paymentMethod: 'square' | 'check' | 'cash' | 'other';
  paymentDate: Date;
  receiptUrl?: string; // Link to payment receipt
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  // Square payment details
  squarePaymentId?: string;
  squareOrderId?: string;
}

/**
 * Student Applicants Collection
 * For student membership applications pending review
 */
export interface StudentApplicant {
  id: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Educational Information
  organizationId: string; // Reference to Organization (school/college)
  grade?: number; // For K-12 students
  major?: string; // For college students
  graduationYear: number;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Application Information
  applicationDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string; // Member ID who reviewed
  reviewDate?: Date;
  reviewNotes?: string;
  
  // Communication Preferences
  communicationPreferences: {
    newsletter: boolean;
    updates: boolean;
    events: boolean;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Conference Collection
 * Enhanced to support virtual conferences
 */
export interface Conference {
  id: string;
  title: string;
  theme?: string;
  description: string;
  
  // Date and Time
  startDate: Date;
  endDate: Date;
  timezone: string;
  
  // Location/Format Information
  isVirtual: boolean;
  virtualUrl?: string; // Required if isVirtual is true
  venue?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    directions?: string;
  };
  
  // Registration Information
  registrationFee: number;
  currency: string;
  maxCapacity?: number;
  registrationDeadline: Date;
  isRegistrationOpen: boolean;
  
  // Content Information
  agenda?: ConferenceSession[];
  speakers?: ConferenceSpeaker[];
  materials?: ConferenceMaterial[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  notes?: string;
}

/**
 * Conference Sessions (embedded in Conference)
 */
export interface ConferenceSession {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  speakerId?: string;
  sessionType: 'keynote' | 'breakout' | 'workshop' | 'panel' | 'networking';
  virtualRoomUrl?: string; // For virtual sessions
  location?: string; // For in-person sessions
}

/**
 * Conference Speakers (embedded in Conference)
 */
export interface ConferenceSpeaker {
  id: string;
  name: string;
  title?: string;
  organization?: string;
  bio?: string;
  imageUrl?: string;
  email?: string;
}

/**
 * Conference Materials (embedded in Conference)
 */
export interface ConferenceMaterial {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  isPublic: boolean;
}

/**
 * Conference Registrants Collection
 * Enhanced with proper references and payment tracking
 */
export interface ConferenceRegistrant {
  id: string;
  
  // Conference Reference
  conferenceId: string; // Reference to Conference document
  
  // Member Reference (if applicable)
  memberId?: string; // Reference to Member document (null for non-members)
  
  // Guest Registration Information (for non-members)
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    organization?: string;
    position?: string;
  };
  
  // Registration Information
  registrationDate: Date;
  registrationStatus: 'pending' | 'confirmed' | 'cancelled' | 'waitlisted';
  
  // Payment Information
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentAmount: number;
  currency: string;
  paymentDate?: Date;
  receiptUrl?: string; // Link to payment receipt
  
  // Square Payment Details
  squarePaymentId?: string;
  squareOrderId?: string;
  
  // Special Requirements
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  specialRequests?: string;
  
  // Check-in Information
  checkedIn: boolean;
  checkInTime?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

/**
 * Board Members (Legacy - now derived from Members collection)
 * This collection can be deprecated in favor of using Member.isBoardMember
 */
export interface BoardMember {
  id: string;
  memberId: string; // Reference to Member document
  name: string; // Cached for performance
  title: string; // Board position
  bio: string;
  imageURL?: string;
  order: number; // Display order
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

/**
 * Past Presidents Collection
 * Enhanced with member references where applicable
 */
export interface PastPresident {
  id: string;
  memberId?: string; // Reference to Member document (if they're in the system)
  name: string;
  term: string; // e.g., "2022-2023"
  startDate: Date;
  endDate: Date;
  order: number; // 1 = most recent
  bio?: string;
  imageUrl?: string;
  achievements?: string[];
}

/**
 * Hall of Fame Collection
 * Enhanced with member references and awards-based structure
 */
export interface HallOfFameMember {
  id: string;
  memberId?: string; // Reference to Member document (if they're in the system)
  name: string;
  bio?: string;
  imageUrl?: string;
  // Awards-based structure
  activeAwards: Array<{
    awardId: string;
    awardName: string;
    year: number;
    category?: string;
  }>;
  inductionYear: number; // Year of first active award
  totalActiveAwards: number;
  order: number; // Display order based on induction year
}

/**
 * Sponsors Collection (unchanged but included for completeness)
 */
export interface Sponsor {
  id: string;
  name: string;
  logoURL: string;
  website: string;
  sponsorshipLevel: 'platinum' | 'gold' | 'silver' | 'bronze' | 'supporter';
  order: number;
  isActive: boolean;
  contactInfo?: {
    name: string;
    email: string;
    phone?: string;
  };
  sponsorshipDetails?: {
    amount: number;
    startDate: Date;
    endDate: Date;
    benefits: string[];
  };
}

/**
 * Content Collection (unchanged but included for completeness)
 */
export interface ContentPage {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  lastUpdated: Date;
  isPublished: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

/**
 * Newsletter Subscribers Collection (unchanged but included for completeness)
 */
export interface NewsletterSubscriber {
  id: string;
  email: string;
  timestamp: Date;
  status: 'active' | 'pending' | 'unsubscribed';
  memberId?: string; // Reference to Member document (if they're a member)
  source: 'website' | 'manual' | 'import' | 'event';
}

/**
 * Awards Collection
 * Tracks available NHBEA awards for nominations
 */
export interface Award {
  id: string;
  name: string;
  icon?: string;
  description: string;
  eligibility: string;
  deadline: Date;
  category: 'Excellence' | 'Lifetime' | 'Innovation' | 'Service';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Award Nominations Collection
 * Tracks nominations submitted for awards
 */
export interface AwardNomination {
  id: string;
  awardId: string; // Reference to Award document
  nomineeInfo: {
    name: string;
    email?: string;
    organization?: string; // Text field for organization name
    position?: string; // Text field for position/title
  };
  nominatorInfo: {
    name: string;
    email: string;
    organization?: string; // Text field for organization name
    position?: string; // Text field for position/title
    memberId?: string; // Optional reference to Member document
  };
  awardCategory: string;
  nominationText: string;
  supportingDocuments?: string[]; // URLs to uploaded files
  submissionDate: Date;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewNotes?: string;
}

// =============================================
// Helper Types and Enums
// =============================================

export type MembershipStatus = 'active' | 'inactive' | 'suspended' | 'expired';
export type MembershipType = 'professional' | 'student' | 'retired' | 'honorary';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type BoardPosition = 'President' | 'Vice President' | 'Secretary' | 'Treasurer' | 'Board Member' | 'Past President';
export type OrganizationType = 'school' | 'college' | 'university' | 'business' | 'government' | 'nonprofit' | 'other';
export type SponsorshipLevel = 'platinum' | 'gold' | 'silver' | 'bronze' | 'supporter';