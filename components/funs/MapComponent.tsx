// components/funs/MapComponent.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
// delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker component that updates position on map click
function LocationMarker({ position, setPosition }: any) {
  const map = useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  if (position[0] !== 0 && position[1] !== 0) {
    map.flyTo(position, map.getZoom());
  }

  return position[0] !== 0 && position[1] !== 0 ? (
    <Marker position={position} />
  ) : null;
}

export default function MapComponent({ position, setPosition }: any) {
  return (
    <MapContainer 
      center={position[0] !== 0 ? position : [40.7128, -74.0060]} 
      zoom={13} 
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      className="z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="invert-[.85]"
      />
      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}