import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  backButton?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  children,
  backButton,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {backButton && backButton}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          )}
        </div>
      </div>
      {children && <div className="md:ml-auto">{children}</div>}
    </div>
  );
}