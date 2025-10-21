export interface SiteSettings {
  // Document ID: "global" (single document)
  
  // Site Identity
  identity: {
    siteName: string;
    tagline: string;
    description: string;
    logoURL?: string;
    faviconURL?: string;
  };
  
  // Contact Information
  contact: {
    primaryEmail: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  
  // Social Media
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  
  // Content Settings
  content: {
    footerText: string;
    copyrightText: string;
    privacyPolicyURL?: string;
    termsOfServiceURL?: string;
  };
  
  // Feature Flags
  features: {
    membershipEnabled: boolean;
    conferenceRegistrationEnabled: boolean;
    nominationsEnabled: boolean;
    publicDirectoryEnabled: boolean;
    maintenanceMode: boolean;
  };
  
  // System Configuration
  system: {
    timezone: string;
    dateFormat: string;
    currency: string;
    analyticsId?: string;
  };
  
  // Metadata
  metadata: {
    updatedAt: Date;
    updatedBy: string;
    version: string;
  };
}

// Utility type for site settings updates
export type UpdateSiteSettingsData = Partial<Omit<SiteSettings, 'metadata'>> & {
  metadata?: Partial<SiteSettings['metadata']>;
};