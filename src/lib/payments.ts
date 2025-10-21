import { PaymentLinkRequest, PaymentLinkResponse } from '@/types/membership';
import { ConferenceRegistrationFormData } from '@/lib/conferenceValidation';

// Square API configuration
const SQUARE_ENVIRONMENT = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
const SQUARE_APPLICATION_ID = process.env.SQUARE_APPLICATION_ID;
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;

// Square API endpoints
const SQUARE_API_BASE_URL = SQUARE_ENVIRONMENT === 'production' 
  ? 'https://connect.squareup.com' 
  : 'https://connect.squareupsandbox.com';

// Professional membership fee in cents
const PROFESSIONAL_MEMBERSHIP_FEE = 5000; // $50.00

interface SquarePaymentLinkRequest {
  description?: string;
  checkout_options: {
    allow_tipping?: boolean;
    custom_fields?: Array<{
      title: string;
    }>;
    subscription_plan_variation_token?: string;
    redirect_url?: string;
    merchant_support_email?: string;
  };
  payment_note?: string;
  invoice_request_method?: string;
  invoice_recipient?: {
    contact_information: {
      email_address?: string;
      phone_number?: string;
    };
  };
  order_request: {
    order: {
      location_id: string;
      line_items: Array<{
        name: string;
        quantity: string;
        base_price_money: {
          amount: number;
          currency: string;
        };
        variation_name?: string;
      }>;
    };
  };
}

interface SquarePaymentLinkResponse {
  payment_link?: {
    id: string;
    version: number;
    description?: string;
    order_request: any;
    checkout_options: any;
    payment_note?: string;
    url: string;
    long_url: string;
    created_at: string;
    updated_at: string;
  };
  errors?: Array<{
    category: string;
    code: string;
    detail: string;
    field?: string;
  }>;
}

/**
 * Creates a Square payment link for professional membership
 * @param request - Payment link request data
 * @returns Promise<PaymentLinkResponse> with payment URL or error
 */
export async function createMembershipPaymentLink(request: PaymentLinkRequest): Promise<PaymentLinkResponse> {
  try {
    // Validate environment variables
    if (!SQUARE_APPLICATION_ID || !SQUARE_ACCESS_TOKEN) {
      console.error('Missing Square API credentials');
      return {
        success: false,
        error: 'Payment system configuration error'
      };
    }

    // Get location ID (this would typically be stored as an environment variable)
    const locationId = process.env.SQUARE_LOCATION_ID;
    if (!locationId) {
      console.error('Missing Square location ID');
      return {
        success: false,
        error: 'Payment system configuration error'
      };
    }

    // Create the Square payment link request
    const squareRequest: SquarePaymentLinkRequest = {
      description: request.description,
      checkout_options: {
        allow_tipping: false,
        redirect_url: request.returnUrl,
        merchant_support_email: process.env.SUPPORT_EMAIL || 'support@nhbea.org',
        custom_fields: [
          {
            title: 'Member Name'
          },
          {
            title: 'Institution'
          }
        ]
      },
      payment_note: `NHBEA Professional Membership - ${request.membershipData.firstName} ${request.membershipData.lastName}`,
      invoice_recipient: {
        contact_information: {
          email_address: request.membershipData.email,
          phone_number: request.membershipData.phone
        }
      },
      order_request: {
        order: {
          location_id: locationId,
          line_items: [
            {
              name: 'NHBEA Professional Membership (Annual)',
              quantity: '1',
              base_price_money: {
                amount: request.amount,
                currency: request.currency
              },
              variation_name: 'Annual Membership'
            }
          ]
        }
      }
    };

    // Make API request to Square
    const response = await fetch(`${SQUARE_API_BASE_URL}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify(squareRequest)
    });

    const data: SquarePaymentLinkResponse = await response.json();

    if (!response.ok) {
      console.error('Square API error:', data.errors);
      return {
        success: false,
        error: data.errors?.[0]?.detail || 'Failed to create payment link'
      };
    }

    if (data.payment_link) {
      return {
        success: true,
        paymentUrl: data.payment_link.url
      };
    } else {
      console.error('No payment link in Square response:', data);
      return {
        success: false,
        error: 'Failed to create payment link'
      };
    }

  } catch (error) {
    console.error('Error creating Square payment link:', error);
    return {
      success: false,
      error: 'Payment system error'
    };
  }
}

/**
 * Creates a payment link specifically for professional membership
 * @param membershipData - The membership form data
 * @param returnUrl - URL to redirect after successful payment
 * @param cancelUrl - URL to redirect after cancelled payment
 * @returns Promise<PaymentLinkResponse> with payment URL or error
 */
export async function createProfessionalMembershipPayment(
  membershipData: PaymentLinkRequest['membershipData'],
  returnUrl: string,
  cancelUrl: string
): Promise<PaymentLinkResponse> {
  const request: PaymentLinkRequest = {
    amount: PROFESSIONAL_MEMBERSHIP_FEE,
    currency: 'USD',
    description: `NHBEA Professional Membership - ${membershipData.firstName} ${membershipData.lastName}`,
    membershipData,
    returnUrl,
    cancelUrl
  };

  return createMembershipPaymentLink(request);
}

/**
 * Validates Square webhook signature (for future webhook implementation)
 * @param body - Raw request body
 * @param signature - Square signature header
 * @param webhookSignatureKey - Webhook signature key from Square
 * @returns boolean indicating if signature is valid
 */
export function validateSquareWebhookSignature(
  body: string,
  signature: string,
  webhookSignatureKey: string
): boolean {
  try {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', webhookSignatureKey)
      .update(body)
      .digest('base64');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Error validating webhook signature:', error);
    return false;
  }
}

// Conference-specific payment interfaces
interface ConferencePaymentLinkRequest {
  amount: number;
  currency: string;
  description: string;
  conferenceId: string;
  registrationData: ConferenceRegistrationFormData;
  returnUrl: string;
  cancelUrl: string;
}

interface ConferencePaymentLinkResponse {
  success: boolean;
  paymentUrl?: string;
  registrationId?: string;
  error?: string;
}

/**
 * Creates a Square payment link for conference registration
 * @param request - Conference payment link request data
 * @returns Promise<ConferencePaymentLinkResponse> with payment URL or error
 */
export async function createConferencePaymentLink(request: ConferencePaymentLinkRequest): Promise<ConferencePaymentLinkResponse> {
  try {
    // Validate environment variables
    if (!SQUARE_APPLICATION_ID || !SQUARE_ACCESS_TOKEN) {
      console.error('Missing Square API credentials');
      return {
        success: false,
        error: 'Payment system configuration error'
      };
    }

    // Get location ID
    const locationId = process.env.SQUARE_LOCATION_ID;
    if (!locationId) {
      console.error('Missing Square location ID');
      return {
        success: false,
        error: 'Payment system configuration error'
      };
    }

    // Create the Square payment link request
    const squareRequest: SquarePaymentLinkRequest = {
      description: request.description,
      checkout_options: {
        allow_tipping: false,
        redirect_url: request.returnUrl,
        merchant_support_email: process.env.SUPPORT_EMAIL || 'support@nhbea.org',
        custom_fields: [
          {
            title: 'Conference Registration'
          },
          {
            title: 'Institution'
          }
        ]
      },
      payment_note: `Conference Registration - ${request.registrationData.fullName}`,
      invoice_recipient: {
        contact_information: {
          email_address: request.registrationData.email,
          phone_number: request.registrationData.phone
        }
      },
      order_request: {
        order: {
          location_id: locationId,
          line_items: [
            {
              name: request.description,
              quantity: '1',
              base_price_money: {
                amount: Math.round(request.amount * 100), // Convert to cents
                currency: request.currency
              },
              variation_name: `${request.registrationData.registrationType.charAt(0).toUpperCase() + request.registrationData.registrationType.slice(1)} Registration`
            }
          ]
        }
      }
    };

    // Make API request to Square
    const response = await fetch(`${SQUARE_API_BASE_URL}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2023-10-18'
      },
      body: JSON.stringify(squareRequest)
    });

    const data: SquarePaymentLinkResponse = await response.json();

    if (!response.ok) {
      console.error('Square API error:', data.errors);
      return {
        success: false,
        error: data.errors?.[0]?.detail || 'Failed to create payment link'
      };
    }

    if (data.payment_link) {
      return {
        success: true,
        paymentUrl: data.payment_link.url
      };
    } else {
      console.error('No payment link in Square response:', data);
      return {
        success: false,
        error: 'Failed to create payment link'
      };
    }

  } catch (error) {
    console.error('Error creating Square payment link for conference:', error);
    return {
      success: false,
      error: 'Payment system error'
    };
  }
}

/**
 * Creates a conference registration payment link
 * @param conferenceId - The conference ID
 * @param registrationData - The registration form data
 * @param amount - The registration fee amount
 * @param returnUrl - URL to redirect after successful payment
 * @param cancelUrl - URL to redirect after cancelled payment
 * @returns Promise<ConferencePaymentLinkResponse> with payment URL or error
 */
export async function createConferenceRegistrationPayment(
  conferenceId: string,
  registrationData: ConferenceRegistrationFormData,
  amount: number,
  returnUrl: string,
  cancelUrl: string
): Promise<ConferencePaymentLinkResponse> {
  const request: ConferencePaymentLinkRequest = {
    amount,
    currency: 'USD',
    description: `Conference Registration - ${registrationData.fullName}`,
    conferenceId,
    registrationData,
    returnUrl,
    cancelUrl
  };

  return createConferencePaymentLink(request);
}

/**
 * Handles Square webhook notifications (for future implementation)
 * @param webhookData - The webhook payload from Square
 * @returns Promise<boolean> indicating if webhook was processed successfully
 */
export async function handleSquareWebhook(webhookData: any): Promise<boolean> {
  try {
    // This would handle different webhook event types
    // For now, just log the webhook for development
    console.log('Square webhook received:', webhookData);
    
    // Handle different event types
    switch (webhookData.type) {
      case 'payment.created':
        console.log('Payment created:', webhookData.data.object);
        // Update membership status in database
        break;
      case 'payment.updated':
        console.log('Payment updated:', webhookData.data.object);
        // Update payment status
        break;
      default:
        console.log('Unhandled webhook type:', webhookData.type);
    }
    
    return true;
  } catch (error) {
    console.error('Error handling Square webhook:', error);
    return false;
  }
}