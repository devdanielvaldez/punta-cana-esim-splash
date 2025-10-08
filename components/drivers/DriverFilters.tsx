// components/drivers/DriverFilters.js
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiFilter, FiSearch, FiX, FiRefreshCw } from "react-icons/fi";
import useOnClickOutside from "react-cool-onclickoutside";

const DriverFilters = ({ onFilter = () => {} }: any) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    vehicleType: "all",
    dateRange: "all",
    rating: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const filterRef = useOnClickOutside(() => {
    setShowFilters(false);
  });

  // Opciones de filtros
  const filterOptions: any = {
    status: [
      { value: "all", label: "Todos los estados" },
      { value: "online", label: "En línea" },
      { value: "offline", label: "Desconectados" },
      { value: "onTrip", label: "En viaje" },
    ],
    vehicleType: [
      { value: "all", label: "Todos los vehículos" },
      { value: "sedan", label: "Sedán" },
      { value: "suv", label: "SUV" },
      { value: "premium", label: "Premium" },
    ],
    dateRange: [
      { value: "all", label: "Cualquier fecha" },
      { value: "today", label: "Hoy" },
      { value: "week", label: "Esta semana" },
      { value: "month", label: "Este mes" },
      { value: "year", label: "Este año" },
    ],
    rating: [
      { value: "all", label: "Todas las calificaciones" },
      { value: "5", label: "5 estrellas" },
      { value: "4+", label: "4+ estrellas" },
      { value: "3+", label: "3+ estrellas" },
    ],
  };

  // Manejar cambio en el campo de búsqueda con debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Aplicar filtros cuando cambian los valores
  useEffect(() => {
    handleApplyFilters();
  }, [debouncedSearch, filters]);

  const handleFilterChange = (type: any, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilter({
      search: debouncedSearch,
      ...filters,
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setFilters({
      status: "all",
      vehicleType: "all",
      dateRange: "all",
      rating: "all",
    });
  };

  const hasActiveFilters = () => {
    return (
      search.trim() !== "" ||
      Object.values(filters).some((value) => value !== "all")
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border dark:border-gray-700"
    >
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        {/* Barra de búsqueda */}
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 py-2 border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Buscar por nombre, correo o placa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearch("")}
            >
              <FiX className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
          )}
        </div>

        {/* Botón de filtros */}
        <div className="flex space-x-2">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-md flex items-center border ${
                hasActiveFilters()
                  ? "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <FiFilter className="mr-2" />
              Filtros
              {hasActiveFilters() && (
                <span className="ml-2 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter((v) => v !== "all").length +
                    (search ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Panel de filtros */}
            {showFilters && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border dark:border-gray-700">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Filtros
                    </h3>
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      <FiRefreshCw className="mr-1" size={12} />
                      Resetear
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Filtro de estado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Estado
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          handleFilterChange("status", e.target.value)
                        }
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {filterOptions.status.map((option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro de tipo de vehículo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo de Vehículo
                      </label>
                      <select
                        value={filters.vehicleType}
                        onChange={(e) =>
                          handleFilterChange("vehicleType", e.target.value)
                        }
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {filterOptions.vehicleType.map((option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro de rango de fecha */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Fecha de Registro
                      </label>
                      <select
                        value={filters.dateRange}
                        onChange={(e) =>
                          handleFilterChange("dateRange", e.target.value)
                        }
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {filterOptions.dateRange.map((option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro de calificación */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Calificación
                      </label>
                      <select
                        value={filters.rating}
                        onChange={(e) =>
                          handleFilterChange("rating", e.target.value)
                        }
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        {filterOptions.rating.map((option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botón para aplicar filtros (opcional, ya que los aplicamos automáticamente) */}
          {hasActiveFilters() && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <FiX className="inline mr-1" /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Chips de filtros activos */}
      {hasActiveFilters() && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2 mt-4"
        >
          {search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              Búsqueda: {search}
              <button onClick={() => setSearch("")} className="ml-1">
                <FiX size={14} />
              </button>
            </span>
          )}

          {Object.entries(filters).map(([key, value]) => {
            if (value === "all") return null;
            const filterGroup: any = filterOptions[key];
            const filterLabel = filterGroup?.find(
              (f: any) => f.value === value
            )?.label;

            return (
              // Continuación de components/drivers/DriverFilters.js
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
              >
                {key === "status"
                  ? "Estado"
                  : key === "vehicleType"
                  ? "Vehículo"
                  : key === "dateRange"
                  ? "Fecha"
                  : key === "rating"
                  ? "Calificación"
                  : key}
                : {filterLabel}
                <button
                  onClick={() => handleFilterChange(key, "all")}
                  className="ml-1"
                >
                  <FiX size={14} />
                </button>
              </span>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DriverFilters;
