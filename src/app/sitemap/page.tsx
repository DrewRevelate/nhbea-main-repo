import { StandardPageLayout } from '@/components/StandardPageLayout';

export default function SitemapPage() {
  return (
    <StandardPageLayout
      meta={{
        title: 'Sitemap',
        description: 'Complete site navigation for NHBEA.org',
        openGraph: true,
        twitterCard: true
      }}
      main={{ id: 'main-content', focusable: true }}
      className="min-h-screen"
    >
      <div className="nhbea-container py-16">
        <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
        <p className="text-lg text-gray-700">
          Sitemap Page content will be added here.
        </p>
      </div>
    </StandardPageLayout>
  );
}
