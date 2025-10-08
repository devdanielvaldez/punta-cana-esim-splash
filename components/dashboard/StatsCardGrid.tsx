import {
  CurrencyDollarIcon,
  PhotoIcon,
  EyeIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface StatsCardGridProps {
  totalAds: number;
  activeAds: number;
  totalRevenue: number;
  totalViews: number;
  averageRevenuePerView: number;
}

export default function StatsCardGrid({
  totalAds,
  activeAds,
  totalRevenue,
  totalViews,
  averageRevenuePerView
}: StatsCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      <StatCard
        title="Total de Anuncios"
        value={formatNumber(totalAds)}
        icon={<PhotoIcon className="h-6 w-6" />}
        iconColor="blue"
      />

      <StatCard
        title="Anuncios Activos"
        value={`${formatNumber(activeAds)} / ${formatNumber(totalAds)}`}
        subValue={`${Math.round((activeAds / totalAds) * 100)}%`}
        icon={<CheckCircleIcon className="h-6 w-6" />}
        iconColor="green"
      />

      <StatCard
        title="Total de Ingresos"
        value={formatCurrency(totalRevenue)}
        icon={<CurrencyDollarIcon className="h-6 w-6" />}
        iconColor="purple"
      />

      <StatCard
        title="Visualizaciones"
        value={formatNumber(totalViews)}
        icon={<EyeIcon className="h-6 w-6" />}
        iconColor="yellow"
      />

      <StatCard
        title="Ingreso por Vista"
        value={formatCurrency(averageRevenuePerView)}
        icon={<ChartBarIcon className="h-6 w-6" />}
        iconColor="red"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: JSX.Element;
  iconColor: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

function StatCard({ title, value, subValue, icon, iconColor }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-400/20 text-blue-400',
    green: 'bg-green-400/20 text-green-400',
    purple: 'bg-purple-400/20 text-purple-400',
    yellow: 'bg-yellow-400/20 text-yellow-400',
    red: 'bg-red-400/20 text-red-400',
  };

  return (
    <Card className="overflow-hidden p-4">
      {/* Fila superior: título + icono */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400 truncate min-w-0">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[iconColor]}`}>
          {icon}
        </div>
      </div>
      {/* Valores debajo */}
      <div className="mt-3">
        <p className="text-2xl font-bold text-white break-all">{value}</p>
        {subValue && <p className="text-sm text-gray-400 mt-1 truncate">{subValue}</p>}
      </div>
    </Card>
  );
}