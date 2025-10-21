'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
  conferenceRegistrationSchema, 
  ConferenceRegistrationFormData,
  determineRegistrationType,
  calculateRegistrationFee,
  membershipStatuses,
  sanitizeRegistrationData
} from '@/lib/conferenceValidation';
import { Conference } from '@/types/conference';

interface ConferenceRegistrationFormProps {
  conference: Conference;
  onSubmit: (data: ConferenceRegistrationFormData) => Promise<void>;
  isLoading?: boolean;
}

// US States for dropdown
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function ConferenceRegistrationForm({
  conference,
  onSubmit,
  isLoading = false
}: ConferenceRegistrationFormProps) {
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ConferenceRegistrationFormData>({
    resolver: zodResolver(conferenceRegistrationSchema),
    defaultValues: {
      registrationType: 'regular',
      networkingOptIn: true,
      agreeToTerms: false,
      marketingConsent: false,
      sessionPreferences: []
    }
  });

  // Watch membership status to update pricing
  const membershipStatus = watch('membershipStatus');
  const registrationType = watch('registrationType');

  // Calculate fee when membership status or registration type changes
  React.useEffect(() => {
    if (membershipStatus) {
      const determinedType = determineRegistrationType(
        membershipStatus, 
        conference.registration.fees.earlyBird?.deadline
      );
      setValue('registrationType', determinedType);
      
      const fee = calculateRegistrationFee(
        determinedType,
        membershipStatus,
        conference.registration.fees
      );
      setCalculatedFee(fee);
    }
  }, [membershipStatus, conference.registration.fees, setValue]);

  const handleFormSubmit = async (data: ConferenceRegistrationFormData) => {
    try {
      // Sanitize data before submission
      const sanitizedData = sanitizeRegistrationData(data) as ConferenceRegistrationFormData;
      await onSubmit(sanitizedData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";
  const errorClassName = "text-red-600 text-sm mt-1";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className={labelClassName}>
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              className={inputClassName}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className={errorClassName}>{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={labelClassName}>
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={inputClassName}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className={errorClassName}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className={labelClassName}>
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className={inputClassName}
              placeholder="(555) 123-4567"
            />
            {errors.phone && (
              <p className={errorClassName}>{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="jobTitle" className={labelClassName}>
              Job Title
            </label>
            <input
              id="jobTitle"
              type="text"
              {...register('jobTitle')}
              className={inputClassName}
              placeholder="Your job title"
            />
            {errors.jobTitle && (
              <p className={errorClassName}>{errors.jobTitle.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="institution" className={labelClassName}>
            Institution/Organization *
          </label>
          <input
            id="institution"
            type="text"
            {...register('institution')}
            className={inputClassName}
            placeholder="Your school or organization"
          />
          {errors.institution && (
            <p className={errorClassName}>{errors.institution.message}</p>
          )}
        </div>
      </div>

      {/* Membership Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="membershipStatus" className={labelClassName}>
              Membership Status *
            </label>
            <select
              id="membershipStatus"
              {...register('membershipStatus')}
              className={inputClassName}
            >
              <option value="">Select membership status</option>
              <option value="member">Current NHBEA Member</option>
              <option value="non-member">Non-Member</option>
              <option value="student">Student</option>
            </select>
            {errors.membershipStatus && (
              <p className={errorClassName}>{errors.membershipStatus.message}</p>
            )}
          </div>

          {membershipStatus === 'member' && (
            <div>
              <label htmlFor="membershipId" className={labelClassName}>
                Membership ID *
              </label>
              <input
                id="membershipId"
                type="text"
                {...register('membershipId')}
                className={inputClassName}
                placeholder="Your member ID"
              />
              {errors.membershipId && (
                <p className={errorClassName}>{errors.membershipId.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Registration Fee Display */}
        {calculatedFee > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Registration Fee:</span>
              <span className="text-xl font-bold text-blue-600">${calculatedFee}</span>
            </div>
            {registrationType === 'early_bird' && (
              <p className="text-sm text-green-600 mt-1">
                🎉 Early bird pricing applied!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Address Information (Optional) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information (Optional)</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="address" className={labelClassName}>
              Street Address
            </label>
            <input
              id="address"
              type="text"
              {...register('address')}
              className={inputClassName}
              placeholder="123 Main Street"
            />
            {errors.address && (
              <p className={errorClassName}>{errors.address.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className={labelClassName}>
                City
              </label>
              <input
                id="city"
                type="text"
                {...register('city')}
                className={inputClassName}
                placeholder="City"
              />
              {errors.city && (
                <p className={errorClassName}>{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className={labelClassName}>
                State
              </label>
              <select
                id="state"
                {...register('state')}
                className={inputClassName}
              >
                <option value="">Select state</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && (
                <p className={errorClassName}>{errors.state.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="zipCode" className={labelClassName}>
                ZIP Code
              </label>
              <input
                id="zipCode"
                type="text"
                {...register('zipCode')}
                className={inputClassName}
                placeholder="12345"
              />
              {errors.zipCode && (
                <p className={errorClassName}>{errors.zipCode.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences and Special Requirements */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences & Special Requirements</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="dietaryRestrictions" className={labelClassName}>
              Dietary Restrictions
            </label>
            <textarea
              id="dietaryRestrictions"
              {...register('dietaryRestrictions')}
              className={`${inputClassName} h-20 resize-none`}
              placeholder="Please describe any dietary restrictions or allergies..."
            />
            {errors.dietaryRestrictions && (
              <p className={errorClassName}>{errors.dietaryRestrictions.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="accessibilityNeeds" className={labelClassName}>
              Accessibility Needs
            </label>
            <textarea
              id="accessibilityNeeds"
              {...register('accessibilityNeeds')}
              className={`${inputClassName} h-20 resize-none`}
              placeholder="Please describe any accessibility accommodations needed..."
            />
            {errors.accessibilityNeeds && (
              <p className={errorClassName}>{errors.accessibilityNeeds.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="networkingOptIn"
              type="checkbox"
              {...register('networkingOptIn')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="networkingOptIn" className="ml-2 block text-sm text-gray-700">
              I would like to participate in networking activities
            </label>
          </div>
        </div>
      </div>

      {/* Emergency Contact (Optional) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowEmergencyContact(!showEmergencyContact)}
          >
            {showEmergencyContact ? 'Hide' : 'Add Emergency Contact'}
          </Button>
        </div>

        {showEmergencyContact && (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="emergencyContact.name" className={labelClassName}>
                Name
              </label>
              <input
                id="emergencyContact.name"
                type="text"
                {...register('emergencyContact.name')}
                className={inputClassName}
                placeholder="Contact name"
              />
              {errors.emergencyContact?.name && (
                <p className={errorClassName}>{errors.emergencyContact.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="emergencyContact.phone" className={labelClassName}>
                Phone Number
              </label>
              <input
                id="emergencyContact.phone"
                type="tel"
                {...register('emergencyContact.phone')}
                className={inputClassName}
                placeholder="(555) 123-4567"
              />
              {errors.emergencyContact?.phone && (
                <p className={errorClassName}>{errors.emergencyContact.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="emergencyContact.relationship" className={labelClassName}>
                Relationship
              </label>
              <input
                id="emergencyContact.relationship"
                type="text"
                {...register('emergencyContact.relationship')}
                className={inputClassName}
                placeholder="Spouse, Parent, etc."
              />
              {errors.emergencyContact?.relationship && (
                <p className={errorClassName}>{errors.emergencyContact.relationship.message}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <input
              id="agreeToTerms"
              type="checkbox"
              {...register('agreeToTerms')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
              I agree to the conference terms and conditions, including the refund policy and code of conduct *
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className={errorClassName}>{errors.agreeToTerms.message}</p>
          )}

          <div className="flex items-start">
            <input
              id="marketingConsent"
              type="checkbox"
              {...register('marketingConsent')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="marketingConsent" className="ml-2 block text-sm text-gray-700">
              I would like to receive updates about future NHBEA events and activities
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting || isLoading ? 'Processing...' : `Register for $${calculatedFee}`}
        </Button>
      </div>
    </form>
  );
}