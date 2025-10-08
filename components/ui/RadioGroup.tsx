import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  error?: string;
}

export default function RadioGroup({
  label,
  options,
  value,
  onChange,
  orientation = 'vertical',
  error,
}: RadioGroupProps) {
  return (
    <div>
      <HeadlessRadioGroup value={value} onChange={onChange}>
        {label && (
          <HeadlessRadioGroup.Label className="text-sm font-medium text-gray-300 mb-2">
            {label}
          </HeadlessRadioGroup.Label>
        )}
        
        <div className={`
          ${orientation === 'vertical' ? 'space-y-2' : 'flex flex-wrap gap-4'}
        `}>
          {options.map((option) => (
            <HeadlessRadioGroup.Option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={({ active, checked }) => `
                relative rounded-lg px-5 py-3 cursor-pointer
                flex focus:outline-none transition-colors
                ${option.disabled ? 'cursor-not-allowed opacity-60' : ''}
                ${checked
                  ? 'bg-blue-600/20 border border-blue-600'
                  : 'bg-gray-700/50 border border-gray-700 hover:bg-gray-700'}
                ${active ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-800' : ''}
              `}
            >
              {({ checked }) => (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="text-sm">
                        <HeadlessRadioGroup.Label
                          as="p"
                          className={`font-medium ${checked ? 'text-white' : 'text-gray-300'}`}
                        >
                          {option.label}
                        </HeadlessRadioGroup.Label>
                      </div>
                    </div>
                    
                    <div className={`
                      flex-shrink-0 h-4 w-4 rounded-full
                      ${checked ? 'bg-blue-600' : 'bg-gray-600'}
                      flex items-center justify-center
                    `}>
                      {checked && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </HeadlessRadioGroup.Option>
          ))}
        </div>
      </HeadlessRadioGroup>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}