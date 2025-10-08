import React from 'react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses: any = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`${className}`}>
      <div className={`${sizeClass} border-4 border-t-indigo-600 border-r-indigo-200 border-b-indigo-200 border-l-indigo-200 rounded-full animate-spin`}></div>
    </div>
  );
}