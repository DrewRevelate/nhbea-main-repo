// Import Member type from dataModels for consistency
import { Member } from './dataModels';

export interface BoardMember {
  id: string;
  name: string;
  title: string;
  secondaryTitle?: string;
  bio: string;
  imageURL?: string;
  order?: number;
}

// Enhanced interface that extends Member for board member specific functionality
export interface BoardMemberFromMember extends Pick<Member, 'id' | 'firstName' | 'lastName' | 'boardPosition' | 'boardStartDate' | 'boardEndDate' | 'organizationId'> {
  name: string; // computed: firstName + lastName
  title: string; // mapped from boardPosition
  bio?: string; // optional for now, could be added to Member interface later
  imageURL?: string; // optional for now, could be added to Member interface later
  order?: number; // computed based on board position hierarchy
}