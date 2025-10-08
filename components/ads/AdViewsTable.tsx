import {
  UserIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import { formatDateTime, formatCurrency } from '@/utils/formatters';
import { FaMoneyBill } from 'react-icons/fa';
import { useState } from 'react';

interface AdViewsTableProps {
  viewHistory: any[];
  isLoading?: boolean;
  itemsPerPage?: number;
}

export default function AdViewsTable({ 
  viewHistory = [], 
  isLoading = false,
  itemsPerPage = 5
}: AdViewsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Cálculo de paginación
  const totalItems = viewHistory.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Asegurar que la página actual está dentro de los límites válidos
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  if (safePage !== currentPage) {
    setCurrentPage(safePage);
  }
  
  // Obtener solo los elementos de la página actual
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = viewHistory.slice(startIndex, endIndex);
  
  // Función para cambiar de página
  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };
  
  // Generar números de página para mostrar (mostrar 5 páginas como máximo)
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, safePage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage < 4 && startPage > 1) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Historial de Visualizaciones</h2>
        <span className="text-sm text-gray-400">
          {totalItems} visualizaciones en total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Conductor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Monto Ganado por Visualización
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800/20">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  Cargando visualizaciones...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((view: any) => (
                <tr key={view._id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm text-white">{view.driver?.user?.name || 'Usuario desconocido'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm text-white">{formatDateTime(view.chargeDate)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMoneyBill className="h-5 w-5 text-green-500 mr-2" />
                      <div className="text-sm text-white">{formatCurrency(view.amountCharged)}</div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                  No hay visualizaciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-gray-700 px-4 py-3 sm:px-6 mt-4">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Mostrando <span className="font-medium text-white">{startIndex + 1}</span> a <span className="font-medium text-white">{endIndex}</span> de <span className="font-medium text-white">{totalItems}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium ${
                    safePage === 1 ? 'text-gray-500' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {getPageNumbers().map(number => (
                  <button
                    key={number}
                    onClick={() => goToPage(number)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium ${
                      number === safePage 
                        ? 'bg-blue-900 text-white' 
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium ${
                    safePage === totalPages ? 'text-gray-500' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
          
          {/* Versión móvil simplificada */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <button
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md ${
                safePage === 1 ? 'bg-gray-800 text-gray-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Anterior
            </button>
            <span className="text-sm text-gray-400">
              Página {safePage} de {totalPages}
            </span>
            <button
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md ${
                safePage === totalPages ? 'bg-gray-800 text-gray-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}