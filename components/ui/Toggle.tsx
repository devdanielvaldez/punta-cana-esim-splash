import { Switch } from '@headlessui/react';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Toggle({
  enabled,
  onChange,
  label,
  size = 'md',
}: ToggleProps) {
  const sizes = {
    sm: {
      switch: 'h-5 w-9',
      translate: 'translate-x-4',
      circle: 'h-3 w-3',
    },
    md: {
      switch: 'h-6 w-11',
      translate: 'translate-x-5',
      circle: 'h-4 w-4',
    },
    lg: {
      switch: 'h-7 w-14',
      translate: 'translate-x-7',
      circle: 'h-5 w-5',
    },
  };

  return (
    <Switch.Group>
      <div className="flex items-center">
        {label && (
          <Switch.Label className="mr-3 text-sm text-gray-300">
            {label}
          </Switch.Label>
        )}
        <Switch
          checked={enabled}
          onChange={onChange}
          className={`
            ${enabled ? 'bg-blue-600' : 'bg-gray-700'}
            relative inline-flex items-center
            ${sizes[size].switch} rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            focus:ring-offset-gray-800
          `}
        >
          <span
            className={`
              ${enabled ? sizes[size].translate : 'translate-x-1'}
              inline-block ${sizes[size].circle} transform
              rounded-full bg-white transition duration-200 ease-in-out
            `}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
}