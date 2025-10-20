const API_BASE_URL = 'https://dev.triptapmedia.com/api/esim';

// Obtener todos los países y paquetes
export const getAllEsimData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}?limit=300`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch eSIM data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching eSIM data:', error);
    throw error;
  }
};

// Función para filtrar en el front-end
export const filterEsimData = (data, filters) => {
  const { destination, days, dataAmount, priceRange } = filters;
  
  return data.data.filter(country => {
    // Filtrar por destino (país)
    if (destination && !country.title.toLowerCase().includes(destination.toLowerCase())) {
      return false;
    }

    // Filtrar operadores que tengan paquetes que coincidan con los filtros
    const filteredOperators = country.operators.filter(operator => {
      const matchingPackages = operator.packages.filter(pkg => {
        // Filtrar por días
        if (days && pkg.day < days) return false;
        
        // Filtrar por cantidad de datos
        if (dataAmount) {
          const pkgData = parseDataAmount(pkg.data);
          if (pkgData < dataAmount) return false;
        }
        
        // Filtrar por rango de precio
        if (priceRange && pkg.price > priceRange) return false;
        
        return true;
      });
      
      // Mantener operador que tengan al menos un paquete que coincida
      operator.filteredPackages = matchingPackages;
      return matchingPackages.length > 0;
    });

    // Mantener países que tengan al menos un operador con paquetes que coincidan
    country.filteredOperators = filteredOperators;
    return filteredOperators.length > 0;
  });
};

// Helper para convertir texto de datos a número (MB/GB)
const parseDataAmount = (dataString) => {
  if (!dataString) return 0;
  
  if (dataString.toLowerCase().includes('unlimited')) {
    return 99999; // Valor alto para unlimited
  }
  
  const match = dataString.match(/(\d+(\.\d+)?)\s*(GB|MB)/i);
  if (match) {
    const amount = parseFloat(match[1]);
    const unit = match[3].toUpperCase();
    return unit === 'GB' ? amount * 1024 : amount;
  }
  
  return 0;
};