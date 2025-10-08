import { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (range: { startDate: Date; endDate: Date }) => void;
  label?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  label,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<{ from: Date; to: Date | undefined }>({
    from: startDate,
    to: endDate,
  });

  const handleDayClick = (day: Date) => {
    const range = { ...tempRange };
    
    if (!range.from || range.to) {
      range.from = day;
      range.to = undefined;
    } else {
      const isAfter = day > range.from;
      if (isAfter) {
        range.to = day;
      } else {
        range.to = range.from;
        range.from = day;
      }
    }
    
    setTempRange(range);
    
    if (range.from && range.to) {
      onChange({
        startDate: range.from,
        endDate: range.to,
      });
      setIsOpen(false);
    }
  };

  const displayValue = `${format(startDate, 'dd/MM/yyyy', { locale: es })} - ${format(
    endDate,
    'dd/MM/yyyy',
    { locale: es }
  )}`;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg
            block w-full pl-10 py-2 px-4 text-left
            focus:ring-blue-500 focus:border-blue-500"
        >
          {displayValue}
        </button>
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 mt-1">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4">
            <DayPicker
              mode="range"
              selected={tempRange}
              onDayClick={handleDayClick}
              locale={es}
              className="rdp-custom"
              modifiersClassNames={{
                selected: 'bg-blue-600',
                today: 'text-yellow-400 font-bold',
              }}
            />
            <div className="flex justify-end mt-4 border-t border-gray-700 pt-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (tempRange.from && tempRange.to) {
                    onChange({
                      startDate: tempRange.from,
                      endDate: tempRange.to,
                    });
                    setIsOpen(false);
                  }
                }}
                disabled={!tempRange.from || !tempRange.to}
                className="ml-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}