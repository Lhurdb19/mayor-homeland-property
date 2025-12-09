"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components (client-only)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  hasLocation: boolean;
}

export default function PropertyMap({ latitude, longitude, title, hasLocation }: PropertyMapProps) {
  if (!hasLocation) {
    return <p className="text-center text-gray-500 mt-10">No location available</p>;
  }

  return (
    <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
}