"use client";

interface MapPickerProps {
  value?: { lat: number; lng: number };
  onChange: (pos: { lat: number; lng: number }) => void;
  width?: string;
  height?: string;
}

export default function MapPicker({ value, onChange, width = "100%", height = "300px" }: MapPickerProps) {
  const lat = value?.lat ?? 6.5244; // default Lagos
  const lng = value?.lng ?? 3.3792;

  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=13&size=600x300&markers=${lat},${lng},red-pushpin`;

  return (
    <div style={{ width, height, position: "relative", cursor: "pointer" }} onClick={() => onChange({ lat, lng })}>
      <img src={mapUrl} alt="Property location" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
    </div>
  );
}
