'use client';

import { useEffect, useState } from 'react';

interface SoftLoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
}

const SoftLoader = ({ 
  size = 'medium', 
  color = 'primary', 
  text,
  fullScreen = false,
  overlay = false,
  className = ''
}: SoftLoaderProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!text) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [text]);

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary/20 border-t-primary',
    white: 'border-white/20 border-t-white',
    gray: 'border-gray-300 border-t-gray-600'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const spinner = (
    <>
      {/* Main spinner */}
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          border-2 rounded-full 
          animate-spin 
          transition-all duration-300 ease-in-out
        `}
      />
      
      {/* Pulsing glow effect */}
      <div 
        className={`
          ${sizeClasses[size]} 
          absolute top-0 left-0
          ${color === 'primary' ? 'bg-primary/10' : color === 'white' ? 'bg-white/10' : 'bg-gray-400/10'}
          rounded-full 
          animate-pulse
          blur-sm
        `}
      />
      
      {/* Text with animated dots */}
      {text && (
        <p className={`
          mt-4 
          ${textSizeClasses[size]} 
          ${color === 'white' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}
          font-medium 
          transition-opacity duration-300
          min-w-[120px] text-center
        `}>
          {text}{dots}
        </p>
      )}
    </>
  );

  if (fullScreen) {
    return (
      <div className={`
        fixed inset-0 z-50 
        ${overlay ? 'bg-black/50 backdrop-blur-sm' : 'bg-white dark:bg-gray-900'}
        flex flex-col items-center justify-center
        transition-all duration-300 ease-in-out
        ${className}
      `}>
        <div className="relative flex flex-col items-center">
          {spinner}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="relative flex flex-col items-center">
        {spinner}
      </div>
    </div>
  );
};

export default SoftLoader;
