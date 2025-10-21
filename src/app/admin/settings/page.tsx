import { StandardPageLayout } from '@/components/StandardPageLayout';

export default function AdminSettingsPage() {
  return (
    <StandardPageLayout
      meta={{
        title: 'Admin - Settings',
        description: 'Application settings',
        openGraph: true,
        twitterCard: true
      }}
      main={{ id: 'main-content', focusable: true }}
      className="min-h-screen"
    >
      <div className="nhbea-container py-16">
        <h1 className="text-4xl font-bold mb-8">Admin - Settings</h1>
        <p className="text-lg text-gray-700">
          Settings Admin Page content will be added here.
        </p>
      </div>
    </StandardPageLayout>
  );
}
