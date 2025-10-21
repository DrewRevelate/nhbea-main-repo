'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getMemberImageUrl } from '@/lib/imageUtils';

interface MemberImageProps {
  imagePath?: string;
  memberName: string;
  className?: string;
  width?: number;
  height?: number;
  containerClassName?: string;
}

export default function MemberImage({ 
  imagePath, 
  memberName, 
  className = "w-full h-full object-cover rounded-full",
  width = 80,
  height = 80,
  containerClassName = "w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--nhbea-royal-blue-subtle)] to-[var(--nhbea-royal-blue-light)] flex items-center justify-center"
}: MemberImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!imagePath);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!imagePath) {
      setIsLoading(false);
      return;
    }

    async function loadImage() {
      try {
        setIsLoading(true);
        setHasError(false);
        const url = await getMemberImageUrl(imagePath);
        setImageUrl(url);
      } catch (error) {
        console.warn('Failed to load member image:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadImage();
  }, [imagePath]);

  // Show placeholder while loading or if no image/error
  if (isLoading || !imageUrl || hasError) {
    return (
      <div className={containerClassName}>
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-[var(--nhbea-royal-blue)] border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-10 h-10 text-[var(--nhbea-royal-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className={`${containerClassName} overflow-hidden`}>
      <Image
        src={imageUrl}
        alt={`${memberName} photo`}
        width={width}
        height={height}
        className={className}
        onError={() => setHasError(true)}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkRMUUaH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABgRAAMBAQAAAAAAAAAAAAAAAAABAhEh/9oADAMBAAIRAxEAPwDLcc4//9k="
        sizes="80px"
      />
    </div>
  );
}