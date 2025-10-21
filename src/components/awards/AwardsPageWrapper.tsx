'use client';

import React from 'react';
import { AwardsPage } from './AwardsPage';
import type { Award } from '@/types/dataModels';

interface AwardsPageWrapperProps {
  awards: Award[];
}

export const AwardsPageWrapper: React.FC<AwardsPageWrapperProps> = ({ awards }) => {
  // Handle nomination action
  const handleNominate = (awardId: string) => {
    // Redirect to the existing nomination page
    window.location.href = `/awards/nominate?award=${awardId}`;
  };

  // Handle view details action  
  const handleViewDetails = (awardId: string) => {
    // Redirect to the nomination page as fallback
    // In the future, this could open a modal or details page
    window.location.href = `/awards/nominate?award=${awardId}`;
  };

  return (
    <AwardsPage
      awards={awards}
      onNominate={handleNominate}
      onViewDetails={handleViewDetails}
    />
  );
};