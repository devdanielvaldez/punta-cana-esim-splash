// components/drivers/TopDriversChart.js
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';

// Registrar componentes de Chart.js necesarios
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getRandomColor = (index: any) => {
  const colors = [
    'rgba(54, 162, 235, 0.8)', // azul
    'rgba(255, 99, 132, 0.8)',  // rosa
    'rgba(255, 206, 86, 0.8)',  // amarillo
    'rgba(75, 192, 192, 0.8)',  // verde agua
    'rgba(153, 102, 255, 0.8)', // morado
    'rgba(255, 159, 64, 0.8)',  // naranja
    'rgba(199, 199, 199, 0.8)', // gris
    'rgba(83, 102, 255, 0.8)',  // indigo
    'rgba(255, 99, 71, 0.8)',   // tomate
    'rgba(50, 205, 50, 0.8)'    // verde lima
  ];
  return colors[index % colors.length];
};

const TopDriversChart = ({ 
  data = [], 
  type = 'bar', 
  title = '', 
  labelField = 'name',
  valueField = 'value',
  height = 'auto'
}) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: []
  });
  
  const [chartOptions, setChartOptions] = useState<any>({});

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Preparar datos según tipo de gráfico
    if (type === 'doughnut' || type === 'pie') {
      setChartData({
        labels: data.map(item => item[labelField] || 'N/A'),
        datasets: [
          {
            data: data.map(item => item[valueField] || 0),
            backgroundColor: data.map((_, index) => getRandomColor(index)),
            borderColor: 'rgba(255, 255, 255, 0.8)',
            borderWidth: 1,
          }
        ]
      });
      
      setChartOptions({
        responsive: true,
        maintainAspectRatio: height === 'auto',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              padding: 15,
              font: {
                size: 11
              }
            }
          },
          title: {
            display: !!title,
            text: title,
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.chart.data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      });
    } else {
      setChartData({
        labels: data.map(item => item[labelField] || 'N/A'),
        datasets: [
          {
            label: title || 'Datos',
            data: data.map(item => item[valueField] || 0),
            backgroundColor: data.map((_, index) => getRandomColor(index)),
            borderColor: data.map((_, index) => getRandomColor(index).replace('0.8', '1')),
            borderWidth: 1,
          }
        ]
      });
      
      setChartOptions({
        responsive: true,
        maintainAspectRatio: height === 'auto',
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: !!title,
            text: title,
            font: {
              size: 16
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      });
    }
  }, [data, type, title, labelField, valueField, height]);

  const renderChart = () => {
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full min-h-[100px]">
          <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
        </div>
      );
    }
    
    if (type === 'doughnut') {
      return <Doughnut data={chartData} options={chartOptions} />;
    } else if (type === 'pie') {
      return <Doughnut data={chartData} options={chartOptions} />;
    } else {
      return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ height: height }}
      className="w-full chart-container"
    >
      {renderChart()}
    </motion.div>
  );
};

export default TopDriversChart;