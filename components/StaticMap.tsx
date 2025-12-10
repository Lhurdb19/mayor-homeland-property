"use client";

interface StaticMapProps {
  lat?: number;
  lng?: number;
  title?: string;
  width?: string;
  height?: string;
}

export default function StaticMap({
  lat = 6.5244, // Default to Lagos
  lng = 3.3792,
  title = "Property Location",
  width = "100%",
  height = "300px",
}: StaticMapProps) {
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=13&size=600x300&markers=${lat},${lng},red-pushpin`;

  return (
    <div style={{ width, height, position: "relative" }}>
      <img
        src={mapUrl}
        alt={title}
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
      />
      <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.5)", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>
        {title}
      </div>
    </div>
  );
}
