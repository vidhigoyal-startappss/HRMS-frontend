import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Correctly import images (TypeScript-safe)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet marker icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationMapProps {
  onAddressFetched: (location: string) => void;
  setLoading: (val: boolean) => void;
}

const LocationMap = ({ onAddressFetched, setLoading }: LocationMapProps) => {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("Fetching location...");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords([latitude, longitude]);

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=540aa45e13684ca598a4e1e62f8f904b`
          );
          const data = await res.json();
          const display = data?.results?.[0]?.formatted;
          const result = display || `${latitude}, ${longitude}`;
          setAddress(result);
          onAddressFetched(result);
        } catch {
          const fallback = `${latitude}, ${longitude}`;
          setAddress(fallback);
          onAddressFetched(fallback);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setAddress("Unable to fetch location");
        onAddressFetched("Unable to fetch location");
        setLoading(false);
      }
    );
  }, []);

  if (!coords) return <p>📍 Getting coordinates...</p>;

  return (
    <div className="space-y-2 mb-4">
      <MapContainer
        center={coords}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords}>
          <Popup>
            <span>{address}</span>
          </Popup>
        </Marker>
      </MapContainer>
      <p className="text-sm text-gray-700">
        <strong>Detected Address:</strong> {address}
      </p>
    </div>
  );
};

export default LocationMap;
