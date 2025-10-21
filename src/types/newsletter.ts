export interface NewsletterSubscriber {
  email: string;
  timestamp: Date;
  status: 'active' | 'pending' | 'unsubscribed' | 'bounced';
  source: 'website' | 'manual' | 'import' | 'social_media' | 'api';
}

export interface NewsletterFormData {
  email: string;
}

export interface NewsletterSubmissionResult {
  success: boolean;
  message: string;
  error?: string;
}