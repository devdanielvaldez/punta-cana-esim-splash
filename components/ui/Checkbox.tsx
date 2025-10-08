import { ChangeEvent } from 'react';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
  id,
}: CheckboxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  const uniqueId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          id={uniqueId}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={`
            w-4 h-4 bg-gray-800 border-gray-600 rounded
            focus:ring-blue-600 focus:ring-offset-gray-800
            text-blue-600 transition-colors duration-200
            ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
            ${error ? 'border-red-500' : ''}
          `}
        />
      </div>
      <div className="ml-2 text-sm">
        {label && (
          <label
            htmlFor={uniqueId}
            className={`
              font-medium
              ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300 cursor-pointer'}
            `}
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}