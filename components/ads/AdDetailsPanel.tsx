import {
  CalendarIcon,
  ClockIcon,
  LinkIcon,
  UserIcon,
  TagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import { formatDate, formatCurrency } from '@/utils/formatters';

interface Revenue {
  total: number;
  daily: Array<{
    date: string;
    views: number;
    revenue: number;
  }>;
  hourly: Array<{
    hour: number;
    views: number;
    revenue: number;
  }>;
}

interface AdDetailsPanelProps {
  ad: any;
  revenue: any;
}

export default function AdDetailsPanel({ ad, revenue }: AdDetailsPanelProps) {
  // Calcular ingreso de hoy si existe
  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = revenue?.daily?.find((day: any) => day.date === today);
  
  return (
    <Card>
      <h2 className="text-xl font-semibold text-white mb-4">Información del Anuncio</h2>
      
      <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
        {ad.type === 'IMAGE' ? (
          <img 
            src={ad.mediaUrl} 
            alt={ad.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <video 
            src={ad.mediaUrl}
            poster="/images/video-poster.jpg"
            controls
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-2 right-2 bg-black/60 text-xs text-white px-2 py-1 rounded-md">
          {ad.type}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{ad.title}</h3>
        <p className="text-gray-300 text-sm">{ad.description}</p>

        {/* Destacado de ingresos */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-blue-900/30">
          <h4 className="text-md font-medium text-blue-400 mb-3 flex items-center">
            <PresentationChartLineIcon className="h-5 w-5 mr-2" />
            Rendimiento Financiero
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-400">Ingresos Totales</div>
              <div className="text-xl font-bold text-white">
                {formatCurrency(revenue?.total || 0)}
              </div>
            </div>
            
            {todayRevenue && (
              <div>
                <div className="text-xs text-gray-400">Ingresos de Hoy</div>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(todayRevenue.revenue)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-blue-400 mr-2" />
            <div>
              <div className="text-xs text-gray-400">Fecha de creación</div>
              <div className="text-sm text-white">{formatDate(ad.createdAt)}</div>
            </div>
          </div>

          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <div className="text-xs text-gray-400">Fecha de expiración</div>
              <div className="text-sm text-white">{formatDate(ad.expirationDate)}</div>
            </div>
          </div>

          <div className="flex items-center">
            <TagIcon className="h-5 w-5 text-green-400 mr-2" />
            <div>
              <div className="text-xs text-gray-400">Categoría</div>
              <div className="text-sm text-white">{ad.category}</div>
            </div>
          </div>

          <div className="flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 text-purple-400 mr-2" />
            <div>
              <div className="text-xs text-gray-400">Costo por visualización</div>
              <div className="text-sm text-white">{formatCurrency(ad.amount)}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <ChartBarIcon className="h-5 w-5 text-emerald-400 mr-2" />
            <div>
              <div className="text-xs text-gray-400">Total de visualizaciones</div>
              <div className="text-sm text-white">
                {revenue?.daily?.reduce((sum: any, day: any) => sum + day.views, 0) || 0}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 text-rose-400 mr-2" />
            <div>
              <div className="text-xs text-gray-400">ROI Estimado</div>
              <div className="text-sm text-white">
                {ad.amount && ad.amount > 0 
                  ? `${((revenue?.total || 0) / ad.amount * 100).toFixed(2)}%`
                  : 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex items-center col-span-full">
            <UserIcon className="h-5 w-5 text-orange-400 mr-2" />
            <div>
              <div className="text-xs text-gray-400">Anunciante</div>
              <div className="text-sm text-white">{ad.createdBy?.name} ({ad.createdBy?.email})</div>
            </div>
          </div>

          {ad.externalLink && (
            <div className="flex items-center col-span-full">
              <LinkIcon className="h-5 w-5 text-blue-400 mr-2" />
              <div>
                <div className="text-xs text-gray-400">Enlace externo</div>
                <a 
                  href={ad.externalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline"
                >
                  {ad.externalLink}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
          <div className={`px-2 py-1 rounded text-xs ${
            ad.isActive ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'
          }`}>
            {ad.isActive ? 'Activo' : 'Inactivo'}
          </div>
          
          <div className="text-sm text-gray-400">
            <span className="font-medium text-blue-400">{revenue?.daily?.length || 0}</span> días generando ingresos
          </div>
        </div>
      </div>
    </Card>
  );
}