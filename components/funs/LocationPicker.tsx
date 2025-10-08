// components/funs/LocationPicker.jsx
import { useState, useEffect } from 'react';
import { FiMapPin } from 'react-icons/fi';

export default function LocationPicker({ value, onChange }: any) {
  const [location, setLocation] = useState({
    latitude: value?.latitude || 0,
    longitude: value?.longitude || 0
  });

  // Inicializar con la posición actual si está disponible
  useEffect(() => {
    if (!value?.latitude && !value?.longitude) {
      if (typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newLocation = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            };
            setLocation(newLocation);
            onChange(newLocation);
          },
          () => {
            // Default a NYC si falla la geolocalización
            const defaultLocation = {
              latitude: 40.7128,
              longitude: -74.0060
            };
            setLocation(defaultLocation);
            onChange(defaultLocation);
          }
        );
      }
    }
  }, []);

  // Actualizar cuando cambian los inputs
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    
    // Validar que sea un número válido
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    const newLocation = {
      ...location,
      [name]: numValue
    };
    
    setLocation(newLocation);
    onChange(newLocation);
  };

  // Usar ubicación actual
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          };
          setLocation(newLocation);
          onChange(newLocation);
        },
        (error) => {
          alert("Error al obtener la ubicación: " + error.message);
        }
      );
    } else {
      alert("La geolocalización no está disponible en este navegador.");
    }
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-xl p-5 border border-gray-700 rounded-xl">
      <div className="flex items-center mb-4">
        <FiMapPin className="text-[#EF5AFF] mr-2" />
        <h3 className="text-white font-medium">Ubicación del evento</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Latitud</label>
          <input
            type="number"
            name="latitude"
            value={location.latitude}
            onChange={handleChange}
            step="0.000001"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4EBEFF]"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Longitud</label>
          <input
            type="number"
            name="longitude"
            value={location.longitude}
            onChange={handleChange}
            step="0.000001"
            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#4EBEFF]"
          />
        </div>
      </div>
      
      <button
        type="button"
        onClick={getCurrentLocation}
        className="bg-[#4EBEFF]/20 hover:bg-[#4EBEFF]/30 text-[#4EBEFF] px-4 py-2 rounded-lg flex items-center text-sm transition-colors"
      >
        <FiMapPin className="mr-2" /> Usar mi ubicación actual
      </button>
      
      <div className="mt-4 text-xs text-gray-400">
        <p>Puedes buscar coordenadas en <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-[#4EBEFF] hover:underline">Google Maps</a> (clic derecho en un punto → "¿Qué hay aquí?")</p>
      </div>
    </div>
  );
}