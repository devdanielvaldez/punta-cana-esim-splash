import { UsersIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Card from "@/components/ui/Card";
import { formatNumber, formatCurrency } from "@/utils/formatters";
import Link from "next/link";

interface Advertiser {
  id: string;
  name: string;
  avatarUrl: string;
  adsCount: number;
  totalViews: number;
  totalSpent: number;
}

interface TopAdvertisersTableProps {
  advertisers: Advertiser[];
  isLoading?: boolean;
}

export default function TopAdvertisersTable({ 
  advertisers, 
  isLoading = false 
}: TopAdvertisersTableProps) {
  if (isLoading) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">
          Principales Anunciantes
        </h2>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 py-3">
              <div className="bg-gray-700 h-10 w-10 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 bg-gray-700 rounded w-20 ml-auto"></div>
                <div className="h-3 bg-gray-700 rounded w-16 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white mb-4">
        Principales Anunciantes
      </h2>
      {advertisers.length === 0 ? (
        <p className="text-gray-400 text-center py-6">
          No hay datos disponibles.
        </p>
      ) : (
        <div className="space-y-1">
          {advertisers.map((advertiser: any) => (
            <div
              key={advertiser.id}
              className="flex items-center p-3 hover:bg-gray-800/60 rounded-lg transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate">
                  {advertiser.advertiserName}
                </h3>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <DocumentTextIcon className="h-3 w-3 mr-1" />
                  {advertiser.totalAds} anuncios
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}