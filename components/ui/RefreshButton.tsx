import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface RefreshButtonProps {
  onRefresh?: () => Promise<void>;
  onClick?: () => void;  // Añadir soporte para onClick
  className?: string;
}

export default function RefreshButton({ 
  onRefresh, 
  onClick,
  className = '' 
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    // Si se proporciona onClick, úsalo
    if (onClick) {
      onClick();
      return;
    }
    
    // De lo contrario, usa onRefresh con la lógica asíncrona
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`inline-flex items-center justify-center p-2
        rounded-lg bg-gray-700/50 hover:bg-gray-700/80
        text-gray-300 hover:text-white transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-blue-500/40
        ${className}`}
      aria-label="Actualizar datos"
    >
      <ArrowPathIcon 
        className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} 
      />
    </button>
  );
}