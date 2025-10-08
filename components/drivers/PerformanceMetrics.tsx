// components/drivers/PerformanceMetrics.js
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiClock, FiStar, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';
import moment from 'moment';
import { es } from 'date-fns/locale';

// Registrar componentes de Chart.js necesarios
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale);

const PerformanceMetrics = ({ driverId, timeRange = 'month' }: any) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDriverMetrics();
  }, [driverId, timeRange]);

  const fetchDriverMetrics = async () => {
    try {
      setIsLoading(true);
      // Simulamos la llamada a la API que normalmente haríamos:
      // const response = await axios.get(`https://api.triptapmedia.com/api/drivers/${driverId}/performance?timeRange=${timeRange}`);
      
      // En lugar de eso, generamos datos simulados para demostración
      const simulatedData = generateSimulatedData();
      
      setMetrics(simulatedData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error al cargar métricas de rendimiento:', err);
      setError('No se pudieron cargar las métricas de rendimiento');
      setIsLoading(false);
    }
  };

  // Función para generar datos de demostración
  const generateSimulatedData = () => {
    // Generar fechas para los últimos 30 días
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i - 1));
      return moment(date).format('yyyy-MM-dd');
    });
    
    // Generar datos aleatorios de ganancias y viajes
    const earnings = dates.map(() => Math.floor(Math.random() * 100) + 50);
    const trips = dates.map(() => Math.floor(Math.random() * 10) + 1);
    const ratings = dates.map(() => (Math.random() * 1.5 + 3.5).toFixed(1)); // Ratings entre 3.5 y 5.0
    
    // Calcular promedios y totales
    const totalEarnings = earnings.reduce((a, b) => a + b, 0);
    const totalTrips = trips.reduce((a, b) => a + b, 0);
    const averageRating = (ratings.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0) / ratings.length).toFixed(1);
    
    return {
      summary: {
        totalEarnings,
        averageEarnings: (totalEarnings / 30).toFixed(2),
        totalTrips,
        averageTrips: (totalTrips / 30).toFixed(1),
        rating: averageRating,
        completionRate: Math.floor(Math.random() * 10) + 90, // Entre 90% y 99%
        cancellationRate: Math.floor(Math.random() * 5) + 1, // Entre 1% y 5%
        onlineHours: Math.floor(Math.random() * 100) + 100, // Entre 100 y 200 horas
      },
      dailyData: dates.map((date, i) => ({
        date,
        earnings: earnings[i],
        trips: trips[i],
        rating: ratings[i],
        hoursOnline: (Math.random() * 10 + 2).toFixed(1), // Entre 2 y 12 horas
        acceptanceRate: Math.floor(Math.random() * 20) + 80, // Entre 80% y 99%
      })),
      performance: {
        rating: parseFloat(averageRating),
        acceptanceRate: Math.floor(Math.random() * 15) + 85,
        completionRate: Math.floor(Math.random() * 10) + 90,
        onTimeRate: Math.floor(Math.random() * 10) + 90,
        customerSatisfaction: Math.floor(Math.random() * 10) + 90,
        vehicleCleanness: Math.floor(Math.random() * 10) + 90,
      },
      topDestinations: [
        { zone: 'Centro', count: Math.floor(Math.random() * 50) + 50 },
        { zone: 'Norte', count: Math.floor(Math.random() * 40) + 30 },
        { zone: 'Sur', count: Math.floor(Math.random() * 30) + 20 },
        { zone: 'Este', count: Math.floor(Math.random() * 25) + 15 },
        { zone: 'Oeste', count: Math.floor(Math.random() * 20) + 10 },
      ],
      weeklyActivity: [
        { day: 'Lunes', hours: Math.floor(Math.random() * 8) + 4 },
        { day: 'Martes', hours: Math.floor(Math.random() * 8) + 4 },
        { day: 'Miércoles', hours: Math.floor(Math.random() * 8) + 4 },
        { day: 'Jueves', hours: Math.floor(Math.random() * 8) + 4 },
        { day: 'Viernes', hours: Math.floor(Math.random() * 8) + 4 },
        { day: 'Sábado', hours: Math.floor(Math.random() * 8) + 4 },
        { day: 'Domingo', hours: Math.floor(Math.random() * 8) + 4 },
      ]
    };
  };

  // Componentes para las diferentes pestañas
  const Overview = () => {
    if (!metrics) return null;
    
    // Datos para el gráfico de tendencia de ganancias
    const earningsChartData: any = {
      labels: metrics.dailyData.slice(-14).map((d: any) => moment(new Date(d.date)).format('dd MMM')),
      datasets: [
        {
          label: 'Ganancias',
          data: metrics.dailyData.slice(-14).map((d: any) => d.earnings),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4,
        },
      ]
    };

    // Datos para el gráfico radar de rendimiento
    const radarData = {
      labels: [
        'Calificación',
        'Tasa de Aceptación',
        'Tasa de Finalización',
        'Puntualidad',
        'Satisfacción del Cliente',
        'Limpieza del Vehículo'
      ],
      datasets: [
        {
          label: 'Rendimiento',
          data: [
            (metrics.performance.rating / 5) * 100,
            metrics.performance.acceptanceRate,
            metrics.performance.completionRate,
            metrics.performance.onTimeRate,
            metrics.performance.customerSatisfaction,
            metrics.performance.vehicleCleanness
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        }
      ]
    };
    
    const StatCard = ({ title, value, icon, footer = null, trend = null }: any) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            {footer && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{footer}</p>}
          </div>
          <div className={`p-3 rounded-full ${
            trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' :
            trend === 'down' ? 'bg-red-100 dark:bg-red-900/30' :
            'bg-blue-100 dark:bg-blue-900/30'
          }`}>
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-2">
            <span className={`inline-flex items-center text-sm ${
              trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trend === 'up' ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
              12% comparado con el período anterior
            </span>
          </div>
        )}
      </motion.div>
    );

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Calificación"
            value={`${metrics.summary.rating}/5.0`}
            icon={<FiStar size={24} className="text-yellow-500" />}
            footer="Basado en últimos 100 viajes"
            trend="up"
          />
          <StatCard
            title="Viajes Completados"
            value={metrics.summary.totalTrips}
            icon={<FiUsers size={24} className="text-blue-600 dark:text-blue-400" />}
            footer={`${metrics.summary.averageTrips} viajes/día`}
          />
          <StatCard
            title="Ganancias Totales"
            value={`$${metrics.summary.totalEarnings.toLocaleString()}`}
            icon={<FiDollarSign size={24} className="text-green-600 dark:text-green-400" />}
            footer={`$${metrics.summary.averageEarnings} promedio/día`}
            trend="up"
          />
          <StatCard
            title="Horas en Línea"
            value={`${metrics.summary.onlineHours}h`}
            icon={<FiClock size={24} className="text-purple-600 dark:text-purple-400" />}
            footer="En los últimos 30 días"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Tendencia de Ganancias */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Tendencia de Ganancias</h3>
            <div className="h-64">
              <Line 
                data={earningsChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: value => `$${value}`
                      }
                    }
                  }
                }} 
              />
            </div>
          </motion.div>
          
          {/* Gráfico Radar de Rendimiento */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Indicadores de Rendimiento</h3>
            <div className="h-64">
              <Radar 
                data={radarData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      min: 0,
                      max: 100,
                      ticks: {
                        stepSize: 20
                      }
                    }
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Destinos Principales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center mb-4">
              <FiMapPin className="text-blue-600 dark:text-blue-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Destinos Principales</h3>
            </div>
            <div className="space-y-3">
              {metrics.topDestinations.map((destination: any, index: any) => (
                <div key={index} className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div 
                      className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full" 
                      style={{ width: `${(destination.count / metrics.topDestinations[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 min-w-[60px] text-sm font-medium">
                    {destination.zone} ({destination.count})
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Actividad Semanal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Actividad Semanal</h3>
            <div className="h-64">
              <Bar 
                data={{
                  labels: metrics.weeklyActivity.map((d: any) => d.day),
                  datasets: [
                    {
                      label: 'Horas Activas',
                      data: metrics.weeklyActivity.map((d: any) => d.hours),
                      backgroundColor: 'rgba(54, 162, 235, 0.5)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1
                    }
                  ]
                }} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Horas'
                      }
                    }
                  }
                }} 
              />
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const Earnings = () => {
    if (!metrics) return null;

    // Datos para gráfico de ganancias diarias
    const dailyEarningsData = {
      labels: metrics.dailyData.map((d: any) => moment(new Date(d.date)).format('dd MMM')),
      datasets: [
        {
          label: 'Ganancias',
          data: metrics.dailyData.map((d: any) => d.earnings),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Historial de Ganancias</h3>
          <div className="h-80">
            <Bar 
              data={dailyEarningsData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.raw}`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: value => `$${value}`
                    }
                  }
                }
              }} 
            />
          </div>
        </motion.div>

        {/* Tabla de detalles de ganancias */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detalles de Ganancias</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Viajes</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Horas Online</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ganancias</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prom/Hora</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {metrics.dailyData.slice(-7).reverse().map((day: any, index: any) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {moment(new Date(day.date)).format('dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {day.trips}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {day.hoursOnline}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      ${day.earnings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ${(day.earnings / day.hoursOnline).toFixed(2)}/h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };

  const Activity = () => {
    if (!metrics) return null;
    
    return (
      <div className="space-y-6">
        {/* Implementación del componente de actividad */}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-r-md">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Pestañas */}
      {/* <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'earnings', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab === 'overview' ? 'Resumen' : 
               ''}
            </button>
          ))}
        </nav>
      </div> */}

      {/* Contenido según pestaña activa */}
      {/* {activeTab === 'overview' && <Overview />} */}
      {/* {activeTab === 'earnings' && <Earnings />}
      {activeTab === 'activity' && <Activity />} */}
    </div>
  );
};

export default PerformanceMetrics;