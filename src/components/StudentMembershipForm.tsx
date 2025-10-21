'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentMembershipSchema } from '@/lib/studentApplicationValidation';
import { StudentMembershipFormData } from '@/types/membership';
import { StudentApplicationSubmissionResult } from '@/types/membership';

interface StudentMembershipFormProps {
  onSubmit: (data: StudentMembershipFormData) => Promise<StudentApplicationSubmissionResult>;
  className?: string;
}

export default function StudentMembershipForm({ 
  onSubmit, 
  className = '' 
}: StudentMembershipFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<StudentApplicationSubmissionResult | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<StudentMembershipFormData>({
    resolver: zodResolver(studentMembershipSchema),
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      academicInfo: {
        institution: '',
        major: '',
        graduationYear: new Date().getFullYear(),
        gpa: 0
      },
      essay: '',
      references: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'references'
  });

  const handleFormSubmit = async (data: StudentMembershipFormData) => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const result = await onSubmit(data);
      setSubmissionResult(result);
    } catch (error) {
      console.error('Student application error:', error);
      setSubmissionResult({
        success: false,
        message: 'Something went wrong. Please try again later.',
        error: 'Network error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = (fieldPath: string) => `
    w-full px-4 py-3 rounded-xl border-2 bg-white/60 backdrop-blur-sm
    placeholder:text-slate-400 text-slate-800
    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200 ease-out
    ${getFieldError(fieldPath) ? 'border-red-300 focus:border-red-400 focus:ring-red-500/50' : 'border-slate-200'}
  `;

  const getFieldError = (fieldPath: string) => {
    const pathArray = fieldPath.split('.');
    let error: any = errors;
    for (const key of pathArray) {
      error = error?.[key];
    }
    return error;
  };

  const renderError = (fieldPath: string, id: string) => {
    const error = getFieldError(fieldPath);
    if (!error) return null;
    
    return (
      <p id={id} className="mt-2 text-sm text-red-600" role="alert">
        {error.message}
      </p>
    );
  };

  if (submissionResult?.success) {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        <div className="glass-card p-8 lg:p-12 rounded-2xl backdrop-blur-md bg-white/40 border border-white/50 shadow-lg text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Application Submitted Successfully!</h2>
            <p className="text-lg text-slate-600">{submissionResult.message}</p>
          </div>
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>What happens next?</strong><br />
              Our board will review your application and contact you via email with their decision. 
              This process typically takes 1-2 weeks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          Student Membership Application
        </h1>
        <p className="text-lg text-white max-w-2xl mx-auto">
          Apply for a free student membership with NHBEA. Join our community of business educators 
          and gain access to professional development opportunities, networking, and resources.
        </p>
      </div>

      {/* Form */}
      <div className="glass-card p-8 lg:p-12 rounded-2xl backdrop-blur-md bg-white/40 border border-white/50 shadow-lg">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8" noValidate>
          
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="personalInfo.firstName" className="block text-sm font-medium text-slate-700">
                  First Name *
                </label>
                <input
                  id="personalInfo.firstName"
                  type="text"
                  placeholder="Enter your first name"
                  {...register('personalInfo.firstName')}
                  disabled={isSubmitting}
                  className={inputClassName('personalInfo.firstName')}
                  aria-invalid={errors.personalInfo?.firstName ? 'true' : 'false'}
                  aria-describedby={errors.personalInfo?.firstName ? 'firstName-error' : undefined}
                />
                {renderError('personalInfo.firstName', 'firstName-error')}
              </div>

              <div className="space-y-2">
                <label htmlFor="personalInfo.lastName" className="block text-sm font-medium text-slate-700">
                  Last Name *
                </label>
                <input
                  id="personalInfo.lastName"
                  type="text"
                  placeholder="Enter your last name"
                  {...register('personalInfo.lastName')}
                  disabled={isSubmitting}
                  className={inputClassName('personalInfo.lastName')}
                  aria-invalid={errors.personalInfo?.lastName ? 'true' : 'false'}
                  aria-describedby={errors.personalInfo?.lastName ? 'lastName-error' : undefined}
                />
                {renderError('personalInfo.lastName', 'lastName-error')}
              </div>

              <div className="space-y-2">
                <label htmlFor="personalInfo.email" className="block text-sm font-medium text-slate-700">
                  Email Address *
                </label>
                <input
                  id="personalInfo.email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register('personalInfo.email')}
                  disabled={isSubmitting}
                  className={inputClassName('personalInfo.email')}
                  aria-invalid={errors.personalInfo?.email ? 'true' : 'false'}
                  aria-describedby={errors.personalInfo?.email ? 'email-error' : undefined}
                />
                {renderError('personalInfo.email', 'email-error')}
              </div>

              <div className="space-y-2">
                <label htmlFor="personalInfo.phone" className="block text-sm font-medium text-slate-700">
                  Phone Number *
                </label>
                <input
                  id="personalInfo.phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  {...register('personalInfo.phone')}
                  disabled={isSubmitting}
                  className={inputClassName('personalInfo.phone')}
                  aria-invalid={errors.personalInfo?.phone ? 'true' : 'false'}
                  aria-describedby={errors.personalInfo?.phone ? 'phone-error' : undefined}
                />
                {renderError('personalInfo.phone', 'phone-error')}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="academicInfo.institution" className="block text-sm font-medium text-slate-700">
                  Institution *
                </label>
                <input
                  id="academicInfo.institution"
                  type="text"
                  placeholder="Your college or university"
                  {...register('academicInfo.institution')}
                  disabled={isSubmitting}
                  className={inputClassName('academicInfo.institution')}
                  aria-invalid={errors.academicInfo?.institution ? 'true' : 'false'}
                  aria-describedby={errors.academicInfo?.institution ? 'institution-error' : undefined}
                />
                {renderError('academicInfo.institution', 'institution-error')}
              </div>

              <div className="space-y-2">
                <label htmlFor="academicInfo.major" className="block text-sm font-medium text-slate-700">
                  Major/Field of Study *
                </label>
                <input
                  id="academicInfo.major"
                  type="text"
                  placeholder="Your major or field of study"
                  {...register('academicInfo.major')}
                  disabled={isSubmitting}
                  className={inputClassName('academicInfo.major')}
                  aria-invalid={errors.academicInfo?.major ? 'true' : 'false'}
                  aria-describedby={errors.academicInfo?.major ? 'major-error' : undefined}
                />
                {renderError('academicInfo.major', 'major-error')}
              </div>

              <div className="space-y-2">
                <label htmlFor="academicInfo.graduationYear" className="block text-sm font-medium text-slate-700">
                  Expected Graduation Year *
                </label>
                <input
                  id="academicInfo.graduationYear"
                  type="number"
                  min={new Date().getFullYear()}
                  max={new Date().getFullYear() + 10}
                  placeholder="2025"
                  {...register('academicInfo.graduationYear', { valueAsNumber: true })}
                  disabled={isSubmitting}
                  className={inputClassName('academicInfo.graduationYear')}
                  aria-invalid={errors.academicInfo?.graduationYear ? 'true' : 'false'}
                  aria-describedby={errors.academicInfo?.graduationYear ? 'graduationYear-error' : undefined}
                />
                {renderError('academicInfo.graduationYear', 'graduationYear-error')}
              </div>

              <div className="space-y-2">
                <label htmlFor="academicInfo.gpa" className="block text-sm font-medium text-slate-700">
                  GPA (4.0 scale) *
                </label>
                <input
                  id="academicInfo.gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  placeholder="3.50"
                  {...register('academicInfo.gpa', { valueAsNumber: true })}
                  disabled={isSubmitting}
                  className={inputClassName('academicInfo.gpa')}
                  aria-invalid={errors.academicInfo?.gpa ? 'true' : 'false'}
                  aria-describedby={errors.academicInfo?.gpa ? 'gpa-error' : undefined}
                />
                {renderError('academicInfo.gpa', 'gpa-error')}
              </div>
            </div>
          </div>

          {/* Essay */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Application Essay</h2>
            <div className="space-y-2">
              <label htmlFor="essay" className="block text-sm font-medium text-slate-700">
                Why do you want to join NHBEA? (100-2000 characters) *
              </label>
              <textarea
                id="essay"
                rows={6}
                placeholder="Please describe your interest in business education and how you hope to contribute to and benefit from NHBEA membership..."
                {...register('essay')}
                disabled={isSubmitting}
                className={inputClassName('essay')}
                aria-invalid={errors.essay ? 'true' : 'false'}
                aria-describedby={errors.essay ? 'essay-error' : undefined}
              />
              {renderError('essay', 'essay-error')}
              <p className="text-xs text-slate-500">
                Minimum 100 characters, maximum 2000 characters
              </p>
            </div>
          </div>

          {/* References */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">References (optional, up to 3)</h2>
              {fields.length < 3 && (
                <button
                  type="button"
                  onClick={() => append({ name: '', email: '', relationship: '' })}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  + Add Reference
                </button>
              )}
            </div>
            
            {fields.length === 0 && (
              <div className="text-center py-8 bg-white/10 rounded-xl border-2 border-dashed border-slate-300">
                <p className="text-slate-600 mb-4">
                  References are optional but can strengthen your application
                </p>
                <button
                  type="button"
                  onClick={() => append({ name: '', email: '', relationship: '' })}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Add Your First Reference
                </button>
              </div>
            )}
            
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-slate-200 rounded-xl bg-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-700">Reference {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={isSubmitting}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      aria-label={`Remove reference ${index + 1}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor={`references.${index}.name`} className="block text-sm font-medium text-slate-700">
                        Full Name *
                      </label>
                      <input
                        id={`references.${index}.name`}
                        type="text"
                        placeholder="Reference name"
                        {...register(`references.${index}.name`)}
                        disabled={isSubmitting}
                        className={inputClassName(`references.${index}.name`)}
                        aria-invalid={errors.references?.[index]?.name ? 'true' : 'false'}
                      />
                      {renderError(`references.${index}.name`, `reference-${index}-name-error`)}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`references.${index}.email`} className="block text-sm font-medium text-slate-700">
                        Email Address *
                      </label>
                      <input
                        id={`references.${index}.email`}
                        type="email"
                        placeholder="reference@email.com"
                        {...register(`references.${index}.email`)}
                        disabled={isSubmitting}
                        className={inputClassName(`references.${index}.email`)}
                        aria-invalid={errors.references?.[index]?.email ? 'true' : 'false'}
                      />
                      {renderError(`references.${index}.email`, `reference-${index}-email-error`)}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`references.${index}.relationship`} className="block text-sm font-medium text-slate-700">
                        Relationship *
                      </label>
                      <input
                        id={`references.${index}.relationship`}
                        type="text"
                        placeholder="e.g., Professor, Advisor"
                        {...register(`references.${index}.relationship`)}
                        disabled={isSubmitting}
                        className={inputClassName(`references.${index}.relationship`)}
                        aria-invalid={errors.references?.[index]?.relationship ? 'true' : 'false'}
                      />
                      {renderError(`references.${index}.relationship`, `reference-${index}-relationship-error`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {renderError('references', 'references-error')}
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
              aria-label={isSubmitting ? 'Submitting application...' : 'Submit student membership application'}
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
                  Submitting Application...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>

          {/* Error Messages */}
          {submissionResult && !submissionResult.success && (
            <div 
              className="p-4 rounded-xl bg-red-50/80 border border-red-200 text-red-800"
              role="alert"
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
            By submitting this application, you agree to our privacy policy. 
            Your information will be used solely for membership evaluation and association communications.
          </p>
        </div>
      </div>
    </div>
  );
}