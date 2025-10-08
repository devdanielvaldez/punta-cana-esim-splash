interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  }
  
  export default function ProgressBar({
    value,
    max = 100,
    label,
    showValue = true,
    size = 'md',
    color = 'blue',
  }: ProgressBarProps) {
    // Asegurar que el valor está entre 0 y max
    const percentage = Math.min(Math.max(0, value), max);
    const percentageWidth = (percentage / max) * 100;
    
    const sizes = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };
    
    const colors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      red: 'bg-red-600',
      yellow: 'bg-yellow-600',
      purple: 'bg-purple-600',
      gray: 'bg-gray-600',
    };
  
    return (
      <div className="w-full">
        {(label || showValue) && (
          <div className="flex justify-between items-center mb-1">
            {label && (
              <span className="text-sm font-medium text-gray-300">
                {label}
              </span>
            )}
            {showValue && (
              <span className="text-sm text-gray-400">
                {percentage} / {max}
              </span>
            )}
          </div>
        )}
        
        <div className={`w-full bg-gray-700 rounded-full ${sizes[size]}`}>
          <div
            className={`${colors[color]} rounded-full ${sizes[size]}`}
            style={{ width: `${percentageWidth}%` }}
          />
        </div>
      </div>
    );
  }