'use client';

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'image' | 'room-card' | 'user-profile';
  width?: string;
  height?: string;
  rows?: number;
  className?: string;
  animate?: boolean;
}

const SkeletonLoader = ({ 
  variant = 'text',
  width = 'w-full',
  height = 'h-4',
  rows = 1,
  className = '',
  animate = true
}: SkeletonLoaderProps) => {
  const baseClasses = `
    bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
    ${animate ? 'animate-pulse' : ''}
    transition-all duration-300 ease-in-out
  `;

  const shimmerClasses = `
    ${baseClasses}
    bg-[length:200%_100%] 
    ${animate ? 'animate-[shimmer_2s_infinite]' : ''}
  `;

  if (variant === 'text') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div 
            key={index}
            className={`
              ${shimmerClasses} 
              ${width} 
              ${index === rows - 1 && rows > 1 ? 'w-3/4' : width}
              ${height} 
              rounded-md
            `}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${width} ${height} rounded-xl ${className}`} />
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={`${shimmerClasses} w-12 h-12 rounded-full ${className}`} />
    );
  }

  if (variant === 'button') {
    return (
      <div className={`${shimmerClasses} ${width} h-10 rounded-lg ${className}`} />
    );
  }

  if (variant === 'image') {
    return (
      <div className={`${shimmerClasses} ${width} ${height} rounded-lg ${className}`} />
    );
  }

  if (variant === 'room-card') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
        {/* Image skeleton */}
        <div className={`${shimmerClasses} w-full h-48`} />
        
        {/* Content skeleton */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div className={`${shimmerClasses} w-3/4 h-6 rounded-md`} />
          
          {/* Description */}
          <div className="space-y-2">
            <div className={`${shimmerClasses} w-full h-4 rounded-md`} />
            <div className={`${shimmerClasses} w-5/6 h-4 rounded-md`} />
          </div>
          
          {/* Price and details */}
          <div className="flex justify-between items-center pt-2">
            <div className={`${shimmerClasses} w-24 h-6 rounded-md`} />
            <div className={`${shimmerClasses} w-16 h-4 rounded-md`} />
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <div className={`${shimmerClasses} flex-1 h-12 rounded-lg`} />
            <div className={`${shimmerClasses} flex-1 h-12 rounded-lg`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'user-profile') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center space-x-4 p-6">
          {/* Avatar */}
          <div className={`${shimmerClasses} w-16 h-16 rounded-full`} />
          
          {/* User info */}
          <div className="flex-1 space-y-2">
            <div className={`${shimmerClasses} w-32 h-5 rounded-md`} />
            <div className={`${shimmerClasses} w-24 h-4 rounded-md`} />
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className={`${shimmerClasses} ${width} ${height} rounded-md ${className}`} />
  );
};

export default SkeletonLoader;
