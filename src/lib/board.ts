import { db } from './firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { BoardMember, BoardMemberFromMember } from '@/types/board';
import { Member } from '@/types/dataModels';

// Enhanced function to get board members from the members collection
export async function getBoardMembersFromMembers(): Promise<BoardMember[]> {
  try {
    const q = query(
      collection(db, 'members'), 
      where('isBoardMember', '==', true),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    
    const boardMembers: BoardMember[] = [];
    querySnapshot.forEach((doc) => {
      const member = { id: doc.id, ...doc.data() } as Member;
      
      // Transform Member to BoardMember format
      const boardMember: BoardMember = {
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        title: member.boardPosition || 'Board Member',
        bio: member.bio || '',
        imageURL: member.imageUrl || undefined,
        order: member.boardOrder || getBoardPositionOrder(member.boardPosition)
      };
      
      boardMembers.push(boardMember);
    });
    
    // Sort by board order, then by position order
    return boardMembers.sort((a, b) => (a.order || 999) - (b.order || 999));
  } catch (error) {
    console.error('Error fetching board members from members collection:', error);
    throw new Error('Failed to fetch board members');
  }
}

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

// Main function to get board members (tries enhanced members collection first)
export async function getBoardMembers(): Promise<BoardMember[]> {
  try {
    // Try enhanced members collection first
    const enhancedResults = await getBoardMembersFromMembers();
    if (enhancedResults.length > 0) {
      return enhancedResults;
    }
    
    // Fall back to legacy collection
    const q = query(collection(db, 'boardMembers'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const boardMembers: BoardMember[] = [];
    querySnapshot.forEach((doc) => {
      boardMembers.push({
        id: doc.id,
        ...doc.data()
      } as BoardMember);
    });
    
    return boardMembers;
  } catch (error) {
    console.error('Error fetching board members:', error);
    return defaultBoardMembers;
  }
}

// Default board members fallback for when Firestore is unavailable
export const defaultBoardMembers: BoardMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'President',
    bio: 'Sarah has been an advocate for business education for over 15 years, bringing innovative teaching methods to the classroom.',
    order: 1
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Vice President',
    bio: 'Michael specializes in entrepreneurship education and has helped launch numerous student business ventures.',
    order: 2
  },
  {
    id: '3',
    name: 'Jennifer Rodriguez',
    title: 'Secretary',
    bio: 'Jennifer focuses on curriculum development and has authored several business education textbooks.',
    order: 3
  },
  {
    id: '4',
    name: 'David Thompson',
    title: 'Treasurer',
    bio: 'David brings financial expertise and has been instrumental in securing funding for educational programs.',
    order: 4
  }
];