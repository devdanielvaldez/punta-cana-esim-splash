import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function HourlyDetailedChart({ data }: any) {
  // Formatear los datos para mejor visualización
  const formattedData = useMemo(() => {
    return data.map((item: any) => ({
      ...item,
      formattedTimestamp: new Date(item.timestamp).toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      // Crear una etiqueta combinada para el gráfico
      label: `${new Date(item.timestamp).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit' 
      })} ${item.hour}:00`
    }));
  }, [data]);
  
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay datos disponibles</div>
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
        >
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="label"
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 12 }}
          />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'views') return [`${value} visualizaciones`, 'Visualizaciones'];
              return [`$${value}`, 'Ingresos'];
            }}
            labelFormatter={(label) => `Fecha/Hora: ${label}`}
          />
          <Legend />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="views" 
            name="Visualizaciones"
            stroke="#8884d8" 
            fillOpacity={1} 
            fill="url(#colorViews)" 
          />
          <Area 
            yAxisId="right"
            type="monotone" 
            dataKey="revenue" 
            name="Ingresos ($)" 
            stroke="#82ca9d" 
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}