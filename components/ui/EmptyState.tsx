import { ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full
        bg-gray-700/50 text-gray-400 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}