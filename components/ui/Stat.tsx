import { ReactNode } from 'react';

interface StatProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isUpward: boolean;
  };
  className?: string;
}

export default function Stat({
  title,
  value,
  description,
  icon,
  trend,
  className = '',
}: StatProps) {
  return (
    <div className={`p-4 bg-gray-800/60 border border-gray-700 rounded-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          
          {description && (
            <p className="text-xs text-gray-400 mt-1">{description}</p>
          )}
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                ${trend.isUpward ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}
              >
                {trend.isUpward ? (
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 bg-gray-700/50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}