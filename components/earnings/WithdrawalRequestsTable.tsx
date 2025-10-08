// components/admin/earnings/WithdrawalRequestsTable.jsx
'use client';

import { useEffect, useState } from 'react';
import { FiEye, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import Spinner from '@/components/ui/Spinner';

export default function WithdrawalRequestsTable({ 
  requests, 
  isLoading, 
  onViewDetails, 
  onApprove, 
  onReject, 
  onSelectionChange, 
  selectedIds 
}: any) {
  // Estado para manejar todos los seleccionados
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    console.log(requests);
  })

  // Manejar selección de todos los elementos
  const handleSelectAll = () => {
    if (selectAll) {
      onSelectionChange([]);
    } else {
        // return console.log(requests);
      const allIds = requests.data.requests.map((req: any) => req._id);
      onSelectionChange(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id: any) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId: any) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Determinar el color del estado
  const getStatusColor = (status: any) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'approved':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'rejected':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'processing':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  // Traducir estado
  const translateStatus = (status: any) => {
    const statusMap: any = {
      'pending': 'Pendiente',
      'approved': 'Aprobado',
      'rejected': 'Rechazado',
      'processing': 'En proceso',
      'completed': 'Completado'
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
        <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No hay solicitudes de retiro</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          No se encontraron solicitudes de retiro con los filtros actuales.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="w-10 px-6 py-3 text-left">
                <input 
                  type="checkbox" 
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Conductor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Monto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Cuenta Bancaria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fecha
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {/* {requests} */}
            {requests.data.requests.map((request: any) => (
              <tr key={request._id} className={selectedIds.includes(request._id) ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(request._id)}
                    onChange={() => handleSelectItem(request._id)}
                    className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200">
                      {request.driver.user.name && request.driver.user.name[0]}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.driver.user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {request.driver.user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-gray-200">
                    {request.earningsType === 'ad' ? 'Anuncios' : 'Viajes'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ${request.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {request.bankDetails.bankName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {request.bankDetails.accountNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(request.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                    {translateStatus(request.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(request._id)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove(request._id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <FiCheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onReject(request._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiXCircle className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}