import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
// import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export default function SearchInput({
  onSearch,
  placeholder = 'Buscar...',
  className = '',
  debounceMs = 300,
}: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  // const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // useEffect(() => {
  //   onSearch(debouncedSearchTerm);
  // }, [debouncedSearchTerm, onSearch]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className={`
          bg-gray-800 border border-gray-700 text-white text-sm rounded-lg
          block w-full pl-10 p-2.5
          focus:ring-blue-500 focus:border-blue-500
          ${className}
        `}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}