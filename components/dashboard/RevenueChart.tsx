import { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import Card from '@/components/ui/Card';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface RevenueChartProps {
  data: Array<{
    _id: string;
    revenue: number;
    views: number;
  }>;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Transformamos los datos para el formato que espera recharts
  const chartData = useMemo(() => {
    return data.map(item => ({
      date: item._id,
      revenue: item.revenue,
      views: item.views
    }));
  }, [data]);

  // Calculamos el total de ingresos para este período
  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  }, [data]);

  // Calculamos el total de vistas para este período
  const totalViews = useMemo(() => {
    return data.reduce((sum, item) => sum + item.views, 0);
  }, [data]);

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Ingresos por Visualizaciones</h2>
          <p className="text-sm text-gray-400">Tendencia de los últimos 30 días</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="bg-blue-600/20 text-blue-400 p-2 rounded-lg flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 mr-1" />
            <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
          </div>
          <span className="text-xs text-gray-400 mt-1">{formatNumber(totalViews)} visualizaciones</span>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis 
              yAxisId="revenue" 
              stroke="#8884d8"
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis 
              yAxisId="views" 
              orientation="right" 
              stroke="#82ca9d"
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                borderRadius: '0.5rem',
                color: '#F9FAFB'
              }}
              formatter={(value, name) => {
                if (name === 'revenue') return [`$${value}`, 'Ingresos'];
                return [value, 'Visualizaciones'];
              }}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF', paddingTop: 10 }}
              formatter={(value) => {
                if (value === 'revenue') return 'Ingresos';
                return 'Visualizaciones';
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              yAxisId="revenue"
              name="revenue"
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorViews)"
              yAxisId="views"
              name="views"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}