import { useState } from "react";
import { EyeIcon, ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import Card from "@/components/ui/Card";
import { formatNumber, formatCurrency } from "@/utils/formatters";
import Link from "next/link";
import { Tab } from "@headlessui/react";

interface TopAd {
  id: string;
  title: string;
  imageUrl: string;
  views: number;
  earnings: number;
  change: number; // porcentaje de cambio respecto al período anterior
}

interface TopAdsTableProps {
  topAdsByViews: TopAd[];
  topAdsByRevenue: TopAd[];
  isLoading?: boolean;
}

export default function TopAdsTable({ 
  topAdsByViews, 
  topAdsByRevenue, 
  isLoading = false 
}: TopAdsTableProps) {

  if (isLoading) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">
          Anuncios con Mejor Rendimiento
        </h2>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 py-3">
              <div className="bg-gray-700 h-10 w-10 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-16"></div>
                <div className="h-3 bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-white">
          Anuncios con Mejor Rendimiento
        </h2>
      </div>

      <Tab.Group>
        {/* Tabs navigation */}
        <div className="bg-gray-800/60 rounded-lg mb-4">
          <Tab.List className="flex rounded-md p-1">
            
            <Tab className={({ selected }) => 
              `flex items-center px-3 py-1.5 text-sm font-medium rounded-md ml-1
              ${selected 
                ? 'bg-blue-600/20 text-blue-400' 
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }
              transition-colors focus:outline-none`
            }>
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              <span>Por ingresos</span>
            </Tab>
          </Tab.List>
        </div>
        
        {/* Tabs content */}
        <Tab.Panels>
          <Tab.Panel>
            {renderAdsList(topAdsByRevenue, false)}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Card>
  );

  function renderAdsList(ads: TopAd[], showViews: boolean) {
    if (!ads || ads.length === 0) {
      return (
        <p className="text-gray-400 text-center py-6">
          No hay datos disponibles.
        </p>
      );
    }

    return (
      <div className="space-y-1">
        {ads.map((ad: any) => (
          <Link 
            key={ad._id} 
            href={`/app/metrics/${ad._id}`} 
            className="flex items-center p-3 hover:bg-gray-800/60 rounded-lg transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white truncate">
                {ad.title}
              </h3>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                {showViews ? (
                  <>
                    <EyeIcon className="h-3 w-3 mr-1" /> 
                    {ad.viewCount} visualizaciones
                  </>
                ) : (
                  <>
                    <CurrencyDollarIcon className="h-3 w-3 mr-1" /> 
                    DOP {ad.totalRevenue}
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">
                {ad.viewCount}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}