export interface ProfessionalMembershipFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Professional Information
  institution: string;
  position: string;
  yearsExperience: number;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Membership Information
  membershipType: 'new' | 'renewal';
  previousMemberNumber?: string;
  
  // Preferences
  communicationPreferences: {
    newsletter: boolean;
    updates: boolean;
    events: boolean;
  };
}

export interface MembershipSubmissionResult {
  success: boolean;
  message: string;
  error?: string;
  paymentUrl?: string;
}

export interface ProfessionalMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  institution: string;
  position: string;
  yearsExperience: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  membershipType: 'new' | 'renewal';
  previousMemberNumber?: string;
  communicationPreferences: {
    newsletter: boolean;
    updates: boolean;
    events: boolean;
  };
  status: 'pending' | 'active' | 'expired';
  paymentStatus: 'pending' | 'completed' | 'failed';
  joinDate: Date;
  expirationDate: Date;
  memberNumber: string;
}

export interface PaymentLinkRequest {
  amount: number;
  currency: string;
  description: string;
  membershipData: ProfessionalMembershipFormData;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentLinkResponse {
  success: boolean;
  paymentUrl?: string;
  error?: string;
}

// Student Membership Types
export interface StudentMembershipFormData {
  // Personal Information  
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  
  // Academic Information
  academicInfo: {
    institution: string;
    major: string;
    graduationYear: number;
    gpa: number;
  };
  
  // Application Essay
  essay: string;
  
  // References
  references: Array<{
    name: string;
    email: string;
    relationship: string;
  }>;
}

export interface StudentApplicationSubmissionResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface StudentApplicant {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  academicInfo: {
    institution: string;
    major: string;
    graduationYear: number;
    gpa: number;
  };
  essay: string;
  references: Array<{
    name: string;
    email: string;
    relationship: string;
  }>;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
}