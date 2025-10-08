import { XMarkIcon } from '@heroicons/react/24/outline';

interface TagProps {
  label: string;
  onRemove?: () => void;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
}

export default function Tag({
  label,
  onRemove,
  color = 'blue',
}: TagProps) {
  const colors = {
    blue: 'bg-blue-400/20 text-blue-400',
    green: 'bg-green-400/20 text-green-400',
    red: 'bg-red-400/20 text-red-400',
    yellow: 'bg-yellow-400/20 text-yellow-400',
    purple: 'bg-purple-400/20 text-purple-400',
    gray: 'bg-gray-400/20 text-gray-400',
  };

  return (
    <span className={`
      inline-flex items-center rounded-md px-2 py-1
      text-xs font-medium ${colors[color]}
    `}>
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-white"
        >
          <XMarkIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}