import { StandardPageLayout } from '@/components/StandardPageLayout';

export default function ContactUsPage() {
  return (
    <StandardPageLayout
      meta={{
        title: 'Contact Us',
        description: 'Get in touch with the New Hampshire Business Education Association',
        openGraph: true,
        twitterCard: true
      }}
      main={{ id: 'main-content', focusable: true }}
      className="min-h-screen"
    >
      <div className="nhbea-container py-16">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <p className="text-lg text-gray-700">
          Contact Page content will be added here.
        </p>
      </div>
    </StandardPageLayout>
  );
}
