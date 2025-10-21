'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
  conferenceRegistrationSchema, 
  ConferenceRegistrationFormData,
  sanitizeRegistrationData
} from '@/lib/conferenceValidation';
import { Conference } from '@/types/conference';

interface ConferenceRegistrationFormUXProps {
  conference: Conference;
  onSubmit: (data: ConferenceRegistrationFormData) => Promise<void>;
  isLoading?: boolean;
}

// Step definitions for progressive disclosure
const FORM_STEPS = [
  { 
    id: 'membership', 
    title: 'Membership Status',
    subtitle: 'Help us determine your registration fee',
    icon: '👤',
    fields: ['membershipStatus', 'membershipId']
  },
  { 
    id: 'personal', 
    title: 'Personal Details',
    subtitle: 'Basic information for your registration',
    icon: '📝',
    fields: ['fullName', 'email', 'phone', 'jobTitle', 'institution']
  },
  { 
    id: 'preferences', 
    title: 'Preferences',
    subtitle: 'Dietary needs and networking options',
    icon: '🍽️',
    fields: ['dietaryRestrictions', 'accessibilityNeeds', 'networkingOptIn']
  },
  { 
    id: 'confirmation', 
    title: 'Review & Pay',
    subtitle: 'Confirm your details and complete registration',
    icon: '✅',
    fields: ['agreeToTerms', 'marketingConsent']
  }
];

// Enhanced form field component with better UX
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  options?: Array<{value: string; label: string}>;
  children?: React.ReactNode;
}

function FormField({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  required, 
  helpText, 
  options,
  children 
}: FormFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-[var(--color-text-primary)]">
        {label}
        {required && <span className="text-[var(--nhbea-error)] ml-1">*</span>}
      </label>
      
      {helpText && (
        <p className="text-xs text-[var(--color-text-tertiary)]">{helpText}</p>
      )}
      
      {children || (
        <>
          {type === 'select' && options ? (
            <select
              id={name}
              {...register(name)}
              className="w-full px-4 py-3 border-2 border-[var(--color-border-primary)] rounded-xl bg-white transition-all duration-200 focus:border-[var(--nhbea-royal-blue)] focus:ring-4 focus:ring-[var(--nhbea-royal-blue)]/10 focus:outline-none hover:border-[var(--nhbea-royal-blue)]/50"
            >
              <option value="">Choose...</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              id={name}
              {...register(name)}
              placeholder={placeholder}
              rows={4}
              className="w-full px-4 py-3 border-2 border-[var(--color-border-primary)] rounded-xl bg-white resize-none transition-all duration-200 focus:border-[var(--nhbea-royal-blue)] focus:ring-4 focus:ring-[var(--nhbea-royal-blue)]/10 focus:outline-none hover:border-[var(--nhbea-royal-blue)]/50"
            />
          ) : (
            <input
              type={type}
              id={name}
              {...register(name)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border-2 border-[var(--color-border-primary)] rounded-xl bg-white transition-all duration-200 focus:border-[var(--nhbea-royal-blue)] focus:ring-4 focus:ring-[var(--nhbea-royal-blue)]/10 focus:outline-none hover:border-[var(--nhbea-royal-blue)]/50"
            />
          )}
        </>
      )}
      
      {error && (
        <div className="flex items-center space-x-2 text-[var(--nhbea-error)] text-sm animate-fade-in-up">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error.message as string}</span>
        </div>
      )}
    </div>
  );
}

// Step 1: Membership Status (Most Important for Pricing)
function MembershipStep({ conference }: { conference: Conference }) {
  const { watch, register } = useFormContext<ConferenceRegistrationFormData>();
  const [calculatedFee, setCalculatedFee] = useState<number>(0);
  
  const membershipStatus = watch('membershipStatus');

  useEffect(() => {
    if (membershipStatus) {
      const fees = conference.registration.fees;
      let fee = 0;
      
      if (membershipStatus === 'member') {
        fee = fees.member;
      } else if (membershipStatus === 'non-member') {
        fee = fees.nonMember;
      } else if (membershipStatus === 'student') {
        fee = fees.student;
      }
      
      setCalculatedFee(fee);
    }
  }, [membershipStatus, conference.registration.fees]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Membership Selection Cards */}
      <div className="space-y-4">
        <h3 className="heading-4 text-center mb-6 text-[var(--nhbea-royal-blue)]">What's your membership status?</h3>
        
        <div className="grid gap-4">
          {[
            { 
              value: 'member', 
              label: 'NHBEA Member', 
              price: conference.registration.fees.member,
              popular: true,
              benefits: [
                ...(conference.registration.fees.nonMember - conference.registration.fees.member > 0 ? ['Member discount'] : []),
                'Priority seating', 
                'Networking access'
              ],
              ...(conference.registration.fees.nonMember - conference.registration.fees.member > 0 && {
                savings: conference.registration.fees.nonMember - conference.registration.fees.member
              })
            },
            { 
              value: 'non-member', 
              label: 'Non-Member', 
              price: conference.registration.fees.nonMember,
              benefits: ['Full conference access', 'Materials included', 'Networking opportunities']
            },
            { 
              value: 'student', 
              label: 'Student', 
              price: conference.registration.fees.student,
              benefits: ['Student discount', 'Career networking', 'Mentorship opportunities'],
              ...(conference.registration.fees.nonMember - conference.registration.fees.student > 0 && {
                savings: conference.registration.fees.nonMember - conference.registration.fees.student
              })
            }
          ].map((option, index) => (
            <label
              key={option.value}
              className={`relative block p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                membershipStatus === option.value 
                  ? 'border-[var(--nhbea-royal-blue)] bg-gradient-to-r from-[var(--nhbea-royal-blue)]/5 to-[var(--nhbea-accent-gold)]/5 shadow-lg scale-[1.02]' 
                  : 'border-[var(--color-border-primary)] hover:border-[var(--nhbea-royal-blue)]/50'
              }`}
            >
              {option.popular && (
                <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-[var(--nhbea-accent-gold)] to-[var(--nhbea-accent-gold-light)] text-white text-xs font-bold rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              
              {option.savings && option.savings > 0 && (
                <div className="absolute -top-3 right-6 px-3 py-1 bg-[var(--nhbea-success)] text-white text-xs font-bold rounded-full shadow-md">
                  Save ${option.savings}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="radio"
                    value={option.value}
                    {...register('membershipStatus')}
                    className="w-5 h-5 text-[var(--nhbea-royal-blue)] focus:ring-[var(--nhbea-royal-blue)] transition-all"
                  />
                  <div>
                    <h4 className="heading-5 text-[var(--color-text-primary)]">{option.label}</h4>
                    <ul className="text-sm text-[var(--color-text-secondary)] mt-1 space-y-1">
                      {option.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <svg className="w-3 h-3 text-[var(--nhbea-success)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-[var(--nhbea-royal-blue)]">
                    {option.price === 0 ? 'FREE' : `$${option.price}`}
                  </div>
                  <div className="text-sm text-[var(--color-text-tertiary)]">
                    {option.price === 0 ? '' : 'per person'}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Member ID Field (conditional) */}
      {membershipStatus === 'member' && (
        <div className="animate-fade-in-up bg-[var(--nhbea-royal-blue)]/5 border-2 border-[var(--nhbea-royal-blue)]/20 rounded-xl p-6">
          <FormField
            name="membershipId"
            label="Membership ID"
            placeholder="Enter your NHBEA membership ID"
            required
            helpText="Your membership ID helps us verify your discount eligibility"
          />
        </div>
      )}

      {/* Price Summary */}
      {calculatedFee > 0 && (
        <div className="animate-scale-bounce bg-gradient-to-br from-[var(--nhbea-royal-blue)]/10 to-[var(--nhbea-accent-gold)]/10 border-2 border-[var(--nhbea-royal-blue)]/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--nhbea-success)] to-[var(--nhbea-accent-green)] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h4 className="heading-5 text-[var(--color-text-primary)]">Your Registration Fee</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">Final amount due at checkout</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-[var(--nhbea-royal-blue)]">${calculatedFee}</div>
              <p className="text-sm text-[var(--nhbea-success)] font-medium">Secure payment via Square</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 2: Personal Information
function PersonalStep() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h3 className="heading-4 mb-2 text-[var(--nhbea-royal-blue)]">Tell us about yourself</h3>
        <p className="text-[var(--color-text-secondary)]">
          We'll use this information for your name badge and conference communications
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          name="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          required
        />
        
        <FormField
          name="email"
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          required
          helpText="We'll send your confirmation and updates here"
        />
        
        <FormField
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="(555) 123-4567"
          helpText="Optional - for urgent conference updates only"
        />
        
        <FormField
          name="jobTitle"
          label="Job Title"
          placeholder="Your current position"
        />
      </div>

      <FormField
        name="institution"
        label="Institution/Organization"
        placeholder="School, company, or organization name"
        required
      />
    </div>
  );
}

// Step 3: Preferences
function PreferencesStep() {
  const { register } = useFormContext<ConferenceRegistrationFormData>();
  
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h3 className="heading-4 mb-2 text-[var(--nhbea-royal-blue)]">Help us personalize your experience</h3>
        <p className="text-[var(--color-text-secondary)]">
          Let us know about any special requirements or preferences
        </p>
      </div>

      <div className="space-y-6">
        <FormField
          name="dietaryRestrictions"
          label="Dietary Restrictions"
          type="textarea"
          placeholder="Please list any food allergies, dietary restrictions, or special meal requirements..."
          helpText="This helps us ensure appropriate catering options are available"
        />

        <FormField
          name="accessibilityNeeds"
          label="Accessibility Requirements"
          type="textarea"
          placeholder="Please describe any accommodations you need for the conference..."
          helpText="We're committed to making this event accessible to all participants"
        />

        <div className="bg-gradient-to-r from-[var(--color-bg-secondary)] to-[var(--nhbea-royal-blue)]/5 rounded-xl p-6 border border-[var(--nhbea-royal-blue)]/20">
          <div className="flex items-start space-x-4">
            <input
              type="checkbox"
              id="networkingOptIn"
              {...register('networkingOptIn')}
              className="mt-1 w-5 h-5 text-[var(--nhbea-royal-blue)] rounded focus:ring-[var(--nhbea-royal-blue)] transition-all"
            />
            <div>
              <label htmlFor="networkingOptIn" className="heading-6 text-[var(--color-text-primary)] cursor-pointer">
                Join networking activities
              </label>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Participate in structured networking sessions, roundtables, and connect with other business educators
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4: Confirmation
function ConfirmationStep({ conference }: { conference: Conference }) {
  const { watch, register } = useFormContext<ConferenceRegistrationFormData>();
  const formData = watch();
  
  const fees = conference.registration.fees;
  let calculatedFee = 0;
  
  if (formData.membershipStatus === 'member') {
    calculatedFee = fees.member;
  } else if (formData.membershipStatus === 'non-member') {
    calculatedFee = fees.nonMember;
  } else if (formData.membershipStatus === 'student') {
    calculatedFee = fees.student;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h3 className="heading-4 mb-2 text-[var(--nhbea-royal-blue)]">Review your registration</h3>
        <p className="text-[var(--color-text-secondary)]">
          Please confirm your details before proceeding to secure payment
        </p>
      </div>

      {/* Registration Summary */}
      <div className="bg-white border-2 border-[var(--color-border-primary)] rounded-2xl p-6 shadow-sm">
        <h4 className="heading-5 text-[var(--nhbea-royal-blue)] mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Registration Summary
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div><strong>Name:</strong> {formData.fullName || <em className="text-[var(--color-text-tertiary)]">Not provided</em>}</div>
            <div><strong>Email:</strong> {formData.email || <em className="text-[var(--color-text-tertiary)]">Not provided</em>}</div>
          </div>
          <div className="space-y-2">
            <div><strong>Organization:</strong> {formData.institution || <em className="text-[var(--color-text-tertiary)]">Not provided</em>}</div>
            <div><strong>Membership:</strong> {
              formData.membershipStatus === 'member' ? 'NHBEA Member' :
              formData.membershipStatus === 'non-member' ? 'Non-Member' :
              formData.membershipStatus === 'student' ? 'Student' : <em className="text-[var(--color-text-tertiary)]">Not selected</em>
            }</div>
          </div>
        </div>

        <div className="border-t pt-4 mt-4 flex justify-between items-center">
          <span className="heading-5">Total Amount:</span>
          <span className="heading-2 text-[var(--nhbea-royal-blue)]">${calculatedFee}</span>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-[var(--color-bg-secondary)] to-[var(--nhbea-royal-blue)]/5 rounded-xl p-6 border border-[var(--nhbea-royal-blue)]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--nhbea-success)] to-[var(--nhbea-accent-green)] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h5 className="heading-6">Secure Payment Processing</h5>
              <p className="text-sm text-[var(--color-text-secondary)]">Powered by Square • 256-bit SSL encryption</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {[
              {name: 'VISA', colors: 'from-blue-500 to-blue-600'},
              {name: 'MC', colors: 'from-red-500 to-red-600'},
              {name: 'AMEX', colors: 'from-blue-600 to-blue-700'},
              {name: 'DISC', colors: 'from-orange-500 to-orange-600'}
            ].map(card => (
              <div key={card.name} className={`px-2 py-1 bg-gradient-to-r ${card.colors} text-white text-xs font-bold rounded shadow-sm`}>
                {card.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="bg-[var(--nhbea-warning)]/5 border border-[var(--nhbea-warning)]/30 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              {...register('agreeToTerms')}
              className="mt-1 w-5 h-5 text-[var(--nhbea-royal-blue)] rounded focus:ring-[var(--nhbea-royal-blue)] transition-all"
            />
            <div>
              <label htmlFor="agreeToTerms" className="heading-6 text-[var(--color-text-primary)] cursor-pointer">
                I agree to the terms and conditions <span className="text-[var(--nhbea-error)]">*</span>
              </label>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                I understand the registration fee is non-refundable and agree to the conference code of conduct
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-4 border border-[var(--color-border-primary)]">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="marketingConsent"
              {...register('marketingConsent')}
              className="mt-1 w-5 h-5 text-[var(--nhbea-royal-blue)] rounded focus:ring-[var(--nhbea-royal-blue)] transition-all"
            />
            <div>
              <label htmlFor="marketingConsent" className="heading-6 text-[var(--color-text-primary)] cursor-pointer">
                Keep me updated about future events
              </label>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Receive occasional updates about NHBEA conferences, workshops, and professional development opportunities
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConferenceRegistrationFormUX({
  conference,
  onSubmit,
  isLoading = false
}: ConferenceRegistrationFormUXProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ConferenceRegistrationFormData>({
    resolver: zodResolver(conferenceRegistrationSchema),
    defaultValues: {
      registrationType: 'regular',
      networkingOptIn: false,
      agreeToTerms: false,
      marketingConsent: false,
      sessionPreferences: []
    },
    mode: 'onBlur'
  });

  const { handleSubmit, trigger, formState: { errors } } = methods;

  const nextStep = async () => {
    const currentStepFields = FORM_STEPS[currentStep].fields;
    const isValid = await trigger(currentStepFields as any);
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, FORM_STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleFormSubmit = async (data: ConferenceRegistrationFormData) => {
    try {
      setIsSubmitting(true);
      const sanitizedData = sanitizeRegistrationData(data) as ConferenceRegistrationFormData;
      await onSubmit(sanitizedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100;

  return (
    <FormProvider {...methods}>
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="heading-2 text-[var(--nhbea-royal-blue)] flex items-center">
                <span className="text-2xl mr-3">{FORM_STEPS[currentStep].icon}</span>
                {FORM_STEPS[currentStep].title}
              </h2>
              <p className="text-[var(--color-text-secondary)] mt-1">
                {FORM_STEPS[currentStep].subtitle}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-[var(--nhbea-royal-blue)]">
                Step {currentStep + 1} of {FORM_STEPS.length}
              </div>
              <div className="text-xs text-[var(--color-text-tertiary)]">
                {Math.round(progress)}% complete
              </div>
            </div>
          </div>
          
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="bg-white rounded-2xl shadow-xl border border-[var(--color-border-primary)] p-8 min-h-[600px] relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/5 to-transparent rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[var(--nhbea-accent-gold)]/5 to-transparent rounded-full translate-y-24 -translate-x-24 pointer-events-none" />
            
            <div className="relative z-10">
              {currentStep === 0 && <MembershipStep key="membership" conference={conference} />}
              {currentStep === 1 && <PersonalStep key="personal" />}
              {currentStep === 2 && <PreferencesStep key="preferences" />}
              {currentStep === 3 && <ConfirmationStep key="confirmation" conference={conference} />}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-8 py-3 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Button>

            {currentStep < FORM_STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="px-10 py-4 bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-light)] hover:from-[var(--nhbea-royal-blue-dark)] hover:to-[var(--nhbea-royal-blue)] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Continue
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-10 py-4 bg-gradient-to-r from-[var(--nhbea-success)] to-[var(--nhbea-accent-green)] hover:from-[var(--nhbea-success)]/90 hover:to-[var(--nhbea-accent-green)]/90 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Complete Secure Registration
                  </div>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}