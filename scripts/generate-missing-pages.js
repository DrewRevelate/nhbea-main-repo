const fs = require('fs');
const path = require('path');

// Define all missing pages with their metadata
const missingPages = [
  {
    path: 'bylaws/page.tsx',
    title: 'NHBEA Bylaws',
    description: 'Official bylaws and governance documents for the New Hampshire Business Education Association',
    content: 'Bylaws Page'
  },
  {
    path: 'contact/page.tsx',
    title: 'Contact Us',
    description: 'Get in touch with the New Hampshire Business Education Association',
    content: 'Contact Page'
  },
  {
    path: 'sitemap/page.tsx',
    title: 'Sitemap',
    description: 'Complete site navigation for NHBEA.org',
    content: 'Sitemap Page'
  },
  {
    path: 'membership/benefits/page.tsx',
    title: 'Membership Benefits',
    description: 'Discover the benefits of NHBEA membership',
    content: 'Membership Benefits Page'
  },
  {
    path: 'membership/renewal/page.tsx',
    title: 'Membership Renewal',
    description: 'Renew your NHBEA membership',
    content: 'Membership Renewal Page'
  },
  {
    path: 'admin/applications/page.tsx',
    title: 'Admin - Applications',
    description: 'Manage membership applications',
    content: 'Applications Admin Page'
  },
  {
    path: 'admin/conference/page.tsx',
    title: 'Admin - Conference',
    description: 'Manage conference settings',
    content: 'Conference Admin Page'
  },
  {
    path: 'admin/content/page.tsx',
    title: 'Admin - Content',
    description: 'Manage website content',
    content: 'Content Admin Page'
  },
  {
    path: 'admin/financial/page.tsx',
    title: 'Admin - Financial',
    description: 'Financial management',
    content: 'Financial Admin Page'
  },
  {
    path: 'admin/members/page.tsx',
    title: 'Admin - Members',
    description: 'Manage members',
    content: 'Members Admin Page'
  },
  {
    path: 'admin/reports/page.tsx',
    title: 'Admin - Reports',
    description: 'View and generate reports',
    content: 'Reports Admin Page'
  },
  {
    path: 'admin/settings/page.tsx',
    title: 'Admin - Settings',
    description: 'Application settings',
    content: 'Settings Admin Page'
  },
  {
    path: 'admin/setup-security/page.tsx',
    title: 'Admin - Setup Security',
    description: 'Security setup and configuration',
    content: 'Security Setup Admin Page'
  }
];

// Template for a simple page
const pageTemplate = (title, description, content) => `import { StandardPageLayout } from '@/components/StandardPageLayout';

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <StandardPageLayout
      meta={{
        title: '${title}',
        description: '${description}',
        openGraph: true,
        twitterCard: true
      }}
      main={{ id: 'main-content', focusable: true }}
      className="min-h-screen"
    >
      <div className="nhbea-container py-16">
        <h1 className="text-4xl font-bold mb-8">${title}</h1>
        <p className="text-lg text-gray-700">
          ${content} content will be added here.
        </p>
      </div>
    </StandardPageLayout>
  );
}
`;

// Create directories and files
const srcAppDir = path.join(__dirname, '..', 'src', 'app');

console.log('Generating missing pages...\n');

missingPages.forEach(({ path: pagePath, title, description, content }) => {
  const fullPath = path.join(srcAppDir, pagePath);
  const dir = path.dirname(fullPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }

  // Create page file
  const pageContent = pageTemplate(title, description, content);
  fs.writeFileSync(fullPath, pageContent);
  console.log(`✓ Created page: ${pagePath}`);
});

console.log(`\n✅ Successfully created ${missingPages.length} missing pages!`);
console.log('\nNext steps:');
console.log('1. Review the generated pages in src/app/');
console.log('2. Run: npm run build');
console.log('3. Deploy with: firebase hosting:channel:deploy test-preview');
