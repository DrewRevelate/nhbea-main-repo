import { BoardMember } from '@/types/board';
import { Member } from '@/types/dataModels';
import MemberImage from './MemberImage';

// Extended interface for display with optional fields
interface DisplayBoardMember extends BoardMember {
  secondaryTitle?: string;
}

interface BoardMembersSectionProps {
  boardMembers: BoardMember[];
  enhancedMembers?: Member[]; // Optional prop for enhanced data model
}

export default function BoardMembersSection({ boardMembers, enhancedMembers }: BoardMembersSectionProps) {
  // Helper function to determine display order based on board position
  function getBoardPositionOrder(position?: string): number {
    const orderMap: Record<string, number> = {
      'President': 1,
      'Vice President': 2,
      'Secretary': 3,
      'Treasurer': 4,
      'Past President': 5,
      'Board Member': 6
    };
    
    return orderMap[position || 'Board Member'] || 6;
  }
  
  // If enhanced members are provided, convert them to display format
  let displayMembers: DisplayBoardMember[] = boardMembers || [];
  
  if (enhancedMembers && enhancedMembers.length > 0) {
    displayMembers = enhancedMembers
      .filter(member => member.profile?.activeBoardMember)
      .map(member => {
        // Build name with optional prefix
        const prefix = member.personalInfo?.prefix;
        const firstName = member.personalInfo?.firstName?.trim() || '';
        const lastName = member.personalInfo?.lastName?.trim() || '';
        const fullName = prefix 
          ? `${prefix} ${firstName} ${lastName}`.trim()
          : `${firstName} ${lastName}`.trim();

        return {
          id: member.id,
          name: fullName,
          title: member.profile?.boardPosition || 'Board Member',
          secondaryTitle: member.organization?.secondary_title,
          bio: member.profile?.bio || '',
          imageURL: member.image,
          order: member.profile?.boardOrder || getBoardPositionOrder(member.profile?.boardPosition)
        };
      })
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  }

  return (
    <section className="py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--nhbea-royal-blue)] via-transparent to-[var(--nhbea-accent-gold)]"></div>
      </div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Modern, impactful header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--nhbea-royal-blue)] to-transparent w-16"></div>
            <div className="mx-6 w-12 h-12 bg-[var(--nhbea-royal-blue)] rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--nhbea-royal-blue)] to-transparent w-16"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            Board of <span className="bg-gradient-to-r from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] bg-clip-text text-transparent">Directors</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
            Meet the visionary leaders who guide NHBEA's mission to advance excellence in business education throughout New Hampshire.
          </p>
        </div>
        
        {/* Premium card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {displayMembers.map((member, index) => (
            <div
              key={member.id}
              className="nhbea-card nhbea-card-interactive transform opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
              style={{ animationDelay: `${index * 150}ms` }}
              role="article"
              aria-label={`Board member: ${member.name}, ${member.title}`}
            >
              {/* Premium card accent */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--nhbea-royal-blue)] via-[var(--nhbea-royal-blue-dark)] to-[var(--nhbea-accent-gold)]"></div>
              
              <div className="relative z-10">
                {/* Clean member photo */}
                <div className="mb-6">
                  <MemberImage
                    imagePath={member.imageURL}
                    memberName={member.name}
                  />
                </div>

                {/* Enhanced member info */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl md:text-2xl font-bold leading-tight text-gray-900">
                    {member.name}
                  </h3>
                  
                  <div className="inline-flex items-center px-4 py-2 bg-[var(--nhbea-royal-blue)]/10 rounded-full 
                                  border border-[var(--nhbea-royal-blue)]/20">
                    <span className="font-semibold text-sm text-[var(--nhbea-royal-blue-dark)]">
                      {member.title}
                    </span>
                  </div>
                  
                  {member.secondaryTitle && (
                    <p className="text-sm italic font-medium text-gray-700">
                      {member.secondaryTitle}
                    </p>
                  )}
                  
                  {member.bio && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm leading-relaxed text-gray-800">
                        {member.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leadership Excellence Section */}
        <div className="mt-20 text-center">
          <div className="nhbea-card nhbea-card-featured rounded-3xl p-12 md:p-16 max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--nhbea-royal-blue)] to-[var(--nhbea-royal-blue-dark)] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Committed to Educational Excellence
            </h3>
            
            <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-8 text-gray-700">
              Our Board of Directors brings together decades of combined experience in education, business, and community leadership. Together, they ensure NHBEA continues to serve as New Hampshire's premier resource for business education excellence.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-[var(--nhbea-royal-blue-dark)]">{displayMembers.length}</div>
                <div className="text-sm font-semibold text-gray-600">Board Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-[var(--nhbea-royal-blue-dark)]">102</div>
                <div className="text-sm font-semibold text-gray-600">Years of Service</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-[var(--nhbea-royal-blue-dark)]">250+</div>
                <div className="text-sm font-semibold text-gray-600">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-[var(--nhbea-royal-blue-dark)]">50+</div>
                <div className="text-sm font-semibold text-gray-600">Partner Schools</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}