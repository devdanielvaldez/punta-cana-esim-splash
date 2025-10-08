// components/drivers/DriverTable.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight, FiEye, FiEdit, FiMoreVertical, FiArrowUp, FiArrowDown, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DriverTable = ({ 
  drivers = [], 
  isLoading = false, 
  pagination = { page: 1, limit: 10, total: 0, pages: 0 },
  onPageChange = () => {},
  sortBy = 'name',
  sortOrder = 'asc',
  onSort = () => {}
}: any) => {
  const [hoveredRow, setHoveredRow] = useState<any>(null);

  const columns = [
    { id: 'name', label: 'Conductor', sortable: true },
    { id: 'vehicle', label: 'Vehículo', sortable: false },
    { id: 'isOnline', label: 'Estado', sortable: true },
    { id: 'registrationDate', label: 'Registro', sortable: true },
    { id: 'rating', label: 'Calificación', sortable: true },
    { id: 'actions', label: 'Acciones', sortable: false }
  ];

  const formatDate = (dateString: any) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
  };

  const renderSortIcon = (columnId: any) => {
    if (sortBy !== columnId) return null;
    return sortOrder === 'asc' ? 
      <FiArrowUp className="inline ml-1 text-blue-600" size={14} /> : 
      <FiArrowDown className="inline ml-1 text-blue-600" size={14} />;
  };

  const handleSort = (columnId: any) => {
    if (!columnId || !columns.find(col => col.id === columnId)?.sortable) return;
    onSort(columnId);
  };

  const handlePageChange = (newPage: any) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    onPageChange(newPage);
  };

  const ActionMenu = ({ driver }: any) => (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center p-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
          <FiMoreVertical size={18} />
        </Menu.Button>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link href={`/drivers/drivers/${driver._id}`}>
                  <a className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                  } group flex rounded-md items-center w-full px-3 py-2 text-sm`}>
                    <FiEye className="mr-3" size={16} />
                    Ver detalles
                  </a>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                  } group flex rounded-md items-center w-full px-3 py-2 text-sm`}
                >
                  <FiEdit className="mr-3" size={16} />
                  Editar conductor
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-red-500 text-white' : 'text-red-500'
                  } group flex rounded-md items-center w-full px-3 py-2 text-sm`}
                >
                  <FiXCircle className="mr-3" size={16} />
                  Suspender cuenta
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );

  // Animaciones
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden border dark:border-gray-700">
        <div className="bg-white dark:bg-gray-800 overflow-hidden">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 flex items-center px-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mr-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mr-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mr-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!drivers || drivers.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden border dark:border-gray-700">
        <div className="bg-white dark:bg-gray-800 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No hay conductores que coincidan con los filtros seleccionados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border dark:border-gray-700 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300' : ''
                  }`}
                >
                  {column.label} {renderSortIcon(column.id)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {drivers.map((driver: any, index: any) => (
                <motion.tr
                  key={driver._id || index}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredRow(driver._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    hoveredRow === driver._id ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {driver.photo ? (
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={driver.photo} 
                            alt={driver.name} 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            {driver.name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {driver.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {driver.email || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {driver.vehicle?.brand} {driver.vehicle?.model}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {driver.vehicle?.plateNumber || 'N/A'} - {driver.vehicle?.color || 'N/A'}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {driver.isOnline ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <FiCheckCircle className="mr-1" /> Online
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <FiXCircle className="mr-1" /> Offline
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(driver.registrationDate)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {driver.rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <ActionMenu driver={driver} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700 sm:px-6 flex items-center justify-between">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Mostrando <span className="font-medium">{Math.min(1 + (pagination.page - 1) * pagination.limit, pagination.total)}</span> a <span className="font-medium">{
                Math.min(pagination.page * pagination.limit, pagination.total)
              }</span> de <span className="font-medium">{pagination.total}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  pagination.page <= 1 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FiChevronLeft size={18} />
              </button>
              
              {/* Números de página */}
              {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
                // Mostrar páginas alrededor de la página actual
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                      pagination.page === pageNum 
                        ? 'z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  pagination.page >= pagination.pages
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FiChevronRight size={18} />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverTable;