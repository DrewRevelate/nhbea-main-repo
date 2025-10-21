'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AuditLog } from '../../types/admin';

interface AuditTrailProps {
  adminUserId?: string;
  resourceType?: string;
  resourceId?: string;
  maxItems?: number;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({
  adminUserId,
  resourceType,
  resourceId,
  maxItems = 50
}) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        setError(null);

        let q = query(
          collection(db, 'audit_logs'),
          orderBy('timestamp', 'desc'),
          limit(maxItems)
        );

        // Add filters if provided
        if (adminUserId) {
          q = query(q, where('adminUserId', '==', adminUserId));
        }
        if (resourceType) {
          q = query(q, where('resourceType', '==', resourceType));
        }
        if (resourceId) {
          q = query(q, where('resourceId', '==', resourceId));
        }

        const querySnapshot = await getDocs(q);
        const logs = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        } as AuditLog));

        setAuditLogs(logs);
      } catch (error: any) {
        console.error('Error fetching audit logs:', error);
        setError('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [adminUserId, resourceType, resourceId, maxItems]);

  const getActionIcon = (action: AuditLog['action']) => {
    switch (action) {
      case 'create':
        return (
          <div className="bg-green-100 rounded-full p-1">
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'update':
        return (
          <div className="bg-blue-100 rounded-full p-1">
            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case 'delete':
        return (
          <div className="bg-red-100 rounded-full p-1">
            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        );
      case 'publish':
        return (
          <div className="bg-purple-100 rounded-full p-1">
            <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'unpublish':
        return (
          <div className="bg-orange-100 rounded-full p-1">
            <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 4h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17.294 15M10 14l4-2" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-full p-1">
            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatActionText = (log: AuditLog) => {
    const resourceTypeText = log.resourceType.replace(/([A-Z])/g, ' $1').toLowerCase();
    const actionText = log.action.charAt(0).toUpperCase() + log.action.slice(1);
    
    return `${actionText} ${resourceTypeText}`;
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Unknown time';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-navy-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mt-4">No activity found</h3>
        <p className="text-gray-500 mt-2">
          No audit logs match the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flow-root">
        <ul className="-mb-8">
          {auditLogs.map((log, index) => (
            <li key={log.id}>
              <div className="relative pb-8">
                {index !== auditLogs.length - 1 && (
                  <span
                    className="absolute top-6 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div className="flex-shrink-0">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{log.adminDisplayName}</span>{' '}
                        {formatActionText(log)}
                        {log.resourceId && (
                          <span className="text-gray-500"> ({log.resourceId})</span>
                        )}
                      </p>
                      {log.changes && (
                        <div className="mt-2 text-xs text-gray-500">
                          {log.changes.before && log.changes.after && (
                            <details className="mt-1">
                              <summary className="cursor-pointer text-navy-600 hover:text-navy-800">
                                View changes
                              </summary>
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <strong>Before:</strong>
                                    <pre className="mt-1 whitespace-pre-wrap">
                                      {JSON.stringify(log.changes.before, null, 2)}
                                    </pre>
                                  </div>
                                  <div>
                                    <strong>After:</strong>
                                    <pre className="mt-1 whitespace-pre-wrap">
                                      {JSON.stringify(log.changes.after, null, 2)}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </details>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={log.timestamp?.toDate?.()?.toISOString()}>
                        {formatTimestamp(log.timestamp)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};