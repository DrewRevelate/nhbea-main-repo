/**
 * Enhanced Member Repository
 * Implements new member data architecture with improved query capabilities
 */

import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { Member } from '@/types/dataModels';

export interface EnhancedMember {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
    prefix?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  governance: {
    boardMember: {
      active: boolean;
      position: BoardPosition;
      order: number;
      termStart?: Date;
      termEnd?: Date;
    };
    pastPresident: {
      isPastPresident: boolean;
      yearsServed?: number[];
    };
  };
  recognition: {
    hallOfFame: {
      inducted: boolean;
      inductionYear?: number;
      category?: string;
    };
    awards: AwardRecord[];
  };
  affiliations: OrganizationAffiliation[];
  membership: {
    type: 'individual' | 'student' | 'retired' | 'honorary';
    status: 'active' | 'inactive' | 'suspended' | 'expired';
    membershipYear?: string;
    renewalDate?: Date;
    joinDate?: Date;
    autoRenewal: boolean;
  };
  preferences: {
    emailNotifications: boolean;
    directoryListing: boolean;
    newsletterSubscription: boolean;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    migrationSource?: string;
  };
  image?: string;
}

export interface BoardPosition {
  title: 'President' | 'Vice President' | 'Secretary' | 'Treasurer' | 'Director' | 'Past President';
  level: number; // 1 = President, 2 = VP, etc.
}

export interface AwardRecord {
  id: string;
  awardId: string; // Reference to awards collection
  year: number;
  active: boolean;
  category?: string;
  description?: string;
}

export interface OrganizationAffiliation {
  organizationId: string; // Reference to organizations collection
  title: string;
  secondaryTitle?: string;
  startDate?: Date;
  endDate?: Date;
  isPrimary: boolean;
}

export interface MigrationResult {
  totalRecords: number;
  migratedRecords: number;
  errors: string[];
}

/**
 * Enhanced Member Repository Class
 */
export class EnhancedMemberRepository {
  
  /**
   * Get all active board members ordered by position
   */
  async getBoardMembers(): Promise<EnhancedMember[]> {
    try {
      const q = query(
        collection(db, 'members'),
        where('governance.boardMember.active', '==', true),
        where('membership.status', '==', 'active'),
        orderBy('governance.boardMember.order')
      );
      
      const querySnapshot = await getDocs(q);
      return this.convertFirestoreDocsToEnhancedMembers(querySnapshot.docs);
    } catch (error) {
      console.error('Error fetching board members:', error);
      throw new Error('Failed to fetch board members');
    }
  }

  /**
   * Get all past presidents
   */
  async getPastPresidents(): Promise<EnhancedMember[]> {
    try {
      const q = query(
        collection(db, 'members'),
        where('governance.pastPresident.isPastPresident', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const pastPresidents = this.convertFirestoreDocsToEnhancedMembers(querySnapshot.docs);
      
      // Sort by most recent years served
      return pastPresidents.sort((a, b) => {
        const aYears = a.governance.pastPresident.yearsServed || [];
        const bYears = b.governance.pastPresident.yearsServed || [];
        const aLatest = Math.max(...aYears, 0);
        const bLatest = Math.max(...bYears, 0);
        return bLatest - aLatest;
      });
    } catch (error) {
      console.error('Error fetching past presidents:', error);
      throw new Error('Failed to fetch past presidents');
    }
  }

  /**
   * Get all hall of fame members ordered by induction year
   */
  async getHallOfFameMembers(): Promise<EnhancedMember[]> {
    try {
      const q = query(
        collection(db, 'members'),
        where('recognition.hallOfFame.inducted', '==', true),
        orderBy('recognition.hallOfFame.inductionYear', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return this.convertFirestoreDocsToEnhancedMembers(querySnapshot.docs);
    } catch (error) {
      console.error('Error fetching hall of fame members:', error);
      throw new Error('Failed to fetch hall of fame members');
    }
  }

  /**
   * Get member by ID with enhanced data structure
   */
  async getEnhancedMemberById(memberId: string): Promise<EnhancedMember | null> {
    try {
      const docRef = doc(db, 'members', memberId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return this.convertFirestoreDocToEnhancedMember(docSnap);
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching enhanced member by ID:', error);
      throw new Error('Failed to fetch enhanced member');
    }
  }

  /**
   * Search members by name, organization, or other criteria
   */
  async searchMembers(searchTerm: string, filters?: {
    boardMembersOnly?: boolean;
    hallOfFameOnly?: boolean;
    activeOnly?: boolean;
  }): Promise<EnhancedMember[]> {
    try {
      let q = query(collection(db, 'members'));
      
      // Apply filters
      if (filters?.activeOnly !== false) {
        q = query(q, where('membership.status', '==', 'active'));
      }
      
      if (filters?.boardMembersOnly) {
        q = query(q, where('governance.boardMember.active', '==', true));
      }
      
      if (filters?.hallOfFameOnly) {
        q = query(q, where('recognition.hallOfFame.inducted', '==', true));
      }
      
      const querySnapshot = await getDocs(q);
      const allMembers = this.convertFirestoreDocsToEnhancedMembers(querySnapshot.docs);
      
      // Client-side search (Firestore doesn't support complex text search)
      const searchLower = searchTerm.toLowerCase();
      return allMembers.filter(member => {
        const fullName = `${member.personalInfo.firstName} ${member.personalInfo.lastName}`.toLowerCase();
        const email = member.personalInfo.email?.toLowerCase() || '';
        const organization = member.affiliations[0]?.title?.toLowerCase() || '';
        
        return fullName.includes(searchLower) || 
               email.includes(searchLower) || 
               organization.includes(searchLower);
      });
    } catch (error) {
      console.error('Error searching members:', error);
      throw new Error('Failed to search members');
    }
  }

  /**
   * Migrate legacy member to enhanced format
   */
  async migrateLegacyMember(legacyMember: Member): Promise<EnhancedMember> {
    const enhanced: EnhancedMember = {
      id: legacyMember.id,
      personalInfo: {
        firstName: legacyMember.personalInfo?.firstName || '',
        lastName: legacyMember.personalInfo?.lastName || '',
        phone: legacyMember.personalInfo?.phone,
        email: legacyMember.personalInfo?.email,
        prefix: (legacyMember.personalInfo as any)?.prefix,
        address: (legacyMember.personalInfo as any)?.address
      },
      governance: {
        boardMember: {
          active: legacyMember.profile?.activeBoardMember || false,
          position: this.mapBoardPosition(legacyMember.profile?.boardPosition),
          order: legacyMember.profile?.boardOrder || 99,
          termStart: undefined, // Would need to be set based on business rules
          termEnd: undefined
        },
        pastPresident: {
          isPastPresident: legacyMember.profile?.past_president?.past_president || false,
          yearsServed: legacyMember.profile?.past_president?.year_started ? 
            [legacyMember.profile.past_president.year_started] : undefined
        }
      },
      recognition: {
        hallOfFame: {
          inducted: (legacyMember as any).hall_of_fame?.isactive || false,
          inductionYear: undefined, // Would need to be extracted from awards
          category: undefined
        },
        awards: this.mapAwards((legacyMember as any).awards, (legacyMember as any).hall_of_fame?.award)
      },
      affiliations: [{
        organizationId: legacyMember.organization?.address || '',
        title: legacyMember.organization?.title || '',
        secondaryTitle: (legacyMember.organization as any)?.secondary_title,
        isPrimary: true
      }],
      membership: {
        type: legacyMember.membership?.type || 'individual',
        status: legacyMember.membership?.status || 'active',
        membershipYear: legacyMember.membership?.membershipYear,
        renewalDate: legacyMember.membership?.renewalDate,
        joinDate: legacyMember.membership?.joinDate,
        autoRenewal: legacyMember.membership?.autoRenewal || false
      },
      preferences: {
        emailNotifications: legacyMember.preferences?.emailNotifications || false,
        directoryListing: legacyMember.preferences?.directoryListing || false,
        newsletterSubscription: legacyMember.preferences?.newsletterSubscription || false
      },
      metadata: {
        createdAt: legacyMember.metadata?.createdAt || new Date(),
        updatedAt: legacyMember.metadata?.updatedAt || new Date(),
        createdBy: legacyMember.metadata?.createdBy,
        migrationSource: 'legacy_migration_phase2'
      },
      image: (legacyMember as any).image
    };

    return enhanced;
  }

  /**
   * Batch migrate all legacy members to enhanced format
   */
  async migrateAllLegacyMembers(): Promise<MigrationResult> {
    console.log('🚀 Starting legacy member migration to enhanced format...');
    
    const result: MigrationResult = {
      totalRecords: 0,
      migratedRecords: 0,
      errors: []
    };

    try {
      // Get all members
      const membersCollection = collection(db, 'members');
      const snapshot = await getDocs(membersCollection);
      
      result.totalRecords = snapshot.size;
      
      const batch = writeBatch(db);
      let batchCount = 0;

      for (const memberDoc of snapshot.docs) {
        try {
          const legacyData = memberDoc.data() as Member;
          const enhancedMember = await this.migrateLegacyMember(legacyData);
          
          // Update document with enhanced structure
          const memberRef = doc(db, 'members', memberDoc.id);
          batch.update(memberRef, {
            ...enhancedMember,
            'metadata.enhancedMigrationDate': new Date(),
            'metadata.enhancedMigrationVersion': 'v2.0'
          });
          
          result.migratedRecords++;
          
          // Commit batch every 450 operations
          batchCount++;
          if (batchCount >= 450) {
            await batch.commit();
            batchCount = 0;
          }
        } catch (error) {
          const errorMsg = `Failed to migrate member ${memberDoc.id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      // Commit remaining operations
      if (batchCount > 0) {
        await batch.commit();
      }

      console.log(`✅ Migration completed: ${result.migratedRecords}/${result.totalRecords} records migrated`);
      return result;

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Private helper methods
   */
  private convertFirestoreDocsToEnhancedMembers(docs: any[]): EnhancedMember[] {
    return docs.map(doc => this.convertFirestoreDocToEnhancedMember(doc));
  }

  private convertFirestoreDocToEnhancedMember(doc: any): EnhancedMember {
    const data = doc.data();
    
    // Handle both legacy and enhanced formats
    return {
      id: doc.id,
      personalInfo: data.personalInfo || {
        firstName: '',
        lastName: ''
      },
      governance: data.governance || {
        boardMember: {
          active: data.profile?.activeBoardMember || false,
          position: this.mapBoardPosition(data.profile?.boardPosition),
          order: data.profile?.boardOrder || 99
        },
        pastPresident: {
          isPastPresident: data.profile?.past_president?.past_president || false
        }
      },
      recognition: data.recognition || {
        hallOfFame: {
          inducted: data.hall_of_fame?.isactive || false
        },
        awards: []
      },
      affiliations: data.affiliations || [{
        organizationId: data.organization?.address || '',
        title: data.organization?.title || '',
        isPrimary: true
      }],
      membership: data.membership || {
        type: 'individual',
        status: 'active',
        autoRenewal: false
      },
      preferences: data.preferences || {
        emailNotifications: false,
        directoryListing: false,
        newsletterSubscription: false
      },
      metadata: {
        createdAt: data.metadata?.createdAt?.toDate() || data.createdAt?.toDate() || new Date(),
        updatedAt: data.metadata?.updatedAt?.toDate() || data.updatedAt?.toDate() || new Date(),
        createdBy: data.metadata?.createdBy,
        migrationSource: data.metadata?.migrationSource
      },
      image: data.image
    };
  }

  private mapBoardPosition(position?: string): BoardPosition {
    const positionMap: Record<string, BoardPosition> = {
      'President': { title: 'President', level: 1 },
      'Vice President': { title: 'Vice President', level: 2 },
      'Secretary': { title: 'Secretary', level: 3 },
      'Treasurer': { title: 'Treasurer', level: 4 },
      'Past President': { title: 'Past President', level: 5 },
      'Director': { title: 'Director', level: 6 }
    };

    return positionMap[position || 'Director'] || { title: 'Director', level: 6 };
  }

  private mapAwards(legacyAwards?: any[], hallOfFameAwards?: any[]): AwardRecord[] {
    const awards: AwardRecord[] = [];
    
    // Map legacy awards array
    if (legacyAwards && Array.isArray(legacyAwards)) {
      legacyAwards.forEach((award, index) => {
        awards.push({
          id: `legacy_${index}`,
          awardId: award.award || '',
          year: award.year || new Date().getFullYear(),
          active: award.active || false
        });
      });
    }
    
    // Map hall of fame awards
    if (hallOfFameAwards && Array.isArray(hallOfFameAwards)) {
      hallOfFameAwards.forEach((award, index) => {
        awards.push({
          id: `hof_${index}`,
          awardId: award.id || '',
          year: new Date().getFullYear(), // Default year
          active: true,
          category: 'hall_of_fame'
        });
      });
    }
    
    return awards;
  }
}

// Export singleton instance
export const enhancedMemberRepository = new EnhancedMemberRepository();