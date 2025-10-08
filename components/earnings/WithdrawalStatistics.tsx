// components/admin/earnings/WithdrawalStatistics.jsx
import { FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiActivity } from 'react-icons/fi';
import Spinner from '@/components/ui/Spinner';

export default function WithdrawalStatistics({ statistics, isLoading }: any) {
  if (isLoading || !statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/30 rounded-lg p-5 h-24 flex items-center justify-center">
            <Spinner size="md" />
          </div>
        ))}
      </div>
    );
  }
  
  // Calcular totales a partir de los datos recibidos
  const pendingCount = statistics?.byStatus?.PENDING || 0;
  const approvedCount = statistics?.byStatus?.COMPLETED || 0;
  const rejectedCount = statistics?.byStatus?.REJECTED || 0;
  const completedCount = statistics?.byStatus?.COMPLETED || 0;
  
  // Calcular montos totales
  const pendingAmount = statistics?.amountsByStatus?.PENDING || 0;
  const approvedAmount = statistics?.amountsByStatus?.COMPLETED || 0;
  const completedAmount = statistics?.amountsByStatus?.COMPLETED || 0;
  
  // Total de todos los montos
  const totalAmount: any = Object.values(statistics?.amountsByStatus || {}).reduce((acc: any, val: any) => acc + val, 0);
  
  // Calcular monto semanal (asumiendo que dailyTrend contiene los datos de la última semana)
  const weeklyAmount = statistics?.dailyTrend?.reduce((acc: number, day: any) => acc + day.total, 0) || 0;
  
  const stats = [
    {
      title: 'Total de Retiros',
      value: `$${totalAmount.toFixed(2)}`,
      icon: <FiDollarSign />,
      color: 'bg-blue-500',
    },
    {
      title: 'Pendientes',
      value: pendingCount,
      icon: <FiClock />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Aprobados',
      value: approvedCount,
      icon: <FiCheckCircle />,
      color: 'bg-green-500',
    },
    {
      title: 'Rechazados',
      value: rejectedCount,
      icon: <FiXCircle />,
      color: 'bg-red-500',
    },
    {
      title: 'Esta Semana',
      value: `$${weeklyAmount.toFixed(2)}`,
      icon: <FiActivity />,
      color: 'bg-purple-500',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/30 rounded-lg p-5 flex items-center">
          <div className={`${stat.color} p-3 rounded-full mr-4 text-white`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}