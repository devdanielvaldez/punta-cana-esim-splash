// components/drivers/DriverStats.js
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { FiArrowUp, FiArrowDown, FiActivity } from 'react-icons/fi';

// Registrar los componentes de Chart.js necesarios
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const DriverStats = ({ 
  earningsData = [], // datos de ganancias, esperando formato [{date, earnings, trips}]
  period = 'weekly', // daily, weekly, monthly
  showTrips = true,
  comparisonPeriod = true
}) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });
  
  const [stats, setStats] = useState<any>({
    totalEarnings: 0,
    averageEarnings: 0,
    totalTrips: 0,
    averageTrips: 0,
    percentageChange: 0,
    isPositiveChange: true
  });

  useEffect(() => {
    if (!earningsData || earningsData.length === 0) return;

    // Ordenar datos por fecha
    const sortedData = [...earningsData].sort((a: any, b: any) => 
      +new Date(a.date) - +new Date(b.date)
    );

    // Calcular estadísticas
    const total = sortedData.reduce((sum: any, day: any) => sum + (day.earnings || 0), 0);
    const trips = sortedData.reduce((sum: any, day: any) => sum + (day.trips || 0), 0);
    const average = sortedData.length > 0 ? total / sortedData.length : 0;
    const avgTrips = sortedData.length > 0 ? trips / sortedData.length : 0;

    // Calcular cambio porcentual si hay suficientes datos
    let percentChange = 0;
    let isPositive = true;
    
    if (sortedData.length >= 2) {
      const lastPeriod = sortedData.slice(-Math.ceil(sortedData.length / 2));
      const prevPeriod = sortedData.slice(0, Math.floor(sortedData.length / 2));
      
      const lastSum = lastPeriod.reduce((sum: any, day: any) => sum + (day.earnings || 0), 0);
      const prevSum = prevPeriod.reduce((sum: any, day: any) => sum + (day.earnings || 0), 0);
      
      if (prevSum > 0) {
        percentChange = ((lastSum - prevSum) / prevSum) * 100;
        isPositive = percentChange >= 0;
      }
    }

    setStats({
      totalEarnings: total.toFixed(2),
      averageEarnings: average.toFixed(2),
      totalTrips: trips,
      averageTrips: avgTrips.toFixed(1),
      percentageChange: Math.abs(percentChange).toFixed(1),
      isPositiveChange: isPositive
    });

    // Preparar datos para el gráfico
    const formattedDates = sortedData.map((day: any) => {
      const date = new Date(day.date);
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric',
        month: 'short'
      });
    });

    setChartData({
      labels: formattedDates,
      datasets: [
        {
          label: 'Ganancias',
          data: sortedData.map((day: any) => day.earnings || 0),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        ...(showTrips ? [{
          label: 'Viajes',
          data: sortedData.map((day: any) => day.trips || 0),
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2,
          type: 'bar',
          yAxisID: 'y1'
        }] : [])
      ]
    });
  }, [earningsData, showTrips]);

  const chartOptions: any = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label === 'Ganancias') {
              return `${label}: $${context.raw.toFixed(2)}`;
            }
            return `${label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Ganancias ($)'
        },
        grid: {
          drawOnChartArea: true
        }
      },
      ...(showTrips ? {
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Número de viajes'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      } : {})
    }
  };

  const StatCard = ({ title, value, icon, isCurrency = false, subtitle = null }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-semibold">
            {isCurrency && '$'}{value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  if (earningsData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Ganancias Totales" 
          value={stats.totalEarnings}
          isCurrency={true}
          icon={<FiActivity size={24} className="text-blue-600 dark:text-blue-400" />}
        />
        <StatCard 
          title="Media Diaria" 
          value={stats.averageEarnings}
          isCurrency={true}
          icon={<FiActivity size={24} className="text-green-600 dark:text-green-400" />}
        />
        <StatCard 
          title="Total Viajes" 
          value={stats.totalTrips}
          icon={<FiActivity size={24} className="text-amber-600 dark:text-amber-400" />}
        />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tendencia</p>
              <div className="flex items-center mt-1">
                {stats.isPositiveChange ? (
                  <FiArrowUp className="text-green-500 mr-1" />
                ) : (
                  <FiArrowDown className="text-red-500 mr-1" />
                )}
                <span className={`text-xl font-semibold ${
                  stats.isPositiveChange ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.percentageChange}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">vs periodo anterior</p>
            </div>
            <div className={`p-3 rounded-full ${
              stats.isPositiveChange 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              {stats.isPositiveChange ? (
                <FiArrowUp size={24} className="text-green-600 dark:text-green-400" />
              ) : (
                <FiArrowDown size={24} className="text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Evolución de Ganancias</h3>
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </motion.div>
  );
};

export default DriverStats;