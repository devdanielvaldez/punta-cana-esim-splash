import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
}: CardProps) {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  return (
    <div
      className={`
        bg-gray-800/60 backdrop-blur-md
        border border-gray-700 rounded-xl
        shadow-xl overflow-hidden
        ${hover ? 'transition-transform duration-300 hover:scale-[1.02]' : ''}
        ${paddings[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}