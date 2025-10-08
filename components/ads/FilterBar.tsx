import { useState } from 'react';
import {
  FunnelIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';

interface FilterBarProps {
  filters: {
    type: string;
    category: string;
    searchTerm: string;
    sortBy: string;
    sortOrder: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories = [
    { id: '', name: 'Todas las categorías' },
    { id: 'ECOMMERCE', name: 'E-Commerce' },
    { id: 'RESTAURANT', name: 'Restaurantes' },
    { id: 'ENTERTAINMENT', name: 'Entretenimiento' },
    { id: 'TRAVEL', name: 'Viajes' },
    { id: 'SERVICE', name: 'Servicios' }
  ];

  return (
    <Card>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Buscar anuncios..."
              className="bg-gray-800 border border-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 rounded-lg text-sm text-white"
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 pr-8"
          >
            <option value="ALL">Todos los tipos</option>
            <option value="IMAGE">Imágenes</option>
            <option value="VIDEO">Videos</option>
          </select>

          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-700 text-sm leading-4 font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filtros
          </button>
          
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-700 text-sm leading-4 font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700"
            onClick={() => onFilterChange({
              type: 'ALL',
              category: '',
              searchTerm: '',
              sortBy: 'createdAt',
              sortOrder: 'desc'
            })}
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Reiniciar
          </button>
        </div>
      </div>

      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Categoría</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="mt-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-300">Ordenar por</label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="mt-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            >
              <option value="createdAt">Fecha de creación</option>
              <option value="viewsCount">Visualizaciones</option>
              <option value="totalRevenue">Ingresos</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-300">Orden</label>
            <select
              id="sortOrder"
              value={filters.sortOrder}
              onChange={(e) => onFilterChange({ sortOrder: e.target.value })}
              className="mt-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>
      )}
    </Card>
  );
}