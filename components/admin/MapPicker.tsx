"use client"; // Important! Must be a client component

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapPickerProps {
  value?: { lat: number; lng: number };
  onChange: (pos: { lat: number; lng: number }) => void;
  defaultCenter?: [number, number];
  zoom?: number;
}

export default function MapPicker({
  value,
  onChange,
  defaultCenter = [6.5244, 3.3792], // Lagos
  zoom = 13,
}: MapPickerProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(value || null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onChange(e.latlng);
      },
    });

    return position ? <Marker position={position} /> : null;
  }

  return (
    <MapContainer
      center={position || defaultCenter}
      zoom={zoom}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker />
    </MapContainer>
  );
}
