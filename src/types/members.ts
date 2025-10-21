export interface Member {
  // Document ID: auto-generated or custom member ID
  
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    preferredName?: string;
  };
  
  // Membership Details
  membership: {
    type: 'individual' | 'institutional' | 'student' | 'honorary';
    status: 'active' | 'inactive' | 'pending' | 'expired';
    joinDate: Date;
    renewalDate: Date;
    membershipYear: string; // "2025"
    autoRenewal: boolean;
  };
  
  // Professional Information
  organization: {
    name: string;
    position: string;
    title?: string;
    website?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  
  // System Fields
  profile: {
    imageURL?: string;
    bio?: string;
    activeBoardMember: boolean;
    boardPosition?: string;
    boardOrder?: number;
  };
  
  // Preferences & Settings
  preferences: {
    emailNotifications: boolean;
    directoryListing: boolean;
    newsletterSubscription: boolean;
  };
  
  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    lastLoginAt?: Date;
  };
}

// Legacy interface for backward compatibility during migration
export interface LegacyBoardMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageURL?: string;
  order?: number;
}

// Utility type for member creation
export type CreateMemberData = Omit<Member, 'metadata'> & {
  metadata?: Partial<Member['metadata']>;
};

// Utility type for member updates - allows partial nested objects
export type UpdateMemberData = {
  personalInfo?: Partial<Member['personalInfo']>;
  membership?: Partial<Member['membership']>;
  organization?: Partial<Member['organization']>;
  profile?: Partial<Member['profile']>;
  preferences?: Partial<Member['preferences']>;
  metadata?: Partial<Member['metadata']>;
};