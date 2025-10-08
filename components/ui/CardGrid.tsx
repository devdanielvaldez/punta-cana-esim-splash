import { ReactNode } from 'react';

interface CardGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CardGrid({
  children,
  cols = 3,
  gap = 'md',
  className = '',
}: CardGridProps) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
  };
  
  const gapClass = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={`grid ${colsClass[cols]} ${gapClass[gap]} ${className}`}>
      {children}
    </div>
  );
}