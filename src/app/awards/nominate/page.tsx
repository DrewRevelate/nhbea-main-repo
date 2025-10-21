import AwardNominationFormWrapper from '@/components/AwardNominationFormWrapper';

/**
 * Award Nomination Page
 * Displays the multi-step form for submitting award nominations
 */
export default function NominatePage() {
  return <AwardNominationFormWrapper />;
}

// Metadata for the page
export const metadata = {
  title: 'Submit Award Nomination | NHBEA',
  description: 'Nominate a deserving colleague for an NHBEA award recognizing excellence in business education.',
  openGraph: {
    title: 'Submit Award Nomination | NHBEA',
    description: 'Nominate a deserving colleague for an NHBEA award recognizing excellence in business education.',
    type: 'website',
  },
};