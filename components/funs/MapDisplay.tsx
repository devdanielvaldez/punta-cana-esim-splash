// components/funs/MapDisplay.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ClientOnlyPortal from './ClientOnlyPortal';

// Corregir el problema del ícono predeterminado de Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Componente de marcador que actualiza su posición con los clics del mapa
const LocationMarkerComponent = ({ position, setPosition }: any) => {
  useMapEvents({
    click: (e) => {
      if (setPosition) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      }
    }
  });

  return position[0] !== 0 && position[1] !== 0 ? <Marker position={position} /> : null;
};

export default function MapDisplay({ position, setPosition, isInteractive = true }: any) {
  const defaultCenter = position[0] !== 0 ? position : [40.7128, -74.0060]; // Default to NYC
  
  return (
    <ClientOnlyPortal>
      <MapContainer 
        center={defaultCenter} 
        zoom={13} 
        scrollWheelZoom={isInteractive}
        style={{ height: "100%", width: "100%" }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="invert-[.85]"
        />
        {isInteractive ? (
          <LocationMarkerComponent position={position} setPosition={setPosition} />
        ) : (
          <Marker position={position} />
        )}
      </MapContainer>
    </ClientOnlyPortal>
  );
}