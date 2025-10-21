import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NHBEA Admin Portal',
  description: 'Content management system for the New Hampshire Building Envelope Association',
  robots: 'noindex, nofollow', // Prevent search engine indexing
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}