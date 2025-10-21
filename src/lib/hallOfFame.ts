import { db } from './firebase';
import { collection, getDocs, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import { HallOfFameMember } from '@/types/dataModels';
import { Member } from '@/types/dataModels';

// Awards-based function to get hall of fame members
export async function getHallOfFameMembersFromMembers(): Promise<HallOfFameMember[]> {
  try {
    console.log('🏆 Fetching Hall of Fame members based on active awards...');
    
    // Query members who have awards array (can't directly query array elements in Firestore)
    const q = query(
      collection(db, 'members'),
      where('awards', '!=', null)
    );
    const querySnapshot = await getDocs(q);
    
    console.log(`🏆 Found ${querySnapshot.size} members with awards to evaluate`);
    
    const hallOfFameMembers: HallOfFameMember[] = [];
    
    for (const memberDoc of querySnapshot.docs) {
      const member = { id: memberDoc.id, ...memberDoc.data() } as Member;
      
      // Validate required personal info exists
      if (!member.personalInfo?.firstName || !member.personalInfo?.lastName) {
        console.warn(`Member ${memberDoc.id} missing required personal info, skipping`);
        continue;
      }
      
      // Filter for active awards only
      const activeAwards = (member.awards || []).filter(award => award.active === true);
      
      if (activeAwards.length === 0) {
        // No active awards - not in Hall of Fame
        continue;
      }
      
      console.log(`🏆 Processing member ${member.personalInfo.firstName} ${member.personalInfo.lastName} with ${activeAwards.length} active awards`);
      
      // Fetch award details for each active award
      const awardDetails = await Promise.all(
        activeAwards.map(async (awardRef) => {
          try {
            const awardDoc = await getDoc(doc(db, 'awards', awardRef.award.id));
            const awardData = awardDoc.data();
            
            return {
              awardId: awardRef.award.id,
              awardName: awardData?.name || 'Unknown Award',
              year: awardRef.year || new Date().getFullYear(),
              category: awardData?.category || 'general'
            };
          } catch (error) {
            console.warn(`Failed to fetch award ${awardRef.award.id}:`, error);
            return {
              awardId: awardRef.award.id,
              awardName: 'Unknown Award',
              year: awardRef.year || new Date().getFullYear(),
              category: 'general'
            };
          }
        })
      );
      
      // Calculate induction year (earliest active award year)
      const inductionYear = Math.min(...activeAwards.map(a => a.year || new Date().getFullYear()));
      
      const hofMember: HallOfFameMember = {
        id: member.id,
        memberId: member.id,
        name: `${member.personalInfo.prefix ? member.personalInfo.prefix + ' ' : ''}${member.personalInfo.firstName} ${member.personalInfo.lastName}`.trim(),
        bio: member.profile?.bio || '',
        imageUrl: member.image || '',
        activeAwards: awardDetails,
        inductionYear,
        totalActiveAwards: activeAwards.length,
        order: inductionYear // Sort by induction year
      };
      
      hallOfFameMembers.push(hofMember);
    }
    
    // Sort by induction year (earliest first)
    const sortedMembers = hallOfFameMembers.sort((a, b) => a.inductionYear - b.inductionYear);
    
    console.log(`🏆 Successfully processed ${sortedMembers.length} Hall of Fame members with active awards`);
    return sortedMembers;
  } catch (error) {
    console.error('❌ Error fetching awards-based hall of fame members:', error);
    
    if (error instanceof Error) {
      throw new Error(`Failed to fetch hall of fame members: ${error.message}`);
    }
    
    throw new Error('Failed to fetch hall of fame members: Unknown error');
  }
}

// Main function to get hall of fame members
export async function getHallOfFameMembers(): Promise<HallOfFameMember[]> {
  try {
    return await getHallOfFameMembersFromMembers();
  } catch (error) {
    console.error('Error fetching hall of fame members:', error);
    return defaultHallOfFameMembers;
  }
}

// Default hall of fame members fallback for when Firestore is unavailable
export const defaultHallOfFameMembers: HallOfFameMember[] = [
  {
    id: '1',
    name: 'Distinguished Educator',
    bio: 'A dedicated educator who has made significant contributions to business education in New Hampshire.',
    imageUrl: '',
    activeAwards: [
      {
        awardId: 'default-award-1',
        awardName: 'Business Educator of the Year',
        year: 2024,
        category: 'Excellence'
      }
    ],
    inductionYear: 2024,
    totalActiveAwards: 1,
    order: 2024
  }
];