import { db } from './firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { PastPresident } from '@/types/pastPresidents';
import { Member } from '@/types/dataModels';

// Enhanced function to get past presidents from the members collection
export async function getPastPresidentsFromMembers(): Promise<PastPresident[]> {
  try {
    console.log('🔍 Querying for past presidents with new nested structure...');
    const q = query(
      collection(db, 'members'), 
      where('profile.past_president.past_president', '==', true)
    );
    const querySnapshot = await getDocs(q);
    console.log('🔍 Past presidents query returned:', querySnapshot.size, 'documents');
    
    const pastPresidents: PastPresident[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('🔍 Past president document:', doc.id, 'Data:', JSON.stringify(data.profile?.past_president, null, 2));
      const member = {
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to Date objects  
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as Member;
      
      // Transform Member to PastPresident format
      const yearStarted = member.profile?.past_president?.year_started;
      const yearEnded = member.profile?.past_president?.year_ended;
      let term = 'Unknown';
      
      if (yearStarted && yearEnded) {
        term = `${yearStarted}-${yearEnded}`;
      } else if (yearStarted) {
        term = `${yearStarted}-Present`;
      }
      
      const pastPresident: PastPresident = {
        id: member.id,
        name: `${member.personalInfo?.firstName || ''} ${member.personalInfo?.lastName || ''}`.trim(),
        term: term,
        order: member.profile?.presidencyOrder || yearStarted || 1,
        bio: member.profile?.bio,
        imageUrl: undefined, // Not in nested structure yet
        achievements: member.profile?.achievements
      };
      
      pastPresidents.push(pastPresident);
    });
    
    // Sort by year_started (descending - most recent first), then alphabetically by last name
    return pastPresidents.sort((a, b) => {
      // Extract year from order (which contains year_started)
      const yearA = a.order || 0;
      const yearB = b.order || 0;
      
      // Sort descending (most recent first)
      if (yearA !== yearB) {
        return yearB - yearA;
      }
      
      // If same year, sort alphabetically by last name
      const lastNameA = a.name.split(' ').pop() || '';
      const lastNameB = b.name.split(' ').pop() || '';
      return lastNameA.localeCompare(lastNameB);
    });
  } catch (error) {
    console.error('Error fetching past presidents from members collection:', error);
    // Return empty array instead of throwing to avoid breaking the page
    return [];
  }
}

// Legacy function for backward compatibility (uses old pastPresidents collection)
export async function getPastPresidents(): Promise<PastPresident[]> {
  try {
    // Try enhanced members collection first
    const enhancedResults = await getPastPresidentsFromMembers();
    console.log('🔍 getPastPresidents: Enhanced results:', enhancedResults.length);
    if (enhancedResults.length > 0) {
      return enhancedResults;
    }
    
    // Fall back to legacy collection
    const q = query(collection(db, 'pastPresidents'), orderBy('order', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const pastPresidents: PastPresident[] = [];
    querySnapshot.forEach((doc) => {
      pastPresidents.push({
        id: doc.id,
        ...doc.data()
      } as PastPresident);
    });
    
    return pastPresidents;
  } catch (error) {
    console.error('Error fetching past presidents:', error);
    throw new Error('Failed to fetch past presidents');
  }
}

// Default past presidents fallback for when Firestore is unavailable
export const defaultPastPresidents: PastPresident[] = [
  {
    id: '1',
    name: 'Robert Williams',
    term: '2022-2023',
    order: 1
  },
  {
    id: '2',
    name: 'Maria Garcia',
    term: '2021-2022',
    order: 2
  },
  {
    id: '3',
    name: 'James Smith',
    term: '2020-2021',
    order: 3
  },
  {
    id: '4',
    name: 'Patricia Davis',
    term: '2019-2020',
    order: 4
  },
  {
    id: '5',
    name: 'Christopher Brown',
    term: '2018-2019',
    order: 5
  }
];