import { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  actions?: ReactNode;
}

export default function InfoCard({
  title,
  icon,
  children,
  variant = 'info',
  actions,
}: InfoCardProps) {
  const variants = {
    info: 'bg-blue-400/10 border-blue-400',
    success: 'bg-green-400/10 border-green-400',
    warning: 'bg-yellow-400/10 border-yellow-400',
    danger: 'bg-red-400/10 border-red-400',
  };

  const iconColors = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
  };

  return (
    <div className={`p-4 rounded-lg border ${variants[variant]}`}>
      <div className="flex items-start">
        <div className={`mr-3 ${iconColors[variant]}`}>
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className={`text-base font-medium ${iconColors[variant]}`}>
            {title}
          </h3>
          <div className="mt-2 text-sm text-gray-300">
            {children}
          </div>
          
          {actions && (
            <div className="mt-3 flex items-center justify-end">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}