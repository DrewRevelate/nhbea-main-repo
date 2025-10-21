import { StandardPageLayout } from '@/components/StandardPageLayout';

export default function MembershipBenefitsPage() {
  return (
    <StandardPageLayout
      meta={{
        title: 'Membership Benefits',
        description: 'Discover the benefits of NHBEA membership',
        openGraph: true,
        twitterCard: true
      }}
      main={{ id: 'main-content', focusable: true }}
      className="min-h-screen"
    >
      <div className="nhbea-container py-16">
        <h1 className="text-4xl font-bold mb-8">Membership Benefits</h1>
        <p className="text-lg text-gray-700">
          Membership Benefits Page content will be added here.
        </p>
      </div>
    </StandardPageLayout>
  );
}
