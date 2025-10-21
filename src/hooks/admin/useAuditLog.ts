'use client';

import { useCallback } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAdminAuth } from './useAdminAuth';
import { AuditLog } from '../../types/admin';

export const useAuditLog = () => {
  const { adminUser } = useAdminAuth();

  const logAction = useCallback(async (
    action: AuditLog['action'],
    resourceType: AuditLog['resourceType'],
    resourceId: string,
    changes?: AuditLog['changes']
  ) => {
    if (!adminUser) {
      console.warn('Cannot log audit action: no admin user');
      return;
    }

    try {
      const auditLogData: Omit<AuditLog, 'id' | 'timestamp'> = {
        adminUserId: adminUser.uid,
        adminDisplayName: adminUser.displayName,
        action,
        resourceType,
        resourceId,
        changes,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        // Note: IP address would need to be obtained from server-side
      };

      await addDoc(collection(db, 'audit_logs'), {
        ...auditLogData,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to log audit action:', error);
    }
  }, [adminUser]);

  const logUserCreated = useCallback((userId: string, userData: any) => {
    return logAction('create', 'user', userId, { after: userData });
  }, [logAction]);

  const logUserUpdated = useCallback((userId: string, before: any, after: any) => {
    return logAction('update', 'user', userId, { before, after });
  }, [logAction]);

  const logUserDeleted = useCallback((userId: string, userData: any) => {
    return logAction('delete', 'user', userId, { before: userData });
  }, [logAction]);

  const logContentCreated = useCallback((contentId: string, contentData: any) => {
    return logAction('create', 'content', contentId, { after: contentData });
  }, [logAction]);

  const logContentUpdated = useCallback((contentId: string, before: any, after: any) => {
    return logAction('update', 'content', contentId, { before, after });
  }, [logAction]);

  const logContentPublished = useCallback((contentId: string) => {
    return logAction('publish', 'content', contentId);
  }, [logAction]);

  const logContentUnpublished = useCallback((contentId: string) => {
    return logAction('unpublish', 'content', contentId);
  }, [logAction]);

  return {
    logAction,
    logUserCreated,
    logUserUpdated,
    logUserDeleted,
    logContentCreated,
    logContentUpdated,
    logContentPublished,
    logContentUnpublished,
  };
};