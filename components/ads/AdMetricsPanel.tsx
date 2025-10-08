import {
    EyeIcon,
    PlayIcon,
    TruckIcon,
    ChartBarIcon,
    UsersIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ChartBarSquareIcon
  } from '@heroicons/react/24/outline';
  import Card from '@/components/ui/Card';
  import { formatNumber, formatDate, formatCurrency } from '@/utils/formatters';
  
  interface AdMetrics {
    views: number;
    videoPlays?: number;
    tripsAssociated: number;
    uniqueDriversCount: number;
    lastViewDate?: string;
  }
  
  interface AdStats {
    totalEarnings: number;
    averageDuration: number;
    conversionRate: number;
    growthRate?: number;
  }
  
  interface AdMetricsPanelProps {
    metrics: AdMetrics;
    stats?: any;
  }
  
  export default function AdMetricsPanel({ metrics, stats }: AdMetricsPanelProps) {
    return (
      <Card>
        <h2 className="text-xl font-semibold text-white mb-6">Métricas de Rendimiento</h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <MetricCard
            icon={<EyeIcon className="h-6 w-6" />}
            color="blue"
            label="Visualizaciones totales"
            value={formatNumber(stats.totalViews)}
          />
  
          <MetricCard
            icon={<TruckIcon className="h-6 w-6" />}
            color="green"
            label="Viajes asociados"
            value={formatNumber(stats.uniqueDriversCount)}
          />
  
          {metrics.lastViewDate && (
            <MetricCard
              icon={<ClockIcon className="h-6 w-6" />}
              color="red"
              label="Última visualización"
              value={formatDate(metrics.lastViewDate)}
            />
          )}

          {/* Nuevas métricas de stats */}
        </div>
      </Card>
    );
  }
  
  interface MetricCardProps {
    icon: React.ReactNode;
    color: 'blue' | 'purple' | 'green' | 'yellow' | 'red' | 'orange' | 'emerald' | 'indigo' | 'pink' | 'amber';
    label: string;
    value: string | number;
    description?: string;
  }
  
  function MetricCard({ icon, color, label, value, description }: MetricCardProps) {
    const colors = {
      blue: 'bg-blue-400/20 text-blue-400',
      purple: 'bg-purple-400/20 text-purple-400',
      green: 'bg-green-400/20 text-green-400',
      yellow: 'bg-yellow-400/20 text-yellow-400',
      red: 'bg-red-400/20 text-red-400',
      orange: 'bg-orange-400/20 text-orange-400',
      emerald: 'bg-emerald-400/20 text-emerald-400',
      indigo: 'bg-indigo-400/20 text-indigo-400',
      pink: 'bg-pink-400/20 text-pink-400',
      amber: 'bg-amber-400/20 text-amber-400',
    };
  
    return (
      <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            {icon}
          </div>
        </div>
        <p className="mt-4 text-2xl font-semibold text-white">
          {value}
        </p>
        <p className="text-sm text-gray-400">
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>
    );
  }