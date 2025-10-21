const functions = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// Enable CORS for all routes
app.use(cors({ origin: true }));

// Parse JSON bodies
app.use(express.json());

// Square payment integration
const { SquareClient, SquareEnvironment } = require('square');

// Initialize Square client
const squareClient = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN || functions.config().square?.access_token,
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? SquareEnvironment.Production : SquareEnvironment.Sandbox
});

const locationId = process.env.SQUARE_LOCATION_ID || functions.config().square?.location_id;

// Conference registration validation
const validateConferenceRegistration = (data) => {
  const errors = [];
  
  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length === 0) {
    errors.push('Full name is required');
  }
  
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }
  
  if (!data.institution || typeof data.institution !== 'string' || data.institution.trim().length === 0) {
    errors.push('Institution is required');
  }
  
  if (!data.membershipStatus || !['member', 'non-member', 'student'].includes(data.membershipStatus)) {
    errors.push('Valid membership status is required');
  }
  
  if (!data.registrationType || typeof data.registrationType !== 'string') {
    errors.push('Registration type is required');
  }
  
  if (!data.agreeToTerms) {
    errors.push('You must agree to the terms and conditions');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
    data: errors.length === 0 ? data : null
  };
};

// Validation schemas (recreated from your existing code)
const validateProfessionalMembershipForm = (data) => {
  const errors = [];
  
  // Basic validation - you can expand this based on your original validation
  if (!data.firstName || typeof data.firstName !== 'string' || data.firstName.trim().length === 0) {
    errors.push('First name is required');
  }
  
  if (!data.lastName || typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }
  
  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }
  
  if (!data.institution || typeof data.institution !== 'string' || data.institution.trim().length === 0) {
    errors.push('Institution is required');
  }
  
  if (!data.membershipType || typeof data.membershipType !== 'string') {
    errors.push('Membership type is required');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
    data: errors.length === 0 ? {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      institution: data.institution.trim(),
      membershipType: data.membershipType,
      phone: data.phone?.trim() || '',
      address: data.address?.trim() || '',
      city: data.city?.trim() || '',
      state: data.state?.trim() || '',
      zipCode: data.zipCode?.trim() || ''
    } : null
  };
};

// Payment creation function (placeholder for Square integration)
const createProfessionalMembershipPayment = async (membershipData, successUrl, failureUrl) => {
  // TODO: Implement Square payment processing
  // For now, return a placeholder success response
  return {
    success: true,
    paymentUrl: successUrl // Redirect directly to success page for testing
  };
};

// Membership API endpoint
app.post('/api/membership', async (req, res) => {
  try {
    const formData = req.body;

    // Validate form data on server side
    const validation = validateProfessionalMembershipForm(formData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Form validation failed',
        error: validation.errors?.join(', ') || 'Invalid form data'
      });
    }

    // Sanitize and prepare data
    const sanitizedData = validation.data;

    // TODO: Store membership application in Firestore
    // This would typically save to a "membershipApplications" collection
    // For now, we'll just log it
    console.log('Membership application received:', {
      name: `${sanitizedData.firstName} ${sanitizedData.lastName}`,
      email: sanitizedData.email,
      institution: sanitizedData.institution,
      membershipType: sanitizedData.membershipType,
      timestamp: new Date().toISOString()
    });

    // Create return URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nhbea-64cab.web.app';
    const successUrl = `${baseUrl}/membership/success/`;
    const failureUrl = `${baseUrl}/membership/failure/`;

    // Create Square payment link
    const paymentResult = await createProfessionalMembershipPayment(
      sanitizedData,
      successUrl,
      failureUrl
    );

    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment link. Please try again.',
        error: paymentResult.error
      });
    }

    return res.json({
      success: true,
      message: 'Application processed successfully. Redirecting to payment...',
      paymentUrl: paymentResult.paymentUrl
    });

  } catch (error) {
    console.error('Error processing membership application:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Nomination validation function (simplified)
const validateNomination = (data) => {
  const errors = [];
  
  if (!data.awardId || typeof data.awardId !== 'string') {
    errors.push('Award ID is required');
  }
  
  if (!data.nomineeInfo || !data.nomineeInfo.name || !data.nomineeInfo.email) {
    errors.push('Nominee name and email are required');
  }
  
  if (!data.nominatorInfo || !data.nominatorInfo.name || !data.nominatorInfo.email) {
    errors.push('Nominator name and email are required');
  }
  
  if (!data.nominationText || data.nominationText.length < 50 || data.nominationText.length > 2000) {
    errors.push('Nomination text must be between 50 and 2000 characters');
  }
  
  if (!data.agreedToTerms) {
    errors.push('You must agree to the terms and conditions');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
    data: errors.length === 0 ? {
      awardId: data.awardId,
      awardCategory: data.awardCategory || '',
      nomineeInfo: {
        name: data.nomineeInfo.name.trim(),
        email: data.nomineeInfo.email.trim().toLowerCase(),
        organization: data.nomineeInfo.organization?.trim() || '',
        position: data.nomineeInfo.position?.trim() || ''
      },
      nominatorInfo: {
        name: data.nominatorInfo.name.trim(),
        email: data.nominatorInfo.email.trim().toLowerCase(),
        organization: data.nominatorInfo.organization?.trim() || '',
        position: data.nominatorInfo.position?.trim() || ''
      },
      nominationText: data.nominationText.trim(),
      supportingDocuments: data.supportingDocuments || [],
      status: 'pending'
    } : null
  };
};

// Nominations API endpoint
app.post('/api/nominations', async (req, res) => {
  try {
    const formData = req.body;

    // Validate form data on server side
    const validation = validateNomination(formData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Form validation failed',
        error: validation.errors?.join(', ') || 'Invalid form data'
      });
    }

    // Sanitize and prepare data
    const sanitizedData = validation.data;

    // Store nomination in Firestore
    const db = admin.firestore();
    const nominationsRef = db.collection('nominations');
    
    const nominationData = {
      awardId: sanitizedData.awardId,
      awardCategory: sanitizedData.awardCategory,
      nomineeInfo: {
        name: sanitizedData.nomineeInfo.name,
        email: sanitizedData.nomineeInfo.email,
        ...(sanitizedData.nomineeInfo.organization && { organization: sanitizedData.nomineeInfo.organization }),
        ...(sanitizedData.nomineeInfo.position && { position: sanitizedData.nomineeInfo.position })
      },
      nominatorInfo: {
        name: sanitizedData.nominatorInfo.name,
        email: sanitizedData.nominatorInfo.email,
        ...(sanitizedData.nominatorInfo.organization && { organization: sanitizedData.nominatorInfo.organization }),
        ...(sanitizedData.nominatorInfo.position && { position: sanitizedData.nominatorInfo.position })
      },
      nominationText: sanitizedData.nominationText,
      status: 'pending',
      submissionDate: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
    const docRef = await nominationsRef.add(nominationData);
    const nominationId = docRef.id;

    // Log successful submission (for monitoring)
    console.log('Award nomination submitted successfully:', {
      nominationId,
      awardId: sanitizedData.awardId,
      nomineeEmail: sanitizedData.nomineeInfo.email,
      nominatorEmail: sanitizedData.nominatorInfo.email,
      timestamp: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'Nomination submitted successfully! Thank you for recognizing excellence in business education.',
      nominationId: nominationId
    });

  } catch (error) {
    console.error('Error processing nomination:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: error?.code
    });
    
    // Return appropriate error response based on error type
    if (error instanceof Error) {
      if (error.message.includes('permission') || error.code === 'permission-denied') {
        return res.status(403).json({
          success: false,
          message: 'Permission denied. Please check your access rights.',
          error: 'Permission error'
        });
      }
      
      if (error.code?.startsWith('firestore/')) {
        return res.status(503).json({
          success: false,
          message: 'Database connection error. Please try again later.',
          error: 'Database error'
        });
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Conference registration endpoint
app.post('/api/conference/register', async (req, res) => {
  try {
    const formData = req.body;

    // Validate form data
    const validation = validateConferenceRegistration(formData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Form validation failed',
        errors: validation.errors
      });
    }

    const sanitizedData = validation.data;
    
    // Store registrant in Firestore first
    const db = admin.firestore();
    const registrantsRef = db.collection('registrants');
    
    const registrantData = {
      conferenceId: sanitizedData.conferenceId,
      conferenceTitle: sanitizedData.conferenceTitle,
      conferenceYear: new Date().getFullYear(),
      participant: {
        fullName: sanitizedData.fullName,
        email: sanitizedData.email.toLowerCase(),
        phone: sanitizedData.phone || '',
        institution: sanitizedData.institution,
        membershipStatus: sanitizedData.membershipStatus
      },
      registration: {
        registrationType: sanitizedData.registrationType,
        registrationDate: admin.firestore.FieldValue.serverTimestamp(),
        totalAmount: sanitizedData.totalAmount,
        paymentStatus: 'pending'
      },
      preferences: {
        dietaryRestrictions: sanitizedData.dietaryRestrictions || '',
        accessibilityNeeds: sanitizedData.accessibilityNeeds || '',
        sessionPreferences: sanitizedData.sessionPreferences || [],
        networkingOptIn: sanitizedData.networkingOptIn || false
      },
      status: 'registered',
      registrationStatus: 'pending',
      paymentStatus: 'pending',
      checkedIn: false,
      communications: {
        confirmationSent: false,
        remindersSent: 0
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save to Firestore
    const docRef = await registrantsRef.add(registrantData);
    const registrantId = docRef.id;

    // Create Square payment link
    try {
      const paymentsApi = squareClient.paymentsApi;
      const checkoutApi = squareClient.checkoutApi;
      
      // Create checkout link
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://nhbea.org';
      
      const createPaymentLinkResponse = await checkoutApi.createPaymentLink({
        idempotencyKey: registrantId, // Use registrant ID for idempotency
        quickPay: {
          name: `Conference Registration - ${sanitizedData.conferenceTitle}`,
          priceMoney: {
            amount: sanitizedData.totalAmount * 100, // Convert to cents
            currency: 'USD'
          },
          locationId: locationId
        },
        checkoutOptions: {
          redirectUrl: `${baseUrl}/conference/success?registrantId=${registrantId}`,
          askForShippingAddress: false,
          merchantSupportEmail: 'support@nhbea.org'
        },
        prePopulatedData: {
          buyerEmail: sanitizedData.email,
          buyerPhoneNumber: sanitizedData.phone
        },
        note: `Conference Registration ID: ${registrantId}`
      });

      if (createPaymentLinkResponse.result.paymentLink) {
        const paymentUrl = createPaymentLinkResponse.result.paymentLink.url;
        
        // Update registrant with payment link ID
        await registrantsRef.doc(registrantId).update({
          'payment.squarePaymentLinkId': createPaymentLinkResponse.result.paymentLink.id,
          'payment.squareOrderId': createPaymentLinkResponse.result.paymentLink.orderId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.json({
          success: true,
          message: 'Registration processed successfully. Redirecting to payment...',
          paymentUrl: paymentUrl,
          registrantId: registrantId
        });
      } else {
        throw new Error('Failed to create payment link');
      }
    } catch (squareError) {
      console.error('Square API error:', squareError);
      
      // Update registrant with error status
      await registrantsRef.doc(registrantId).update({
        paymentStatus: 'error',
        'payment.error': squareError.message || 'Square payment creation failed',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.status(500).json({
        success: false,
        message: 'Failed to create payment link. Please try again.',
        error: 'Payment processing error',
        registrantId: registrantId
      });
    }

  } catch (error) {
    console.error('Error processing conference registration:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Square webhook endpoint to handle payment confirmations
app.post('/api/square/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-square-hmacsha256-signature'];
    const body = JSON.stringify(req.body);
    
    // TODO: Verify webhook signature when webhook secret is configured
    // const webhookSecret = process.env.SQUARE_WEBHOOK_SECRET || functions.config().square?.webhook_secret;
    
    const event = req.body;
    
    if (event.type === 'payment.created' || event.type === 'payment.updated') {
      const payment = event.data.object.payment;
      
      if (payment.status === 'COMPLETED') {
        // Extract registrant ID from the note or reference_id
        const note = payment.note || '';
        const registrantIdMatch = note.match(/Conference Registration ID: (.+)/);
        
        if (registrantIdMatch && registrantIdMatch[1]) {
          const registrantId = registrantIdMatch[1];
          
          // Update registrant payment status
          const db = admin.firestore();
          await db.collection('registrants').doc(registrantId).update({
            paymentStatus: 'paid',
            'payment.squarePaymentId': payment.id,
            'payment.completedAt': admin.firestore.FieldValue.serverTimestamp(),
            'payment.receiptUrl': payment.receipt_url || '',
            'payment.totalAmount': payment.total_money.amount / 100, // Convert from cents
            'registration.paymentStatus': 'paid',
            'communications.confirmationSent': true, // Mark for sending confirmation email
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          
          console.log(`Payment completed for registrant: ${registrantId}`);
        }
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    runtime: 'nodejs20',
    timestamp: new Date().toISOString() 
  });
});

// Export the Express app as a Firebase Function v2 with Node.js 20 runtime
exports.api = onRequest(app);