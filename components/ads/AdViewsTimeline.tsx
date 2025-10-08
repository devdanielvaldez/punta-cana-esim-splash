import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Card from '@/components/ui/Card';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Tab } from '@headlessui/react';

interface ViewHistoryItem {
  _id: string;
  driver: {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    };
    vehicle: {
      brand: string;
      model: string;
      year: number;
      plateNumber: string;
      color: string;
    };
    isOnline: boolean;
    earningAds: number;
  };
  ad: string;
  amountCharged: number;
  chargeDate: string;
}

interface ChartDataPoint {
  date: string;
  views: number;
  formattedDate: string;
}

interface AdViewsTimelineProps {
  data: ViewHistoryItem[];
  isLoading?: boolean;
}

export default function AdViewsTimeline({ 
  data = [],
  isLoading = false 
}: AdViewsTimelineProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'daily' | 'hourly'>('daily');

  // Transformar los datos de historial en datos diarios y por hora
  const { dailyStats, hourlyStats } = useMemo(() => {
    // Para estadísticas diarias, agrupar por fecha
    const dailyMap = new Map<string, number>();
    
    // Para estadísticas por hora, agrupar por hora del día
    const hourlyMap = new Map<number, number>();
    
    // Inicializar el mapa de horas (0-23)
    for (let i = 0; i < 24; i++) {
      hourlyMap.set(i, 0);
    }
    
    // Procesar cada elemento del historial
    data.forEach(item => {
      try {
        const date = parseISO(item.chargeDate);
        
        // Formato de fecha YYYY-MM-DD para agrupar por día
        const dayKey = format(date, 'yyyy-MM-dd');
        dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + 1);
        
        // Extraer la hora para agrupar por hora
        const hour = date.getHours();
        hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
      } catch (error) {
        console.error('Error procesando fecha:', item.chargeDate, error);
      }
    });
    
    // Convertir el mapa diario a array para el gráfico
    const dailyData: ChartDataPoint[] = Array.from(dailyMap).map(([date, views]) => ({
      date,
      views,
      formattedDate: format(parseISO(date), 'd MMM', { locale: es })
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    // Convertir el mapa de horas a array para el gráfico
    const hourlyData: ChartDataPoint[] = Array.from(hourlyMap).map(([hour, views]) => {
      // Crear una fecha con la hora específica para formatearla
      const tempDate = new Date();
      tempDate.setHours(hour, 0, 0, 0);
      
      return {
        date: hour.toString(),
        views,
        formattedDate: format(tempDate, 'HH:00', { locale: es })
      };
    }).sort((a, b) => parseInt(a.date) - parseInt(b.date));
    
    return {
      dailyStats: dailyData,
      hourlyStats: hourlyData
    };
  }, [data]);

  const chartData = useMemo(() => {
    return selectedTimeFrame === 'daily' ? dailyStats : hourlyStats;
  }, [dailyStats, hourlyStats, selectedTimeFrame]);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-semibold text-white mb-3 sm:mb-0">
          Tendencia de Visualizaciones
        </h2>

        <div className="bg-gray-800 rounded-lg p-1">
          <Tab.Group onChange={(index) => setSelectedTimeFrame(index === 0 ? 'daily' : 'hourly')}>
            <Tab.List className="flex space-x-1">
              <TabButton selected={selectedTimeFrame === 'daily'}>
                Diario
              </TabButton>
              <TabButton selected={selectedTimeFrame === 'hourly'}>
                Por hora
              </TabButton>
            </Tab.List>
          </Tab.Group>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Cargando datos...</p>
        </div>
      ) : chartData.length > 0 ? (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                vertical={false}
              />
              <XAxis
                dataKey="formattedDate"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#F9FAFB' }}
                itemStyle={{ color: '#60A5FA' }}
                formatter={(value: number) => [`${value} visualizaciones`, 'Vistas']}
                labelFormatter={(label) => `${selectedTimeFrame === 'daily' ? 'Fecha' : 'Hora'}: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#viewsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-400">No hay datos suficientes para mostrar la gráfica.</p>
        </div>
      )}
    </Card>
  );
}

interface TabButtonProps {
  children: React.ReactNode;
  selected: boolean;
}

function TabButton({ children, selected }: TabButtonProps) {
  return (
    <Tab
      className={`
        px-4 py-2 text-sm font-medium rounded-md focus:outline-none
        ${selected 
          ? 'bg-blue-600/20 text-blue-400' 
          : 'text-gray-400 hover:text-white'}
      `}
    >
      {children}
    </Tab>
  );
}