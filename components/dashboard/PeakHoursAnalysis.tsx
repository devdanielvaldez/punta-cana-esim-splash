import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function PeakHoursAnalysis({ data }: any) {
  const formattedData = useMemo(() => {
    // Mapear los días de la semana de números a nombres
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    
    return data.map((dayData: any) => ({
      ...dayData,
      dayName: dayNames[dayData.dayOfWeek - 1], // -1 porque MongoDB dayOfWeek va de 1-7 
      // Formatear la hora pico
      peakHourFormatted: `${dayData.peakHour}:00`
    }));
  }, [data]);
  
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay datos de horas pico disponibles</div>
  }

  return (
    <div className="space-y-6">
      {/* Gráfico de horas pico por día */}
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dayName" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'peakViews') return [`${value} visualizaciones`, 'Visualizaciones'];
                if (name === 'peakRevenue') return [`$${value}`, 'Ingresos'];
                return [value, name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="peakViews" name="Visualizaciones (Pico)" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="peakRevenue" name="Ingresos (Pico)" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla detallada de horas pico */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Pico</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visualizaciones</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
            </tr>
          </thead>
          <tbody className="bg-dark divide-y divide-gray-200">
            {formattedData.map((day: any, index: any) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.dayName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.peakHourFormatted}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.peakViews}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${day.peakRevenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información adicional - interpretación para el usuario */}
      <div className="p-4 rounded-md">
        <h4 className="text-sm font-semibold text-white">¿Qué significa esto?</h4>
        <p className="text-sm text-white mt-1">
          Los datos muestran las horas de mayor actividad para cada día de la semana.
          Utiliza esta información para programar tus anuncios más importantes en las 
          horas pico para maximizar la exposición.
        </p>
      </div>
    </div>
  );
}