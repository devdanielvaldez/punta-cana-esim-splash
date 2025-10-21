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

// Función para filtrar en el front-end - MOSTRAR TODOS LOS PAQUETES
export const filterEsimData = (data, filters) => {
  const { destination, days, dataAmount, priceRange } = filters;
  
  return data.data.filter(country => {
    // Filtrar por destino (país) - este filtro se mantiene
    if (destination && !country.title.toLowerCase().includes(destination.toLowerCase())) {
      return false;
    }

    // Filtrar operadores - MOSTRAR TODOS LOS OPERADORES
    const filteredOperators = country.operators.filter(operator => {
      // MOSTRAR TODOS LOS PAQUETES sin aplicar filtros de días, datos o precio
      const matchingPackages = operator.packages.filter(pkg => {
        // Solo aplicar filtro de precio si está definido
        if (priceRange && pkg.price > priceRange) return false;
        
        return true;
      });
      
      // Mantener operadores que tengan al menos un paquete
      operator.filteredPackages = matchingPackages;
      return matchingPackages.length > 0;
    });

    // Mantener países que tengan al menos un operador con paquetes
    country.filteredOperators = filteredOperators;
    return filteredOperators.length > 0;
  });
};

// Versión alternativa que muestra TODOS los paquetes sin excepción
export const filterEsimDataShowAll = (data, filters) => {
  const { destination } = filters;
  
  return data.data.filter(country => {
    // Solo filtrar por destino si se especifica
    if (destination && !country.title.toLowerCase().includes(destination.toLowerCase())) {
      return false;
    }

    // Mostrar todos los operadores y todos sus paquetes
    const filteredOperators = country.operators.map(operator => {
      // Asignar todos los paquetes del operador
      operator.filteredPackages = operator.packages;
      return operator;
    }).filter(operator => operator.filteredPackages.length > 0);

    // Mantener países que tengan al menos un operador con paquetes
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

// Función para obtener todos los paquetes sin filtrar
export const getAllPackages = (data) => {
  return data.data.map(country => {
    const operatorsWithAllPackages = country.operators.map(operator => {
      return {
        ...operator,
        filteredPackages: operator.packages // Mostrar todos los paquetes
      };
    }).filter(operator => operator.filteredPackages.length > 0);

    return {
      ...country,
      filteredOperators: operatorsWithAllPackages
    };
  }).filter(country => country.filteredOperators.length > 0);
};