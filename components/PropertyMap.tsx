"use client";

interface PropertyMapProps {
  latitude?: number;
  longitude?: number;
  title?: string;
  hasLocation: boolean;
  width?: string;
  height?: string;
}

export default function PropertyMap({
  latitude = 6.5244,
  longitude = 3.3792,
  title = "Property Location",
  hasLocation,
  width = "100%",
  height = "300px",
}: PropertyMapProps) {
  if (!hasLocation) return <p className="text-center text-gray-500 mt-10">No location available</p>;

  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=13&size=600x300&markers=${latitude},${longitude},red-pushpin`;

  return (
    <div style={{ width, height, position: "relative" }}>
      <img src={mapUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
      <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.5)", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>
        {title}
      </div>
    </div>
  );
}
