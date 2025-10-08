// components/audio/MusicListItem.jsx
import { FiPlay, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function MusicListItem({ music, onDelete, onEdit, onPlay }: any) {
  // Determinar la clase de estado según el valor
  const getStatusClass = (status: any) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-900/30 text-green-400';
      case 'INACTIVE':
        return 'bg-red-900/30 text-red-400';
      case 'PENDING':
        return 'bg-yellow-900/30 text-yellow-400';
      default:
        return 'bg-gray-900/30 text-gray-400';
    }
  };

  // Obtener texto de estado legible
  const getStatusText = (status: any) => {
    switch (status) {
      case 'ACTIVE':
        return 'Activo';
      case 'INACTIVE':
        return 'Inactivo';
      case 'PENDING':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  return (
    <tr className="hover:bg-gray-700/30 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 mr-4">
            <img 
              className="h-10 w-10 rounded-md object-cover shadow-inner bg-gray-900" 
              src={music.flyer} 
              alt={music.songName} 
            />
          </div>
          <div className="truncate max-w-xs">
            <div className="text-sm font-medium text-white truncate">{music.songName}</div>
            <div className="text-xs text-gray-400 truncate lg:hidden">{music.artistName}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="text-sm text-gray-300 truncate">
          {music.artistName}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">
        <div className="truncate max-w-[120px]">
          {music.genre || 'No especificado'}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(music.status)}`}>
          {getStatusText(music.status)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
        <div className="flex justify-end space-x-2">
        
          <button 
            onClick={onEdit}
            className="text-gray-400 hover:text-[#EF5AFF] p-1 transition-colors"
            title="Editar"
          >
            <FiEdit2 size={18} />
          </button>
          
          <button 
            onClick={() => onDelete(music._id)}
            className="text-gray-400 hover:text-red-500 p-1 transition-colors"
            title="Eliminar"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}