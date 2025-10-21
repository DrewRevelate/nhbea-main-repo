'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { professionalMembershipSchema, type ProfessionalMembershipFormData } from '@/lib/membershipValidation';
import { MembershipSubmissionResult } from '@/types/membership';
import FormField from '@/components/FormField';
import FormSelect from '@/components/FormSelect';
import FormCheckbox from '@/components/FormCheckbox';

// US states for dropdown
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

interface ProfessionalMembershipFormProps {
  onSubmit: (data: ProfessionalMembershipFormData) => Promise<MembershipSubmissionResult>;
  className?: string;
}

export default function ProfessionalMembershipForm({ 
  onSubmit, 
  className = '' 
}: ProfessionalMembershipFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<MembershipSubmissionResult | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<ProfessionalMembershipFormData>({
    resolver: zodResolver(professionalMembershipSchema) as any,
    defaultValues: {
      communicationPreferences: {
        newsletter: true,
        updates: true,
        events: true
      },
      membershipType: 'new'
    }
  });

  const membershipType = watch('membershipType');

  const handleFormSubmit = async (data: ProfessionalMembershipFormData) => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const result = await onSubmit(data);
      setSubmissionResult(result);

      if (result.success && result.paymentUrl) {
        // Redirect to payment URL
        window.location.href = result.paymentUrl;
      }
    } catch (error) {
      console.error('Membership application error:', error);
      setSubmissionResult({
        success: false,
        message: 'Something went wrong. Please try again later.',
        error: 'Network error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={`nhbea-container ${className}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          Professional Membership Application
        </h1>
        <p className="nhbea-text-large max-w-2xl mx-auto text-white">
          Join the New Hampshire Business Educators Association and connect with fellow educators 
          across the state. Annual membership fee: $50.00
        </p>
      </div>

      {/* Form */}
      <div className="nhbea-card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8" noValidate>
          
          {/* Membership Type */}
          <div className="nhbea-form-group">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Membership Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="new"
                  {...register('membershipType')}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-primary nhbea-focus-ring"
                />
                <span className="text-gray-900">New Membership</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="renewal"
                  {...register('membershipType')}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-primary nhbea-focus-ring"
                />
                <span className="text-gray-900">Membership Renewal</span>
              </label>
            </div>
            {errors.membershipType && (
              <p className="text-red-600 text-sm mt-1" role="alert">
                {errors.membershipType.message}
              </p>
            )}
          </div>

          {/* Previous Member Number (only for renewals) */}
          {membershipType === 'renewal' && (
            <FormField
              label="Previous Member Number"
              required
              error={errors.previousMemberNumber}
              helpText="Find this on your previous membership card or confirmation email"
              placeholder="Enter your previous member number"
              successMessage="Member number validated"
              disabled={isSubmitting}
              {...register('previousMemberNumber')}
            />
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                required
                error={errors.firstName}
                helpText="Your legal first name"
                placeholder="Enter your first name"
                successMessage="First name captured"
                disabled={isSubmitting}
                {...register('firstName')}
              />

              <FormField
                label="Last Name"
                required
                error={errors.lastName}
                helpText="Your legal last name"
                placeholder="Enter your last name"
                successMessage="Last name captured"
                disabled={isSubmitting}
                {...register('lastName')}
              />

              <FormField
                label="Email Address"
                type="email"
                required
                error={errors.email}
                helpText="We'll use this for membership communications"
                placeholder="your@email.com"
                successMessage="Valid email address"
                disabled={isSubmitting}
                {...register('email')}
              />

              <FormField
                label="Phone Number"
                type="tel"
                required
                error={errors.phone}
                helpText="Include area code (e.g., 555-123-4567)"
                placeholder="(555) 123-4567"
                successMessage="Phone number captured"
                disabled={isSubmitting}
                {...register('phone')}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Institution"
                required
                error={errors.institution}
                helpText="Your school, college, or organization"
                placeholder="School, college, or organization"
                successMessage="Institution captured"
                disabled={isSubmitting}
                {...register('institution')}
              />

              <FormField
                label="Position/Title"
                required
                error={errors.position}
                helpText="Your current job title"
                placeholder="Your job title or position"
                successMessage="Position captured"
                disabled={isSubmitting}
                {...register('position')}
              />

              <div className="md:col-span-2">
                <FormField
                  label="Years of Experience in Education"
                  type="number"
                  min="0"
                  max="70"
                  required
                  error={errors.yearsExperience}
                  helpText="Total years in business education"
                  placeholder="Enter years of experience"
                  successMessage="Experience captured"
                  disabled={isSubmitting}
                  {...register('yearsExperience', { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
            <div className="space-y-4">
              <FormField
                label="Street Address"
                required
                error={errors.address}
                helpText="Your mailing address"
                placeholder="Enter your street address"
                successMessage="Address captured"
                disabled={isSubmitting}
                {...register('address')}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="City"
                  required
                  error={errors.city}
                  helpText="Your city"
                  placeholder="Enter your city"
                  successMessage="City captured"
                  disabled={isSubmitting}
                  {...register('city')}
                />

                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      {...field}
                      label="State"
                      required
                      error={errors.state}
                      helpText="Select your state"
                      options={US_STATES}
                      placeholder="Select state"
                      successMessage="State selected"
                      disabled={isSubmitting}
                    />
                  )}
                />

                <FormField
                  label="ZIP Code"
                  required
                  error={errors.zipCode}
                  helpText="5-digit ZIP code"
                  placeholder="12345"
                  successMessage="ZIP code captured"
                  disabled={isSubmitting}
                  {...register('zipCode')}
                />
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Communication Preferences</h2>
            <p className="text-sm text-gray-600">
              Select how you'd like to receive communications from NHBEA:
            </p>
            <div className="space-y-3">
              <FormCheckbox
                label={
                  <div>
                    <span className="text-gray-900 font-medium">Newsletter</span>
                    <p className="text-sm text-gray-600">Receive our monthly newsletter with updates and resources</p>
                  </div>
                }
                disabled={isSubmitting}
                {...register('communicationPreferences.newsletter')}
              />

              <FormCheckbox
                label={
                  <div>
                    <span className="text-gray-900 font-medium">General Updates</span>
                    <p className="text-sm text-gray-600">Important announcements and association news</p>
                  </div>
                }
                disabled={isSubmitting}
                {...register('communicationPreferences.updates')}
              />

              <FormCheckbox
                label={
                  <div>
                    <span className="text-gray-900 font-medium">Event Notifications</span>
                    <p className="text-sm text-gray-600">Conference announcements and professional development opportunities</p>
                  </div>
                }
                disabled={isSubmitting}
                {...register('communicationPreferences.events')}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 rounded-xl font-semibold text-white text-lg
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-700 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white/50
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600
                transition-all duration-200 ease-out
                shadow-lg hover:shadow-xl
                transform hover:scale-105 disabled:hover:scale-100
                [will-change:transform]"
              aria-label={isSubmitting ? 'Processing membership application...' : 'Submit application and proceed to payment'}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-3">
                  <svg 
                    className="animate-spin h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Application...
                </span>
              ) : (
                'Submit Application & Pay Dues ($50.00)'
              )}
            </button>
          </div>

          {/* Success/Error Messages */}
          {submissionResult && !submissionResult.paymentUrl && (
            <div 
              className={`p-4 rounded-xl ${
                submissionResult.success 
                  ? 'bg-green-50/80 border border-green-200 text-green-800' 
                  : 'bg-red-50/80 border border-red-200 text-red-800'
              }`}
              role={submissionResult.success ? 'status' : 'alert'}
              aria-live="polite"
            >
              <p className="font-medium">
                {submissionResult.message}
              </p>
            </div>
          )}
        </form>

        {/* Privacy Notice */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            By submitting this application, you agree to our privacy policy and terms of service. 
            Your information will be used solely for membership purposes and association communications.
          </p>
        </div>
      </div>
    </div>
  );
}