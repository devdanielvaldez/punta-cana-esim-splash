// components/drivers/DriverMap.tsx
import { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";

interface Location {
  latitude: number;
  longitude: number;
}

interface Vehicle {
  brand: string;
  model: string;
  plateNumber: string;
  color: string;
}

interface Driver {
  id: string;
  name: string;
  status: "DISPONIBLE" | "EN_VIAJE" | "OFFLINE";
  location?: Location;
  vehicle?: Vehicle;
}

interface DriverMapProps {
  drivers: Driver[];
  center?: { lat: number; lng: number };
  zoom?: number;
  mapContainerStyle?: React.CSSProperties;
  onDriverSelect?: (driver: Driver) => void;
  selectedDriver?: Driver | null;
  isLoading?: any;
}

const defaultCenter = {
  lat: 19.4326, // Ejemplo: Ciudad de México
  lng: -99.1332,
};

const DriverMap: React.FC<DriverMapProps> = ({
  drivers,
  center = defaultCenter,
  zoom = 5,
  mapContainerStyle = { height: "400px", width: "100%" },
  onDriverSelect,
  selectedDriver,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<Driver | null>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (map && drivers.length > 0 && isGoogleMapsLoaded) {
      try {
        const bounds = new window.google.maps.LatLngBounds();
        drivers.forEach((driver) => {
          if (driver.location?.latitude && driver.location?.longitude) {
            bounds.extend({
              lat: driver.location.latitude,
              lng: driver.location.longitude,
            });
          }
        });

        // Solo ajustar si hay puntos válidos
        if (bounds.isEmpty() === false) {
          map.fitBounds(bounds);
        }
      } catch (error) {
        console.error("Error ajustando límites del mapa:", error);
      }
    }
  }, [map, drivers, isGoogleMapsLoaded]);

  const getMarkerIcon = (status: Driver["status"]): string => {
    switch (status) {
      case "DISPONIBLE":
        return "https://cdn-icons-png.flaticon.com/512/5044/5044609.png";
      case "EN_VIAJE":
        return "https://cdn-icons-png.flaticon.com/256/4846/4846923.png";
      default:
        return "https://cdn-icons-png.flaticon.com/512/1653/1653713.png";
    }
  };

  const handleMarkerClick = (driver: Driver): void => {
    setActiveMarker(driver);
    if (onDriverSelect) {
      onDriverSelect(driver);
    }
  };

  const handleMapLoad = (mapInstance: google.maps.Map): void => {
    setMap(mapInstance);
    setIsGoogleMapsLoaded(true);
  };

  // Función segura para crear un Size solo cuando Google Maps está cargado
  const createScaledSize = (): google.maps.Size | undefined => {
    if (
      !isGoogleMapsLoaded ||
      typeof window === "undefined" ||
      !window.google?.maps
    ) {
      return undefined;
    }
    return new window.google.maps.Size(40, 40);
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyC1zdnzqGfILClQQQKMwizIiGaWL0VXGdM"
      onLoad={() => console.log("Google Maps Script loaded")}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={5}
        onLoad={handleMapLoad}
        options={{
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#7c93a3" }],
            },
            {
              featureType: "administrative",
              elementType: "geometry",
              stylers: [{ visibility: "on" }],
            },
            // Puedes añadir más estilos personalizados aquí
          ],
        }}
      >
        {isGoogleMapsLoaded &&
          typeof window !== "undefined" &&
          window.google?.maps &&
          drivers.map((driver) => {
            const position = {
              lat: driver.location?.latitude || defaultCenter.lat,
              lng: driver.location?.longitude || defaultCenter.lng,
            };

            return (
              <Marker
                key={driver.id}
                position={position}
                icon={
                  isGoogleMapsLoaded
                    ? {
                        url: getMarkerIcon(driver.status),
                        scaledSize: createScaledSize(),
                      }
                    : undefined
                }
                onClick={() => handleMarkerClick(driver)}
                animation={
                  isGoogleMapsLoaded
                    ? window.google.maps.Animation.DROP
                    : undefined
                }
              />
            );
          })}

        <AnimatePresence>
          {activeMarker &&
            activeMarker.location &&
            typeof activeMarker.location.latitude === "number" &&
            typeof activeMarker.location.longitude === "number" &&
            isGoogleMapsLoaded && (
              <InfoWindow
                position={{
                  lat: activeMarker.location.latitude,
                  lng: activeMarker.location.longitude,
                }}
                onCloseClick={() => setActiveMarker(null)}
              >
                <div className="p-2">
                  <h3 className="font-semibold">{activeMarker.name}</h3>
                  <p className="text-sm text-gray-600">
                    {activeMarker.vehicle?.brand} {activeMarker.vehicle?.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    Placa: {activeMarker.vehicle?.plateNumber}
                  </p>
                  <div
                    className={`mt-1 px-2 py-1 rounded-full text-xs ${
                      activeMarker.status === "DISPONIBLE"
                        ? "bg-green-100 text-green-800"
                        : activeMarker.status === "EN_VIAJE"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activeMarker.status}
                  </div>
                </div>
              </InfoWindow>
            )}
        </AnimatePresence>
      </GoogleMap>
    </LoadScript>
  );
};

export default DriverMap;
