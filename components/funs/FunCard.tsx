// components/funs/FunCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import { FiEdit2, FiMap, FiDollarSign, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

export default function FunCard({ fun, onToggleStatus }: any) {
  return (
    <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 group">
      <div className="relative">
        <Image 
          src={fun.image} 
          alt={fun.description}
          width={400}
          height={250}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        <div className="absolute top-3 right-3">
          <span className={`
            text-xs px-2 py-1 rounded-full font-medium
            ${fun.isActive ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'}
          `}>
            {fun.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-lg flex items-center">
              <FiDollarSign className="text-[#4EBEFF]" size={16} />
              <span className="text-white text-sm font-medium ml-1">{fun.cost.toFixed(2)}</span>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-sm p-1.5 rounded-lg flex items-center">
              <FiMap className="text-[#EF5AFF]" size={16} />
              <span className="text-white text-sm font-medium ml-1">Ver mapa</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="line-clamp-2 text-white font-medium mb-2">
          {fun.description}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Link href={`/app/funs/view/${fun._id}`} className="text-sm text-[#4EBEFF] hover:underline">
            Ver detalles
          </Link>
          
          <div className="flex space-x-2">
            <Link href={`/app/funs/edit/${fun._id}`}>
              <button className="p-1.5 rounded-lg bg-gray-700/60 hover:bg-blue-500/20 text-gray-300 hover:text-blue-300">
                <FiEdit2 size={16} />
              </button>
            </Link>
            
            <button 
              onClick={() => onToggleStatus(fun._id)}
              className={`p-1.5 rounded-lg ${
                fun.isActive 
                  ? "bg-gray-700/60 hover:bg-red-500/20 text-gray-300 hover:text-red-300" 
                  : "bg-gray-700/60 hover:bg-green-500/20 text-gray-300 hover:text-green-300"
              }`}
            >
              {fun.isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}