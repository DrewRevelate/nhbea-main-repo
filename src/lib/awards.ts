import { db } from './firebase';
import { collection, getDocs, addDoc, doc, getDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import type { Award, AwardNomination } from '@/types/dataModels';

/**
 * Cache configuration for awards data
 */
const CACHE_DURATION_MS = 60 * 1000; // 1 minute
let awardsCache: { data: Award[]; timestamp: number } | null = null;

/**
 * Repository functions for Awards and Award Nominations
 */
export const awardsRepository = {
  /**
   * Fetch all active awards from Firestore with caching
   */
  async getAllActiveAwards(): Promise<Award[]> {
    try {
      // Check cache first
      if (awardsCache && (Date.now() - awardsCache.timestamp) < CACHE_DURATION_MS) {
        return awardsCache.data;
      }

      const awardsRef = collection(db, 'awards');
      const q = query(
        awardsRef,
        where('isActive', '==', true),
        orderBy('category'),
        orderBy('name')
      );
      
      const snapshot = await getDocs(q);
      const awards: Award[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        awards.push({
          id: doc.id,
          name: data.name,
          icon: data.icon,
          description: data.description,
          eligibility: data.eligibility,
          deadline: data.deadline?.toDate() || new Date(),
          category: data.category,
          isActive: data.isActive,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });

      // Update cache
      awardsCache = {
        data: awards,
        timestamp: Date.now()
      };

      return awards;
    } catch (error) {
      console.error('Error fetching awards:', error);
      throw new Error('Failed to fetch awards data');
    }
  },

  /**
   * Get a specific award by ID
   */
  async getAwardById(id: string): Promise<Award | null> {
    try {
      const awardRef = doc(db, 'awards', id);
      const awardSnap = await getDoc(awardRef);

      if (!awardSnap.exists()) {
        return null;
      }

      const data = awardSnap.data();
      return {
        id: awardSnap.id,
        name: data.name,
        icon: data.icon,
        description: data.description,
        eligibility: data.eligibility,
        deadline: data.deadline?.toDate() || new Date(),
        category: data.category,
        isActive: data.isActive,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('Error fetching award:', error);
      throw new Error('Failed to fetch award data');
    }
  },

  /**
   * Fetch ALL awards from Firestore (active and inactive) with caching
   */
  async getAllAwards(): Promise<Award[]> {
    try {
      const awardsRef = collection(db, 'awards');
      
      // First try a simple query without ordering in case collection is empty
      let snapshot;
      try {
        const q = query(
          awardsRef,
          orderBy('category'),
          orderBy('name')
        );
        snapshot = await getDocs(q);
      } catch (orderError) {
        console.log('Ordered query failed, trying simple query:', orderError);
        // If ordered query fails (collection might be empty), try simple query
        snapshot = await getDocs(awardsRef);
      }
      
      const awards: Award[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Validate required fields exist
        if (!data.name || !data.category) {
          console.warn(`Award document ${doc.id} missing required fields:`, data);
          return; // Skip this document
        }
        
        awards.push({
          id: doc.id,
          name: data.name || '',
          icon: data.icon || '',
          description: data.description || '',
          eligibility: data.eligibility || '',
          deadline: data.deadline?.toDate() || new Date(),
          category: data.category || 'Excellence',
          isActive: data.isActive ?? data.isactive ?? true, // Handle both field names
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });

      // Sort manually if we couldn't use orderBy
      awards.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      });

      console.log(`Fetched ${awards.length} awards from Firestore`);
      return awards;
    } catch (error) {
      console.error('Error fetching all awards:', error);
      // Return empty array instead of throwing error so page still loads
      return [];
    }
  },

  /**
   * Get awards by category
   */
  async getAwardsByCategory(category: Award['category']): Promise<Award[]> {
    try {
      const allAwards = await this.getAllActiveAwards();
      return allAwards.filter(award => award.category === category);
    } catch (error) {
      console.error('Error fetching awards by category:', error);
      throw new Error('Failed to fetch awards by category');
    }
  }
};

/**
 * Repository functions for Award Nominations
 */
export const nominationsRepository = {
  /**
   * Submit a new award nomination
   */
  async createNomination(nominationData: Omit<AwardNomination, 'id' | 'submissionDate'>): Promise<string> {
    try {
      const nominationsRef = collection(db, 'nominations');
      
      // Clean the data to remove undefined values that might cause Firestore issues
      const cleanData = {
        awardId: nominationData.awardId,
        awardCategory: nominationData.awardCategory,
        nomineeInfo: {
          name: nominationData.nomineeInfo.name,
          email: nominationData.nomineeInfo.email,
          ...(nominationData.nomineeInfo.organization && { organization: nominationData.nomineeInfo.organization }),
          ...(nominationData.nomineeInfo.position && { position: nominationData.nomineeInfo.position })
        },
        nominatorInfo: {
          name: nominationData.nominatorInfo.name,
          email: nominationData.nominatorInfo.email,
          ...(nominationData.nominatorInfo.organization && { organization: nominationData.nominatorInfo.organization }),
          ...(nominationData.nominatorInfo.position && { position: nominationData.nominatorInfo.position })
        },
        nominationText: nominationData.nominationText,
        status: 'pending' as const,
        submissionDate: serverTimestamp()
      };
      
      const docRef = await addDoc(nominationsRef, cleanData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating nomination:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        code: (error as any)?.code
      });
      throw new Error('Failed to submit nomination');
    }
  },

  /**
   * Get nominations by award ID (for admin use)
   */
  async getNominationsByAward(awardId: string): Promise<AwardNomination[]> {
    try {
      const nominationsRef = collection(db, 'nominations');
      const q = query(
        nominationsRef,
        where('awardId', '==', awardId),
        orderBy('submissionDate', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const nominations: AwardNomination[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        nominations.push({
          id: doc.id,
          awardId: data.awardId,
          nomineeInfo: data.nomineeInfo,
          nominatorInfo: data.nominatorInfo,
          awardCategory: data.awardCategory,
          nominationText: data.nominationText,
          supportingDocuments: data.supportingDocuments || [],
          submissionDate: data.submissionDate?.toDate() || new Date(),
          status: data.status,
          reviewNotes: data.reviewNotes,
        });
      });

      return nominations;
    } catch (error) {
      console.error('Error fetching nominations:', error);
      throw new Error('Failed to fetch nominations');
    }
  }
};

/**
 * Utility functions
 */
export const awardsUtils = {
  /**
   * Check if an award deadline has passed
   */
  isDeadlinePassed(deadline: Date): boolean {
    return new Date() > deadline;
  },

  /**
   * Format deadline for display
   */
  formatDeadline(deadline: Date): string {
    return deadline.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Get days until deadline
   */
  getDaysUntilDeadline(deadline: Date): number {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  /**
   * Format award category for display
   */
  formatCategory(category: Award['category']): string {
    switch (category) {
      case 'Excellence':
        return 'Excellence in Education';
      case 'Lifetime':
        return 'Lifetime Achievement';
      case 'Innovation':
        return 'Innovation in Teaching';
      case 'Service':
        return 'Service to Community';
      default:
        return category;
    }
  },

  /**
   * Sort awards by deadline status (active first, then by urgency)
   */
  sortAwardsByDeadlineStatus(awards: Award[]): Award[] {
    return [...awards].sort((a, b) => {
      const aCanNominate = a.isActive && !this.isDeadlinePassed(a.deadline);
      const bCanNominate = b.isActive && !this.isDeadlinePassed(b.deadline);
      const aDaysLeft = this.getDaysUntilDeadline(a.deadline);
      const bDaysLeft = this.getDaysUntilDeadline(b.deadline);
      
      // HIGHEST PRIORITY: Active nominations ALWAYS come first
      if (aCanNominate && !bCanNominate) return -1;
      if (!aCanNominate && bCanNominate) return 1;
      
      // SECOND PRIORITY: Among active nominations, sort by urgency
      if (aCanNominate && bCanNominate) {
        // Critical deadlines (≤7 days) first
        if (aDaysLeft <= 7 && bDaysLeft > 7) return -1;
        if (bDaysLeft <= 7 && aDaysLeft > 7) return 1;
        
        // Then by deadline (soonest first)
        return aDaysLeft - bDaysLeft;
      }
      
      // LOWEST PRIORITY: Expired awards, sorted by how recently they closed
      if (!aCanNominate && !bCanNominate) {
        return bDaysLeft - aDaysLeft; // Most recently closed first
      }
      
      return 0;
    });
  },

  /**
   * Get awards separated by active/expired status
   */
  separateAwardsByStatus(awards: Award[]): { active: Award[]; expired: Award[] } {
    const sorted = this.sortAwardsByDeadlineStatus(awards);
    const active = sorted.filter(award => award.isActive && !this.isDeadlinePassed(award.deadline));
    const expired = sorted.filter(award => !award.isActive || this.isDeadlinePassed(award.deadline));
    
    return { active, expired };
  }
};