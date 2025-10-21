import StudentMembershipFormWrapper from '@/components/StudentMembershipFormWrapper';

export default function StudentMembershipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-primary)] via-[var(--nhbea-royal-blue-subtle)]/20 to-[var(--color-bg-secondary)]">
      {/* Brand-consistent background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-[var(--nhbea-royal-blue)]/10 to-transparent rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-[var(--nhbea-royal-blue-light)]/10 to-transparent rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative container mx-auto px-6 py-12">
        <StudentMembershipFormWrapper />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Student Membership Application - NHBEA',
  description: 'Apply for a free student membership with the New Hampshire Business Educators Association. Join our community of business educators and access professional development opportunities.',
  keywords: 'NHBEA, student membership, business education, New Hampshire, educators, student application',
};