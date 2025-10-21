/**
 * Query Optimization and Performance Monitoring
 * Implements optimized queries with performance tracking
 */

import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs, enableNetwork, disableNetwork } from 'firebase/firestore';
import { EnhancedMember } from '../repositories/enhanced-member-repository';

export interface QueryPerformanceMetrics {
  queryName: string;
  executionTime: number;
  resultCount: number;
  cacheHit: boolean;
  timestamp: Date;
  parameters?: any;
}

export interface PerformanceReport {
  totalQueries: number;
  averageExecutionTime: number;
  slowestQuery: QueryPerformanceMetrics;
  fastestQuery: QueryPerformanceMetrics;
  cacheHitRate: number;
  performanceIssues: string[];
}

class QueryPerformanceMonitor {
  private metrics: QueryPerformanceMetrics[] = [];
  private cache: Map<string, { data: any; timestamp: Date; ttl: number }> = new Map();
  
  // Performance thresholds (in milliseconds)
  private readonly PERFORMANCE_THRESHOLDS = {
    BOARD_MEMBERS: 100,    // AC requirement: < 100ms
    HALL_OF_FAME: 200,     // AC requirement: < 200ms
    MEMBER_SEARCH: 300,    // AC requirement: < 300ms
    GENERAL_QUERY: 500     // General threshold
  };

  /**
   * Execute query with performance monitoring
   */
  async executeWithMonitoring<T>(
    queryName: string,
    queryFn: () => Promise<T>,
    threshold: number = this.PERFORMANCE_THRESHOLDS.GENERAL_QUERY,
    cacheKey?: string,
    cacheTtl: number = 300000 // 5 minutes default
  ): Promise<T> {
    const startTime = performance.now();
    let cacheHit = false;
    let result: T;

    // Check cache first
    if (cacheKey && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp.getTime() < cached.ttl) {
        result = cached.data;
        cacheHit = true;
      } else {
        this.cache.delete(cacheKey);
      }
    }

    // Execute query if not cached
    if (!cacheHit) {
      try {
        result = await queryFn();
        
        // Cache the result
        if (cacheKey) {
          this.cache.set(cacheKey, {
            data: result,
            timestamp: new Date(),
            ttl: cacheTtl
          });
        }
      } catch (error) {
        const executionTime = performance.now() - startTime;
        this.recordMetrics(queryName, executionTime, 0, false, { error: error instanceof Error ? error.message : 'Unknown error' });
        throw error;
      }
    }

    const executionTime = performance.now() - startTime;
    const resultCount = Array.isArray(result) ? result.length : 1;
    
    this.recordMetrics(queryName, executionTime, resultCount, cacheHit);

    // Log performance warnings
    if (executionTime > threshold && !cacheHit) {
      console.warn(`⚠️ Slow query detected: ${queryName} took ${executionTime.toFixed(2)}ms (threshold: ${threshold}ms)`);
    }

    return result!;
  }

  /**
   * Get optimized board members query
   */
  async getOptimizedBoardMembers(): Promise<EnhancedMember[]> {
    return this.executeWithMonitoring(
      'getBoardMembers',
      async () => {
        const q = query(
          collection(db, 'members'),
          where('governance.boardMember.active', '==', true),
          where('membership.status', '==', 'active'),
          orderBy('governance.boardMember.order')
        );
        
        const querySnapshot = await getDocs(q);
        return this.convertToEnhancedMembers(querySnapshot.docs);
      },
      this.PERFORMANCE_THRESHOLDS.BOARD_MEMBERS,
      'board_members',
      300000 // 5 minute cache
    );
  }

  /**
   * Get optimized hall of fame members query
   */
  async getOptimizedHallOfFameMembers(): Promise<EnhancedMember[]> {
    return this.executeWithMonitoring(
      'getHallOfFameMembers',
      async () => {
        const q = query(
          collection(db, 'members'),
          where('recognition.hallOfFame.inducted', '==', true),
          orderBy('recognition.hallOfFame.inductionYear', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        return this.convertToEnhancedMembers(querySnapshot.docs);
      },
      this.PERFORMANCE_THRESHOLDS.HALL_OF_FAME,
      'hall_of_fame_members',
      600000 // 10 minute cache (changes less frequently)
    );
  }

  /**
   * Get optimized past presidents query
   */
  async getOptimizedPastPresidents(): Promise<EnhancedMember[]> {
    return this.executeWithMonitoring(
      'getPastPresidents',
      async () => {
        const q = query(
          collection(db, 'members'),
          where('governance.pastPresident.isPastPresident', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        const pastPresidents = this.convertToEnhancedMembers(querySnapshot.docs);
        
        // Sort by most recent years served (client-side for now)
        return pastPresidents.sort((a, b) => {
          const aYears = a.governance.pastPresident.yearsServed || [];
          const bYears = b.governance.pastPresident.yearsServed || [];
          const aLatest = Math.max(...aYears, 0);
          const bLatest = Math.max(...bYears, 0);
          return bLatest - aLatest;
        });
      },
      this.PERFORMANCE_THRESHOLDS.GENERAL_QUERY,
      'past_presidents',
      600000 // 10 minute cache
    );
  }

  /**
   * Optimized member directory search
   */
  async searchMembersOptimized(searchTerm: string, filters?: {
    boardMembersOnly?: boolean;
    hallOfFameOnly?: boolean;
    activeOnly?: boolean;
  }): Promise<EnhancedMember[]> {
    const cacheKey = `search_${searchTerm}_${JSON.stringify(filters)}`;
    
    return this.executeWithMonitoring(
      'searchMembers',
      async () => {
        let q = query(collection(db, 'members'));
        
        // Apply filters with optimized compound queries
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
        const allMembers = this.convertToEnhancedMembers(querySnapshot.docs);
        
        // Client-side search optimization
        if (!searchTerm.trim()) {
          return allMembers;
        }
        
        const searchLower = searchTerm.toLowerCase();
        return allMembers.filter(member => {
          const fullName = `${member.personalInfo.firstName} ${member.personalInfo.lastName}`.toLowerCase();
          const email = member.personalInfo.email?.toLowerCase() || '';
          const organization = member.affiliations[0]?.title?.toLowerCase() || '';
          
          return fullName.includes(searchLower) || 
                 email.includes(searchLower) || 
                 organization.includes(searchLower);
        });
      },
      this.PERFORMANCE_THRESHOLDS.MEMBER_SEARCH,
      cacheKey,
      60000 // 1 minute cache for searches
    );
  }

  /**
   * Generate performance report
   */
  getPerformanceReport(): PerformanceReport {
    if (this.metrics.length === 0) {
      return {
        totalQueries: 0,
        averageExecutionTime: 0,
        slowestQuery: {} as QueryPerformanceMetrics,
        fastestQuery: {} as QueryPerformanceMetrics,
        cacheHitRate: 0,
        performanceIssues: []
      };
    }

    const totalExecutionTime = this.metrics.reduce((sum, m) => sum + m.executionTime, 0);
    const cacheHits = this.metrics.filter(m => m.cacheHit).length;
    const slowestQuery = this.metrics.reduce((max, m) => m.executionTime > max.executionTime ? m : max);
    const fastestQuery = this.metrics.reduce((min, m) => m.executionTime < min.executionTime ? m : min);

    const performanceIssues: string[] = [];
    
    // Check for performance issues
    this.metrics.forEach(metric => {
      const threshold = this.getThresholdForQuery(metric.queryName);
      if (metric.executionTime > threshold && !metric.cacheHit) {
        performanceIssues.push(`${metric.queryName} exceeded threshold: ${metric.executionTime.toFixed(2)}ms > ${threshold}ms`);
      }
    });

    // Check cache hit rate
    const cacheHitRate = (cacheHits / this.metrics.length) * 100;
    if (cacheHitRate < 30) {
      performanceIssues.push(`Low cache hit rate: ${cacheHitRate.toFixed(1)}%`);
    }

    return {
      totalQueries: this.metrics.length,
      averageExecutionTime: totalExecutionTime / this.metrics.length,
      slowestQuery,
      fastestQuery,
      cacheHitRate,
      performanceIssues
    };
  }

  /**
   * Clear performance metrics and cache
   */
  clearMetrics(): void {
    this.metrics = [];
    this.cache.clear();
  }

  /**
   * Export performance metrics for analysis
   */
  exportMetrics(): QueryPerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Private helper methods
   */
  private recordMetrics(
    queryName: string,
    executionTime: number,
    resultCount: number,
    cacheHit: boolean,
    parameters?: any
  ): void {
    this.metrics.push({
      queryName,
      executionTime,
      resultCount,
      cacheHit,
      timestamp: new Date(),
      parameters
    });

    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  private getThresholdForQuery(queryName: string): number {
    switch (queryName) {
      case 'getBoardMembers': return this.PERFORMANCE_THRESHOLDS.BOARD_MEMBERS;
      case 'getHallOfFameMembers': return this.PERFORMANCE_THRESHOLDS.HALL_OF_FAME;
      case 'searchMembers': return this.PERFORMANCE_THRESHOLDS.MEMBER_SEARCH;
      default: return this.PERFORMANCE_THRESHOLDS.GENERAL_QUERY;
    }
  }

  private convertToEnhancedMembers(docs: any[]): EnhancedMember[] {
    return docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        personalInfo: data.personalInfo || { firstName: '', lastName: '' },
        governance: data.governance || {
          boardMember: { active: false, position: { title: 'Director', level: 6 }, order: 99 },
          pastPresident: { isPastPresident: false }
        },
        recognition: data.recognition || {
          hallOfFame: { inducted: false },
          awards: []
        },
        affiliations: data.affiliations || [],
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
          createdAt: data.metadata?.createdAt?.toDate() || new Date(),
          updatedAt: data.metadata?.updatedAt?.toDate() || new Date(),
          createdBy: data.metadata?.createdBy,
          migrationSource: data.metadata?.migrationSource
        },
        image: data.image
      };
    });
  }
}

// Export singleton instance
export const queryPerformanceMonitor = new QueryPerformanceMonitor();

/**
 * Validate query performance against acceptance criteria
 */
export async function validateQueryPerformance(): Promise<{
  boardMembersPerformance: { averageTime: number; passed: boolean };
  hallOfFamePerformance: { averageTime: number; passed: boolean };
  memberSearchPerformance: { averageTime: number; passed: boolean };
  overallPassed: boolean;
  issues: string[];
}> {
  console.log('🔍 Validating query performance against acceptance criteria...');
  
  const issues: string[] = [];
  
  // Test board members query
  const boardStartTime = performance.now();
  await queryPerformanceMonitor.getOptimizedBoardMembers();
  const boardTime = performance.now() - boardStartTime;
  const boardPassed = boardTime < 100; // AC requirement
  
  if (!boardPassed) {
    issues.push(`Board members query failed: ${boardTime.toFixed(2)}ms > 100ms`);
  }
  
  // Test hall of fame query
  const hofStartTime = performance.now();
  await queryPerformanceMonitor.getOptimizedHallOfFameMembers();
  const hofTime = performance.now() - hofStartTime;
  const hofPassed = hofTime < 200; // AC requirement
  
  if (!hofPassed) {
    issues.push(`Hall of Fame query failed: ${hofTime.toFixed(2)}ms > 200ms`);
  }
  
  // Test member search query
  const searchStartTime = performance.now();
  await queryPerformanceMonitor.searchMembersOptimized('test');
  const searchTime = performance.now() - searchStartTime;
  const searchPassed = searchTime < 300; // AC requirement
  
  if (!searchPassed) {
    issues.push(`Member search query failed: ${searchTime.toFixed(2)}ms > 300ms`);
  }
  
  const overallPassed = boardPassed && hofPassed && searchPassed;
  
  console.log(`Query Performance Results:`);
  console.log(`  - Board Members: ${boardTime.toFixed(2)}ms (${boardPassed ? 'PASS' : 'FAIL'})`);
  console.log(`  - Hall of Fame: ${hofTime.toFixed(2)}ms (${hofPassed ? 'PASS' : 'FAIL'})`);
  console.log(`  - Member Search: ${searchTime.toFixed(2)}ms (${searchPassed ? 'PASS' : 'FAIL'})`);
  console.log(`  - Overall: ${overallPassed ? 'PASS' : 'FAIL'}`);
  
  return {
    boardMembersPerformance: { averageTime: boardTime, passed: boardPassed },
    hallOfFamePerformance: { averageTime: hofTime, passed: hofPassed },
    memberSearchPerformance: { averageTime: searchTime, passed: searchPassed },
    overallPassed,
    issues
  };
}