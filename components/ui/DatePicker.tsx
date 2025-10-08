import { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date) => void;
  label?: string;
  error?: string;
}

export default function DatePicker({
  selected,
  onSelect,
  label,
  error,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={selected ? format(selected, 'dd/MM/yyyy', { locale: es }) : ''}
          className={`
            bg-gray-800 border border-gray-700 text-white text-sm rounded-lg
            block w-full pl-10 p-2.5 cursor-pointer
            ${error ? 'border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}
          `}
          onClick={() => setIsOpen(true)}
        />
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {isOpen && (
        <div className="absolute z-50 mt-1">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                if (date) {
                  onSelect(date);
                  setIsOpen(false);
                }
              }}
              locale={es}
              className="rdp-custom" // Aplicar estilos personalizados
              modifiersClassNames={{
                selected: 'bg-blue-600',
                today: 'text-yellow-400 font-bold',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}