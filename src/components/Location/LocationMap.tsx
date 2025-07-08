import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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

  if (!coords)
    return (
      <p className="text-sm text-[#226597] bg-[#F3F9FB] p-2 rounded-md">
        Getting coordinates...
      </p>
    );

  return (
    // <div className="space-y-3 mb-4 bg-white p-4 rounded-xl shadow-sm">
    <div className="align-content: center flex flex-col items-center justify-center space-y-3 mb-2.5 p-4">
      {/* <MapContainer
  center={coords}
  zoom={16}
  scrollWheelZoom={false}
  style={{
    height: "180px",
    width: "90%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  }}
>
  <TileLayer
    attribution="&copy; OpenStreetMap contributors"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

        <Marker position={coords}>
          <Popup>
            <span className="text-[#113F67] text-sm font-medium">{address}</span>
          </Popup>
        </Marker>
      </MapContainer> */}
      <p className="text-sm text-[#113F67] font-medium align-middle">
        <span className="text-[#226597] font-semibold">Detected Address:</span>{" "}
        {address}
      </p>
    </div>
  );
};

export default LocationMap;
