"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// FIX: Set default marker icon (NO delete _getIconUrl)
const icon = L.icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = icon;

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
