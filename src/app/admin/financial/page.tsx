import { StandardPageLayout } from '@/components/StandardPageLayout';

export default function AdminFinancialPage() {
  return (
    <StandardPageLayout
      meta={{
        title: 'Admin - Financial',
        description: 'Financial management',
        openGraph: true,
        twitterCard: true
      }}
      main={{ id: 'main-content', focusable: true }}
      className="min-h-screen"
    >
      <div className="nhbea-container py-16">
        <h1 className="text-4xl font-bold mb-8">Admin - Financial</h1>
        <p className="text-lg text-gray-700">
          Financial Admin Page content will be added here.
        </p>
      </div>
    </StandardPageLayout>
  );
}
