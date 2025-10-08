import Link from 'next/link';
import { useState } from 'react';
import { 
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';
import { Ad } from '@/types/ad';
import Card from '@/components/ui/Card';
import Pagination from '@/components/ui/Pagination';

interface AdsListProps {
  ads: Ad[];
  onViewDetails: (adId: string) => void;
}

export default function AdsList({ ads, onViewDetails }: AdsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Implementamos paginación simple
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAds: any = ads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ads.length / itemsPerPage);

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Anuncio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Tipo / Categoría
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Vistas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ingresos
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800/20">
            {currentAds.length > 0 ? (
              currentAds.map((ad: any) => (
                <tr key={ad._id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                        <img
                          className="h-full w-full object-cover"
                          src={ad.mediaUrl || '/images/placeholder.png'}
                          alt={ad.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{ad.title}</div>
                        <div className="text-xs text-gray-400 truncate max-w-xs">{ad.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        {ad.type === 'IMAGE' ? (
                          <PhotoIcon className="h-4 w-4 text-blue-400 mr-1" />
                        ) : (
                          <VideoCameraIcon className="h-4 w-4 text-purple-400 mr-1" />
                        )}
                        <span className="text-sm text-white">{ad.type}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{ad.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 text-blue-400 mr-1" />
                      <span className="text-sm text-white">{ad.statistics.viewsCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-sm text-white">{ad.statistics.totalRevenue}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-300">{formatDate(ad.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => onViewDetails(ad._id)}
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  No se encontraron anuncios con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </Card>
  );
}