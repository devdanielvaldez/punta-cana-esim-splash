import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import Card from '@/components/ui/Card';

interface AdTypeDistributionProps {
  imageCount: number;
  videoCount: number;
}

export default function AdTypeDistribution({ imageCount, videoCount }: AdTypeDistributionProps) {
  const data = [
    { name: 'Imágenes', value: imageCount, color: '#60A5FA' },
    { name: 'Videos', value: videoCount, color: '#C084FC' },
  ];

  const COLORS = ['#60A5FA', '#C084FC'];

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white mb-4">Distribución por Tipo</h2>
      
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                borderColor: '#374151',
                borderRadius: '0.5rem',
                color: '#F9FAFB'
              }}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}