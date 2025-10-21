'use client';

import { AdminLayout } from '../../../components/admin/AdminLayout';
import { PermissionGuard } from '../../../components/admin/PermissionGuard';
import { useState, useEffect, Suspense, lazy } from 'react';
import { adminAwardsRepository } from '../../../lib/awards';
// import { useToast } from '../../../components/ui/toast/ToastProvider';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { db } from '../../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import type { Award } from '../../../types/dataModels';

// Lazy load the heavy AwardForm component
const AwardForm = lazy(() => import('./AwardForm').then(module => ({ default: module.AwardForm })));


interface Nomination {
  id: string;
  awardId: string;
  awardName: string;
  nominee: {
    firstName: string;
    lastName: string;
    email: string;
    organization?: string;
    title?: string;
  };
  nominator: {
    firstName: string;
    lastName: string;
    email: string;
    organization?: string;
  };
  nominationText: string;
  supportingDocuments?: string[];
  status: 'submitted' | 'under_review' | 'finalist' | 'selected' | 'not_selected';
  reviewScore?: number;
  reviewComments?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export default function AwardsPage() {
  // Temporarily comment out useToast to fix build issue
  // const { showSuccess, showError } = useToast();
  const showSuccess = (title: string, message: string) => alert(`${title}: ${message}`);
  const showError = (title: string, message: string) => alert(`${title}: ${message}`);
  const [awards, setAwards] = useState<Award[]>([]);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'awards' | 'nominations' | 'review'>('overview');
  const [selectedAward, setSelectedAward] = useState<string>('');
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [reviewingNomination, setReviewingNomination] = useState<Nomination | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewScore, setReviewScore] = useState<number>(0);
  const [reviewComments, setReviewComments] = useState('');

  useEffect(() => {
    // Set up real-time listener for awards using our new repository
    const unsubscribeAwards = adminAwardsRepository.subscribeToAwards((awardsData) => {
      setAwards(awardsData);
      setLoading(false);
      
      // Set default selected award if none selected
      if (awardsData.length > 0 && !selectedAward) {
        setSelectedAward(awardsData[0].id);
      }
    });

    // Note: For nominations, we'll keep the existing Firestore listener for now
    // This could be moved to a nominations repository later
    const nominationsQuery = query(collection(db, 'nominations'), orderBy('submittedAt', 'desc'));
    const unsubscribeNominations = onSnapshot(nominationsQuery, (snapshot) => {
      const nominationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate(),
        reviewedAt: doc.data().reviewedAt?.toDate()
      })) as Nomination[];
      
      setNominations(nominationsData);
    }, (error) => {
      console.error('Error in nominations listener:', error);
      showError('Error Loading Nominations', 'Failed to load nominations data');
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeAwards();
      unsubscribeNominations();
    };
  }, [selectedAward, showError]);

  // Data loading is now handled by real-time listeners in useEffect

  const getAwardStats = (awardId: string) => {
    const awardNominations = nominations.filter(nom => nom.awardId === awardId);
    return {
      total: awardNominations.length,
      submitted: awardNominations.filter(nom => nom.status === 'submitted').length,
      underReview: awardNominations.filter(nom => nom.status === 'under_review').length,
      finalists: awardNominations.filter(nom => nom.status === 'finalist').length,
      selected: awardNominations.filter(nom => nom.status === 'selected').length
    };
  };

  const getOverallStats = () => {
    return {
      totalAwards: awards.length,
      activeAwards: awards.filter(award => award.isActive).length,
      totalNominations: nominations.length,
      pendingReview: nominations.filter(nom => nom.status === 'submitted').length,
      finalists: nominations.filter(nom => nom.status === 'finalist').length,
      upcomingDeadlines: awards.filter(award => 
        award.isActive && 
        award.deadline && 
        award.deadline > new Date() && 
        award.deadline < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length
    };
  };

  const handleReviewNomination = async (action: 'approve' | 'reject' | 'finalist') => {
    if (!reviewingNomination) return;

    try {
      const nominationRef = doc(db, 'nominations', reviewingNomination.id);
      
      let newStatus = reviewingNomination.status;
      switch (action) {
        case 'approve':
          newStatus = 'under_review';
          break;
        case 'finalist':
          newStatus = 'finalist';
          break;
        case 'reject':
          newStatus = 'not_selected';
          break;
      }

      await updateDoc(nominationRef, {
        status: newStatus,
        reviewScore: reviewScore,
        reviewComments: reviewComments,
        reviewedAt: new Date(),
        reviewedBy: 'current-admin-user' // Replace with actual user ID
      });

      setShowReviewModal(false);
      setReviewingNomination(null);
      setReviewScore(0);
      setReviewComments('');
    } catch (error) {
      console.error('Error updating nomination:', error);
      alert('Error updating nomination');
    }
  };

  const handleSaveAward = async (awardData: Partial<Award>) => {
    try {
      if (editingAward) {
        // Update existing award
        await adminAwardsRepository.updateAward(editingAward.id, awardData);
        showSuccess('Award Updated', 'Award has been updated successfully');
      } else {
        // Create new award
        await adminAwardsRepository.createAward(awardData as Omit<Award, 'id' | 'createdAt' | 'updatedAt'>);
        showSuccess('Award Created', 'New award has been created successfully');
      }
      
      setShowAwardModal(false);
      setEditingAward(null);
    } catch (error) {
      console.error('Error saving award:', error);
      showError('Save Failed', 'Failed to save award. Please try again.');
      throw error;
    }
  };

  const handleToggleAwardStatus = async (awardId: string) => {
    try {
      await adminAwardsRepository.toggleAwardStatus(awardId);
      showSuccess('Status Updated', 'Award status has been updated successfully');
    } catch (error) {
      console.error('Error toggling award status:', error);
      showError('Status Update Failed', 'Failed to update award status. Please try again.');
    }
  };

  const handleDeleteAward = async (awardId: string) => {
    if (confirm('Are you sure you want to delete this award? This action cannot be undone.')) {
      try {
        await adminAwardsRepository.deleteAward(awardId);
        showSuccess('Award Deleted', 'Award has been deleted successfully');
      } catch (error) {
        console.error('Error deleting award:', error);
        showError('Delete Failed', 'Failed to delete award. Please try again.');
      }
    }
  };

  const exportNominations = (awardId?: string) => {
    const filteredNominations = awardId 
      ? nominations.filter(nom => nom.awardId === awardId)
      : nominations;

    const csvData = filteredNominations.map(nom => ({
      'Award': nom.awardName,
      'Nominee First Name': nom.nominee.firstName,
      'Nominee Last Name': nom.nominee.lastName,
      'Nominee Email': nom.nominee.email,
      'Nominee Organization': nom.nominee.organization || '',
      'Nominee Title': nom.nominee.title || '',
      'Nominator First Name': nom.nominator.firstName,
      'Nominator Last Name': nom.nominator.lastName,
      'Nominator Email': nom.nominator.email,
      'Nominator Organization': nom.nominator.organization || '',
      'Status': nom.status,
      'Review Score': nom.reviewScore || '',
      'Submitted Date': nom.submittedAt.toLocaleDateString(),
      'Reviewed Date': nom.reviewedAt?.toLocaleDateString() || ''
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nhbea-nominations${awardId ? '-' + awards.find(a => a.id === awardId)?.name.replace(/\s+/g, '-') : ''}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      finalist: 'bg-purple-100 text-purple-800',
      selected: 'bg-green-100 text-green-800',
      not_selected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const badges: Record<string, string> = {
      Excellence: 'bg-blue-100 text-blue-800',
      Lifetime: 'bg-purple-100 text-purple-800',
      Innovation: 'bg-green-100 text-green-800',
      Service: 'bg-yellow-100 text-yellow-800',
      'Rising Star': 'bg-pink-100 text-pink-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[category] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  const selectedAwardNominations = nominations.filter(nom => nom.awardId === selectedAward);
  const overallStats = getOverallStats();

  return (
    <AdminLayout>
      <PermissionGuard requiredPermission="canEditContent">
        <div className="space-y-6">
          {/* Header */}
          <div className="nhbea-card">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="heading-2 text-[var(--nhbea-royal-blue-dark)]">Awards Management</h1>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Manage awards, nominations, and selection process
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingAward(null);
                    setShowAwardModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)]"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Award
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="nhbea-card">
            <div className="px-6">
              <nav className="flex space-x-8" aria-label="Tabs">
                {[
                  { key: 'overview', label: 'Overview' },
                  { key: 'awards', label: 'Awards' },
                  { key: 'nominations', label: 'Nominations' },
                  { key: 'review', label: 'Review Process' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.key
                        ? 'border-[var(--nhbea-royal-blue)] text-[var(--nhbea-royal-blue)]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="nhbea-card">
                  <div className="px-4 py-3">
                    <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Total Awards
                    </div>
                    <div className="text-2xl font-bold text-[var(--nhbea-royal-blue)]">
                      {overallStats.totalAwards}
                    </div>
                  </div>
                </div>
                <div className="nhbea-card">
                  <div className="px-4 py-3">
                    <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Active Awards
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {overallStats.activeAwards}
                    </div>
                  </div>
                </div>
                <div className="nhbea-card">
                  <div className="px-4 py-3">
                    <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Total Nominations
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {overallStats.totalNominations}
                    </div>
                  </div>
                </div>
                <div className="nhbea-card">
                  <div className="px-4 py-3">
                    <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Pending Review
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {overallStats.pendingReview}
                    </div>
                  </div>
                </div>
                <div className="nhbea-card">
                  <div className="px-4 py-3">
                    <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Finalists
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {overallStats.finalists}
                    </div>
                  </div>
                </div>
                <div className="nhbea-card">
                  <div className="px-4 py-3">
                    <div className="text-sm font-medium text-[var(--color-text-secondary)]">
                      Upcoming Deadlines
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {overallStats.upcomingDeadlines}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="nhbea-card">
                  <div className="px-6 py-4">
                    <h3 className="heading-4 text-[var(--nhbea-royal-blue-dark)] mb-4">Recent Nominations</h3>
                    <div className="space-y-3">
                      {nominations.slice(0, 5).map((nomination) => (
                        <div key={nomination.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                          <div>
                            <div className="text-sm font-medium text-[var(--color-text-primary)]">
                              {nomination.nominee.firstName} {nomination.nominee.lastName}
                            </div>
                            <div className="text-xs text-[var(--color-text-secondary)]">
                              {nomination.awardName}
                            </div>
                          </div>
                          {getStatusBadge(nomination.status)}
                        </div>
                      ))}
                      {nominations.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No nominations yet</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="nhbea-card">
                  <div className="px-6 py-4">
                    <h3 className="heading-4 text-[var(--nhbea-royal-blue-dark)] mb-4">Upcoming Deadlines</h3>
                    <div className="space-y-3">
                      {awards
                        .filter(award => award.isActive && award.deadline && award.deadline > new Date())
                        .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
                        .slice(0, 5)
                        .map((award) => {
                          const daysUntil = Math.ceil((award.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          return (
                            <div key={award.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                              <div>
                                <div className="text-sm font-medium text-[var(--color-text-primary)]">
                                  {award.name}
                                </div>
                                <div className="text-xs text-[var(--color-text-secondary)]">
                                  {award.deadline.toLocaleDateString()}
                                </div>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                daysUntil <= 7 ? 'bg-red-100 text-red-800' :
                                daysUntil <= 30 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {daysUntil} days
                              </span>
                            </div>
                          );
                        })}
                      {awards.filter(award => award.isActive && award.deadline && award.deadline > new Date()).length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Awards Tab */}
          {activeTab === 'awards' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button
                    onClick={() => exportNominations()}
                    className="inline-flex items-center px-3 py-2 border border-[var(--color-border-primary)] shadow-sm text-sm font-medium rounded-md text-[var(--color-text-primary)] bg-white hover:bg-gray-50"
                  >
                    Export All Nominations
                  </button>
                </div>
              </div>

              {awards.map((award) => {
                const stats = getAwardStats(award.id);
                const daysUntilDeadline = award.deadline ? Math.ceil((award.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
                
                return (
                  <div key={award.id} className="nhbea-card">
                    <div className="px-6 py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="heading-4 text-[var(--color-text-primary)]">{award.name}</h3>
                            {getCategoryBadge(award.category)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              award.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {award.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {daysUntilDeadline !== null && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                daysUntilDeadline <= 7 ? 'bg-red-100 text-red-800' :
                                daysUntilDeadline <= 30 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : 'Expired'}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[var(--color-text-secondary)] mb-3">{award.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="font-medium">Deadline:</span> {award.deadline?.toLocaleDateString() || 'No deadline set'}
                            </div>
                            <div>
                              <span className="font-medium">Nominations:</span> {stats.total}
                            </div>
                            <div>
                              <span className="font-medium">Under Review:</span> {stats.underReview}
                            </div>
                            <div>
                              <span className="font-medium">Finalists:</span> {stats.finalists}
                            </div>
                          </div>

                          <div className="text-sm">
                            <span className="font-medium">Eligibility:</span> {award.eligibility}
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => exportNominations(award.id)}
                            className="text-green-600 hover:text-green-700 text-sm px-2 py-1 rounded"
                            title="Export nominations"
                          >
                            Export
                          </button>
                          <button
                            onClick={() => handleToggleAwardStatus(award.id)}
                            className={`text-sm px-2 py-1 rounded ${
                              award.isActive 
                                ? 'text-yellow-600 hover:text-yellow-700'
                                : 'text-green-600 hover:text-green-700'
                            }`}
                            title={award.isActive ? 'Deactivate award' : 'Activate award'}
                          >
                            {award.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingAward(award);
                              setShowAwardModal(true);
                            }}
                            className="text-[var(--nhbea-royal-blue)] hover:text-[var(--nhbea-royal-blue-dark)] text-sm px-2 py-1 rounded"
                            title="Edit award"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAward(award.id)}
                            className="text-red-600 hover:text-red-700 text-sm px-2 py-1 rounded"
                            title="Delete award"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {awards.length === 0 && (
                <div className="nhbea-card">
                  <div className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No awards</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first award.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Nominations Tab */}
          {activeTab === 'nominations' && (
            <div className="space-y-4">
              {awards.length > 0 && (
                <div className="nhbea-card">
                  <div className="px-6 py-4">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                      Filter by Award
                    </label>
                    <select
                      value={selectedAward}
                      onChange={(e) => setSelectedAward(e.target.value)}
                      className="w-full max-w-md px-3 py-2 border border-[var(--color-border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--nhbea-royal-blue)] focus:border-[var(--nhbea-royal-blue)]"
                    >
                      <option value="">All Awards</option>
                      {awards.map((award) => (
                        <option key={award.id} value={award.id}>
                          {award.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="nhbea-card">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--color-border-primary)]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nominee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Award
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nominator
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[var(--color-border-primary)]">
                      {(selectedAward ? selectedAwardNominations : nominations).map((nomination) => (
                        <tr key={nomination.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-[var(--color-text-primary)]">
                                {nomination.nominee.firstName} {nomination.nominee.lastName}
                              </div>
                              <div className="text-sm text-[var(--color-text-secondary)]">
                                {nomination.nominee.organization}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[var(--color-text-primary)]">
                              {nomination.awardName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[var(--color-text-primary)]">
                              {nomination.nominator.firstName} {nomination.nominator.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(nomination.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[var(--color-text-primary)]">
                              {nomination.reviewScore || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-[var(--color-text-primary)]">
                              {nomination.submittedAt.toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setReviewingNomination(nomination);
                                setReviewScore(nomination.reviewScore || 0);
                                setReviewComments(nomination.reviewComments || '');
                                setShowReviewModal(true);
                              }}
                              className="text-[var(--nhbea-royal-blue)] hover:text-[var(--nhbea-royal-blue-dark)] mr-4"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {(selectedAward ? selectedAwardNominations : nominations).length === 0 && (
                    <div className="px-6 py-12 text-center">
                      <p className="text-gray-500">No nominations found.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Review Process Tab */}
          {activeTab === 'review' && (
            <div className="nhbea-card">
              <div className="px-6 py-4">
                <h3 className="heading-3 text-[var(--nhbea-royal-blue-dark)] mb-4">Review Process Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                      Review Criteria Template
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--nhbea-royal-blue)] focus:border-[var(--nhbea-royal-blue)]"
                      placeholder="Enter review criteria template..."
                      defaultValue="1. Innovation and Impact (25 points)\n2. Leadership Excellence (25 points)\n3. Community Contribution (25 points)\n4. Professional Achievement (25 points)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                      Scoring Scale (1-100)
                    </label>
                    <div className="text-sm text-[var(--color-text-secondary)]">
                      90-100: Outstanding | 80-89: Excellent | 70-79: Good | 60-69: Satisfactory | Below 60: Not recommended
                    </div>
                  </div>
                  <div className="pt-4">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--nhbea-royal-blue)] hover:bg-[var(--nhbea-royal-blue-dark)]">
                      Save Review Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && reviewingNomination && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Review Nomination - {reviewingNomination.nominee.firstName} {reviewingNomination.nominee.lastName}
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">Nominee Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {reviewingNomination.nominee.firstName} {reviewingNomination.nominee.lastName}</div>
                      <div><span className="font-medium">Email:</span> {reviewingNomination.nominee.email}</div>
                      <div><span className="font-medium">Organization:</span> {reviewingNomination.nominee.organization || 'N/A'}</div>
                      <div><span className="font-medium">Title:</span> {reviewingNomination.nominee.title || 'N/A'}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">Nominator Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {reviewingNomination.nominator.firstName} {reviewingNomination.nominator.lastName}</div>
                      <div><span className="font-medium">Email:</span> {reviewingNomination.nominator.email}</div>
                      <div><span className="font-medium">Organization:</span> {reviewingNomination.nominator.organization || 'N/A'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Nomination Text</h4>
                  <div className="p-3 bg-gray-50 rounded-md max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700">{reviewingNomination.nominationText}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Score (1-100)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={reviewScore}
                      onChange={(e) => setReviewScore(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Status
                    </label>
                    <div className="py-2">
                      {getStatusBadge(reviewingNomination.status)}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Comments
                  </label>
                  <textarea
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add your review comments..."
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReviewNomination('reject')}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Not Selected
                </button>
                <button
                  onClick={() => handleReviewNomination('approve')}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleReviewNomination('finalist')}
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Make Finalist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Award Modal */}
        {showAwardModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingAward ? 'Edit Award' : 'Create New Award'}
                </h3>
              </div>
              <div className="px-6 py-4">
                <Suspense fallback={<LoadingSpinner />}>
                  <AwardForm 
                    award={editingAward}
                    onSave={handleSaveAward}
                    onCancel={() => setShowAwardModal(false)}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        )}
      </PermissionGuard>
    </AdminLayout>
  );
}

// Force dynamic rendering for this page since it uses real-time data and toast notifications
export const dynamic = 'force-dynamic';