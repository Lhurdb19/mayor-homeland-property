"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Lazy load react-leaflet components (client-side only)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface PropertyType {
  title: string;
  price: number;
  description: string;
  location: string;
  status: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  views: number;
}

interface PropertyDetailsModalProps {
  open: boolean;
  onClose: () => void;
  property?: PropertyType | null;
}

export default function PropertyDetailsModal({ open, onClose, property }: PropertyDetailsModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"details" | "map">("details");
  const [showMap, setShowMap] = useState(false);

  // Only show the map once modal is opened
  useEffect(() => {
    if (open) setShowMap(true);
  }, [open]);

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-8xl w-full">
        <DialogHeader>
          <DialogTitle>{property.title}</DialogTitle>
        </DialogHeader>

        {/* Thumbnails */}
        {property.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto mb-4 w-8xl">
            {property.images.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={property.title}
                width={100}
                height={50}
                className={`w-8xl rounded-lg object-cover cursor-pointer border-2 ${
                  idx === activeImage ? "border-blue-600" : "border-gray-300"
                }`}
                onClick={() => setActiveImage(idx)}
              />
            ))}
          </div>
        )}

        {/* Main Image */}
        <div className="relative h-50 md:h-66 rounded-xl mb-4">
          <Image src={property.images[activeImage]} alt={property.title} fill className="object-cover rounded-xl" />
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4 gap-4">
          <button
            className={`px-4 py-2 font-semibold ${activeTab === "details" ? "border-b-2 border-blue-600" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 font-semibold ${activeTab === "map" ? "border-b-2 border-blue-600" : ""}`}
            onClick={() => setActiveTab("map")}
          >
            Map
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" ? (
          <Card className="mb-4 shadow-md">
            <CardContent className="p-3 space-y-1">
              <p><strong>Type:</strong> {property.type || "N/A"}</p>
              <p><strong>Bedrooms:</strong> {property.bedrooms || "N/A"}</p>
              <p><strong>Bathrooms:</strong> {property.bathrooms || "N/A"}</p>
              <p><strong>Sqft:</strong> {property.sqft || "N/A"}</p>
              <p><strong>Agent Phone:</strong> <a href={`tel:${property.phone}`} className="text-blue-600 underline">{property.phone || "N/A"}</a></p>
              <p><strong>Agent Email:</strong> <a href={`mailto:${property.email}`} className="text-blue-600 underline">{property.email || "N/A"}</a></p>
              <p className="flex items-center gap-1"><MapPin /> {property.location}</p>

              <h3 className="font-semibold mt-4 mb-2">Description</h3>
              <p>{property.description}</p>

              <div className="grid grid-cols-2 mt-4 text-sm text-muted-foreground">
                <p>Status: <span className="font-medium">{property.status}</span></p>
                <p>Views: <span className="font-medium">{property.views}</span></p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="h-96 w-full rounded-xl overflow-hidden mb-5">
            {showMap && property.latitude && property.longitude ? (
              <MapContainer center={[property.latitude, property.longitude]} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[property.latitude, property.longitude]}>
                  <Popup>{property.title}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p className="text-center text-gray-500 mt-5">No location available</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
