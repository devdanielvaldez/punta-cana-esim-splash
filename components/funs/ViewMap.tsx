// components/funs/ViewLocation.jsx
import { FiMapPin } from 'react-icons/fi';

export default function ViewLocation({ location }: any) {
  const googleMapsUrl = `https://www.google.com/maps?q=${location?.latitude},${location?.longitude}`;
  
  return (
    <div className="bg-gray-800/60 backdrop-blur-xl p-4 border border-gray-700 rounded-xl">
      <div className="flex items-center mb-3">
        <FiMapPin className="text-[#EF5AFF] mr-2" />
        <h3 className="text-white font-medium">Ubicación</h3>
      </div>
      
      <div className="text-gray-300 text-sm mb-3">
        <p>Latitud: {location?.latitude}</p>
        <p>Longitud: {location?.longitude}</p>
      </div>
      
      <a 
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#4EBEFF]/20 hover:bg-[#4EBEFF]/30 text-[#4EBEFF] px-4 py-2 rounded-lg inline-block text-sm transition-colors"
      >
        Ver en Google Maps
      </a>
    </div>
  );
}