// components/admin/earnings/BatchProcessModal.jsx
export default function BatchProcessModal({ count, onClose, onApprove, onReject }: any) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-black dark:bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-gray-900/30 p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Procesar solicitudes en lote</h2>
          
          <p className="mb-4 dark:text-gray-300">
            Has seleccionado <span className="font-bold dark:text-white">{count}</span> solicitudes. 
            ¿Qué acción deseas realizar con todas ellas?
          </p>
          
          <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={onClose}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Cancelar
            </button>
            
            <button
              onClick={onReject}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
            >
              Rechazar todas
            </button>
            
            <button
              onClick={onApprove}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
            >
              Aprobar todas
            </button>
          </div>
        </div>
      </div>
    );
  }