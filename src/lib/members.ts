import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Member, Organization } from '@/types/dataModels';
import { LegacyBoardMember } from '@/types/members';

/**
 * Enhanced Members API for NHBEA - Updated for new data model
 * Provides comprehensive member management functionality
 */

// Get all active members
export async function getActiveMembers(): Promise<Member[]> {
  try {
    const q = query(
      collection(db, 'members'),
      where('status', '==', 'active'),
      orderBy('lastName')
    );
    const querySnapshot = await getDocs(q);
    
    const members: Member[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      members.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to Date objects
        joinDate: data.joinDate?.toDate() || new Date(),
        renewalDate: data.renewalDate?.toDate() || new Date(),
        expirationDate: data.expirationDate?.toDate() || new Date(),
        boardStartDate: data.boardStartDate?.toDate(),
        boardEndDate: data.boardEndDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        paymentHistory: data.paymentHistory?.map((payment: any) => ({
          ...payment,
          paymentDate: payment.paymentDate?.toDate() || new Date()
        })) || []
      } as Member);
    });
    
    return members;
  } catch (error) {
    console.error('Error fetching active members:', error);
    throw new Error('Failed to fetch active members');
  }
}

// Get current board members using nested data structure
export async function getBoardMembers(): Promise<Member[]> {
  try {
    const q = query(
      collection(db, 'members'),
      where('profile.activeBoardMember', '==', true),
      where('membership.status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    
    const boardMembers: Member[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      boardMembers.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to Date objects
        membership: {
          ...data.membership,
          renewalDate: data.membership?.renewalDate?.toDate(),
          joinDate: data.membership?.joinDate?.toDate()
        },
        metadata: {
          ...data.metadata,
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date()
        }
      } as Member);
    });
    
    // Sort by board position order
    return boardMembers.sort((a, b) => {
      const orderMap: Record<string, number> = {
        'President': 1,
        'Vice President': 2,
        'Secretary': 3,
        'Treasurer': 4,
        'Board Member': 6
      };
      
      const orderA = a.profile?.boardOrder || orderMap[a.profile?.boardPosition || 'Board Member'] || 6;
      const orderB = b.profile?.boardOrder || orderMap[b.profile?.boardPosition || 'Board Member'] || 6;
      
      return orderA - orderB;
    });
  } catch (error) {
    console.error('Error fetching board members:', error);
    throw new Error('Failed to fetch board members');
  }
}

// Get members for public directory (only those who opted in)
export async function getPublicDirectoryMembers(): Promise<Member[]> {
  try {
    const q = query(
      collection(db, 'members'),
      where('status', '==', 'active'),
      where('communicationPreferences.mailings', '==', true), // Using mailings as directory listing preference
      orderBy('lastName')
    );
    const querySnapshot = await getDocs(q);
    
    const members: Member[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      members.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to Date objects
        joinDate: data.joinDate?.toDate() || new Date(),
        renewalDate: data.renewalDate?.toDate() || new Date(),
        expirationDate: data.expirationDate?.toDate() || new Date(),
        boardStartDate: data.boardStartDate?.toDate(),
        boardEndDate: data.boardEndDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        paymentHistory: data.paymentHistory?.map((payment: any) => ({
          ...payment,
          paymentDate: payment.paymentDate?.toDate() || new Date()
        })) || []
      } as Member);
    });
    
    return members;
  } catch (error) {
    console.error('Error fetching public directory members:', error);
    throw new Error('Failed to fetch public directory members');
  }
}

// Get a single member by ID
export async function getMemberById(memberId: string): Promise<Member | null> {
  try {
    const docRef = doc(db, 'members', memberId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        // Convert Firestore timestamps to Date objects
        joinDate: data.joinDate?.toDate() || new Date(),
        renewalDate: data.renewalDate?.toDate() || new Date(),
        expirationDate: data.expirationDate?.toDate() || new Date(),
        boardStartDate: data.boardStartDate?.toDate(),
        boardEndDate: data.boardEndDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        paymentHistory: data.paymentHistory?.map((payment: any) => ({
          ...payment,
          paymentDate: payment.paymentDate?.toDate() || new Date()
        })) || []
      } as Member;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching member by ID:', error);
    throw new Error('Failed to fetch member');
  }
}

// Create a new member using new data model
export async function createMember(memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const now = new Date();
    const memberWithMetadata = {
      ...memberData,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'members'), memberWithMetadata);
    return docRef.id;
  } catch (error) {
    console.error('Error creating member:', error);
    throw new Error('Failed to create member');
  }
}

// Update an existing member using new data model
export async function updateMember(memberId: string, updateData: Partial<Omit<Member, 'id' | 'createdAt'>>): Promise<void> {
  try {
    const docRef = doc(db, 'members', memberId);
    const updateWithMetadata = {
      ...updateData,
      updatedAt: new Date()
    };
    
    await updateDoc(docRef, updateWithMetadata);
  } catch (error) {
    console.error('Error updating member:', error);
    throw new Error('Failed to update member');
  }
}

// Delete a member (soft delete by setting status to inactive)
export async function deactivateMember(memberId: string): Promise<void> {
  try {
    await updateMember(memberId, {
      status: 'inactive'
    });
  } catch (error) {
    console.error('Error deactivating member:', error);
    throw new Error('Failed to deactivate member');
  }
}

// Hard delete a member (use with caution)
export async function deleteMember(memberId: string): Promise<void> {
  try {
    const docRef = doc(db, 'members', memberId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting member:', error);
    throw new Error('Failed to delete member');
  }
}

// Migration utility: Convert legacy board member to new member format
export function convertLegacyBoardMember(legacyMember: LegacyBoardMember): Omit<Member, 'id' | 'createdAt' | 'updatedAt'> {
  const nameParts = legacyMember.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  return {
    memberNumber: `NHBEA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@nhbea.org`,
    phone: '',
    organizationId: 'default-org', // Would need to be set properly
    position: legacyMember.title,
    yearsExperience: 5, // Default value
    address: '',
    city: '',
    state: 'NH',
    zipCode: '',
    membershipType: 'professional',
    status: 'active',
    joinDate: new Date(),
    renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isBoardMember: true,
    boardPosition: legacyMember.title,
    boardStartDate: new Date(),
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true,
      mailings: true
    },
    paymentHistory: [],
    notes: legacyMember.bio
  };
}

// Default fallback members for development/testing
export const defaultMembers: Member[] = [
  {
    id: '1',
    memberNumber: 'NHBEA-2020-0001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@nhbea.org',
    phone: '(603) 555-0001',
    organizationId: 'org-1',
    position: 'Business Teacher',
    yearsExperience: 15,
    address: '123 Main St',
    city: 'Manchester',
    state: 'NH',
    zipCode: '03101',
    membershipType: 'professional',
    status: 'active',
    joinDate: new Date('2020-01-01'),
    renewalDate: new Date('2025-12-31'),
    expirationDate: new Date('2025-12-31'),
    isBoardMember: true,
    boardPosition: 'President',
    boardStartDate: new Date('2023-01-01'),
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true,
      mailings: true
    },
    paymentHistory: [],
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date(),
    notes: 'Sarah has been an advocate for business education for over 15 years, bringing innovative teaching methods to the classroom.'
  },
  {
    id: '2',
    memberNumber: 'NHBEA-2019-0002',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@nhbea.org',
    phone: '(603) 555-0002',
    organizationId: 'org-2',
    position: 'Associate Professor',
    yearsExperience: 12,
    address: '456 Oak Ave',
    city: 'Nashua',
    state: 'NH',
    zipCode: '03060',
    membershipType: 'professional',
    status: 'active',
    joinDate: new Date('2019-06-15'),
    renewalDate: new Date('2025-12-31'),
    expirationDate: new Date('2025-12-31'),
    isBoardMember: true,
    boardPosition: 'Vice President',
    boardStartDate: new Date('2023-01-01'),
    communicationPreferences: {
      newsletter: true,
      updates: true,
      events: true,
      mailings: true
    },
    paymentHistory: [],
    createdAt: new Date('2019-06-15'),
    updatedAt: new Date(),
    notes: 'Michael specializes in entrepreneurship education and has helped launch numerous student business ventures.'
  }
];

// Backward compatibility: Convert new Member to legacy BoardMember format
export function convertToLegacyBoardMember(member: Member): LegacyBoardMember {
  return {
    id: member.id,
    name: `${member.personalInfo?.firstName || ''} ${member.personalInfo?.lastName || ''}`,
    title: member.profile?.boardPosition || member.organization?.title || 'Board Member',
    bio: member.profile?.bio || '',
    imageURL: undefined, // imageURL not in nested model yet
    order: member.profile?.boardOrder || getBoardPositionOrder(member.profile?.boardPosition)
  };
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