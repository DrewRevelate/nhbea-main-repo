import { Suspense, lazy } from 'react';
import { StandardPageLayout } from '@/components/StandardPageLayout';
import AboutPageHeader from '@/components/AboutPageHeader';
import { StandardErrorBoundary } from '@/components/StandardErrorBoundary';
import { LoadingSkeleton } from '@/components/LoadingSpinner';
import { ResponsiveGrid } from '@/components/ResponsiveGrid';
import EnhancedAboutSection from '@/components/EnhancedAboutSection';
import BoardMembersSection from '@/components/BoardMembersSection';
import PastPresidentsSection from '@/components/PastPresidentsSection';
import { getHomepageContent, defaultHomepageContent } from '@/lib/content';
import { getBoardMembers as getLegacyBoardMembers, defaultBoardMembers } from '@/lib/board';
import { getPastPresidents, defaultPastPresidents } from '@/lib/pastPresidents';
import { getBoardMembers, convertToLegacyBoardMember } from '@/lib/members';
import { Member } from '@/types/dataModels';

// Lazy load sections for better performance
const EnhancedMissionSection = lazy(() => import('@/components/EnhancedMissionSection'));
const TrustBadgesSection = lazy(() => import('@/components/TrustBadgesSection'));

async function EnhancedAboutPage() {
  let aboutContent = defaultHomepageContent;
  let boardMembers = defaultBoardMembers;
  let enhancedBoardMembers: Member[] | undefined = undefined;  
  let pastPresidents = defaultPastPresidents;

  // Fetch content with error handling
  try {
    const fetchedContent = await getHomepageContent();
    if (fetchedContent) {
      aboutContent = fetchedContent;
    }
  } catch (error) {
    console.error('Failed to fetch about content:', error);
  }

  try {
    // Try new enhanced members API first
    const fetchedEnhancedMembers = await getBoardMembers();
    if (fetchedEnhancedMembers && fetchedEnhancedMembers.length > 0) {
      enhancedBoardMembers = fetchedEnhancedMembers;
      // Also convert to legacy format as fallback
      boardMembers = fetchedEnhancedMembers.map((member, index) => ({
        ...convertToLegacyBoardMember(member),
        id: `member-${index}`
      }));
    } else {
      // Fall back to legacy API if no enhanced members found
      const legacyBoardMembers = await getLegacyBoardMembers();
      if (legacyBoardMembers && legacyBoardMembers.length > 0) {
        boardMembers = legacyBoardMembers;
      }
    }
  } catch (error) {
    console.error('Failed to fetch board members:', error);
  }

  try {
    const fetchedPastPresidents = await getPastPresidents();
    if (fetchedPastPresidents && fetchedPastPresidents.length > 0) {
      pastPresidents = fetchedPastPresidents;
    } else {
      pastPresidents = defaultPastPresidents;
    }
  } catch (error) {
    console.error('Failed to fetch past presidents:', error);
  }

  return (
    <StandardPageLayout
      error={{ boundary: true }}
      loading={{ enabled: true }}
      meta={{
        title: 'About - NHBEA',
        description: 'Discover NHBEA\'s 102-year legacy of advancing business education excellence in New Hampshire. Learn about our mission, impact, and dedicated community of educators.',
        openGraph: true,
        twitterCard: true
      }}
      main={{ id: 'about-main-content', focusable: true }}
      className="min-h-screen"
    >
      {/* Content-focused page header instead of hero */}
      <AboutPageHeader
        title="About NHBEA"
        subtitle="Dedicated to advancing business education excellence in New Hampshire since 1923"
        boardCount={boardMembers?.length || 15}
        establishedYear={1923}
      />

      {/* Main content sections */}
      <div className="bg-gray-50">
        <ResponsiveGrid 
          gap="lg" 
          breakpoints={{ mobile: 1, tablet: 1, desktop: 1, wide: 1 }}
          className="space-y-16 py-16"
        >
        {/* Story & Impact Section */}
        <StandardErrorBoundary>
          <div id="our-story">
            <EnhancedAboutSection
              title="Our Story & Impact"
              content="Since 1923, NHBEA has been the leading voice for business education in New Hampshire. We've grown from a small group of dedicated educators to a statewide organization that shapes the future of business education."
            />
          </div>
        </StandardErrorBoundary>

        {/* Mission Section */}
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <div id="mission">
              <EnhancedMissionSection
                title="Our Mission"
                content="The New Hampshire Business Educators Association is dedicated to promoting excellence in business education throughout the state. We serve as a vital resource for educators, students, and the broader business community. Through professional development, networking opportunities, and innovative programs, we empower educators to inspire the next generation of business leaders while fostering strong connections between academia and industry."
              />
            </div>
          </Suspense>
        </StandardErrorBoundary>

        {/* Leadership Sections */}
        <StandardErrorBoundary>
          <div id="board-members">
            <BoardMembersSection 
              boardMembers={boardMembers} 
              enhancedMembers={enhancedBoardMembers} 
            />
          </div>
        </StandardErrorBoundary>
        
        <StandardErrorBoundary>
          <div id="past-presidents">
            <PastPresidentsSection pastPresidents={pastPresidents} />
          </div>
        </StandardErrorBoundary>

        {/* Trust Section */}
        <StandardErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="content" />}>
            <TrustBadgesSection />
          </Suspense>
        </StandardErrorBoundary>
        </ResponsiveGrid>
      </div>
    </StandardPageLayout>
  );
}

export default function About() {
  return <EnhancedAboutPage />;
}