import ProfessionalMembershipFormWrapper from '@/components/ProfessionalMembershipFormWrapper';
import SocialProofSection from '@/components/SocialProofSection';

export default function ProfessionalMembershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-primary)] via-[var(--nhbea-royal-blue-subtle)]/20 to-[var(--color-bg-secondary)]">
      {/* Brand-consistent background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/10 to-transparent rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-[var(--nhbea-royal-blue-light)]/10 to-transparent rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Compact social proof at the top */}
      <SocialProofSection variant="compact" showTestimonials={false} className="relative z-10" />

      <div className="relative container mx-auto px-6 py-12">
        <ProfessionalMembershipFormWrapper />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Professional Membership Application - NHBEA',
  description: 'Join the New Hampshire Business Educators Association as a professional member. Annual membership fee: $50.00.',
  keywords: 'NHBEA, membership, professional, business education, New Hampshire, educators',
};