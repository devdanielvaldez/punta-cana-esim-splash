import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Card from '@/components/ui/Card';
import { ClockIcon } from '@heroicons/react/24/outline';

interface HourlyData {
  hour: number;
  views: number;
}

interface HourlyViewsChartProps {
  data: HourlyData[];
  isLoading?: boolean;
}

export default function HourlyViewsChart({ data, isLoading = false }: HourlyViewsChartProps) {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      hour: `${item.hour}:00`,
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Visualizaciones por Hora
          </h2>
          <div className="bg-gray-700 animate-pulse h-8 w-24 rounded"></div>
        </div>
        <div className="h-[240px] bg-gray-700/30 animate-pulse rounded"></div>
      </Card>
    );
  }

  const findPeakHour = () => {
    if (data.length === 0) return null;
    const maxViews = Math.max(...data.map(d => d.views));
    const peakHour = data.find(d => d.views === maxViews);
    return peakHour ? `${peakHour.hour}:00` : null;
  };

  const peakHour = findPeakHour();

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">
          Visualizaciones por Hora
        </h2>
        {peakHour && (
          <div className="flex items-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
            <ClockIcon className="h-4 w-4 mr-1" />
            Hora pico: {peakHour}
          </div>
        )}
      </div>

      {data.length === 0 ? (
        <div className="h-[240px] flex items-center justify-center text-gray-400">
          No hay datos disponibles.
        </div>
      ) : (
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#374151"
              />
              <XAxis
                dataKey="hour"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#F9FAFB',
                }}
                formatter={(value: number) => [`${value} visualizaciones`, 'Visualizaciones']}
                labelFormatter={(label) => `Hora: ${label}`}
              />
              <Bar
                dataKey="views"
                fill="url(#colorViews)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}