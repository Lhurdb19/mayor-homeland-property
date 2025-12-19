"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  images: string[];
  views: number;
}

interface PropertyDetailsModalProps {
  open: boolean;
  onClose: () => void;
  property: PropertyType;
}

export default function PropertyDetailsModal({
  open,
  onClose,
  property,
}: PropertyDetailsModalProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 text-black">
        {/* HEADER */}
        <DialogHeader className="p-6 pb-0 text-black">
          <DialogTitle className="text-xl text black">
            {property.title}
          </DialogTitle>
          <p className="text-black">
            ₦{property.price.toLocaleString()}
          </p>
        </DialogHeader>

        {/* SCROLLABLE CONTENT */}
        <ScrollArea className="max-h-[80vh] px-6 pb-6">
          {/* Thumbnails */}
          {property.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto mb-4 text-black">
              {property.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={property.title}
                  width={100}
                  height={60}
                  className={`rounded-lg object-cover cursor-pointer border-2 ${
                    idx === activeImage
                      ? "border-blue-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6">
            <Image
              src={property.images[activeImage]}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <Card className="shadow-md">
            <CardContent className="p-4 space-y-2 text-sm">
              <p><strong>Type:</strong> {property.type || "N/A"}</p>
              <p><strong>Bedrooms:</strong> {property.bedrooms || "N/A"}</p>
              <p><strong>Bathrooms:</strong> {property.bathrooms || "N/A"}</p>
              <p><strong>Sqft:</strong> {property.sqft || "N/A"}</p>

              <p>
                <strong>Agent Phone:</strong>{" "}
                {property.phone ? (
                  <a
                    href={`tel:${property.phone}`}
                    className="text-blue-600 underline"
                  >
                    {property.phone}
                  </a>
                ) : "N/A"}
              </p>

              <p>
                <strong>Agent Email:</strong>{" "}
                {property.email ? (
                  <a
                    href={`mailto:${property.email}`}
                    className="text-blue-600 underline"
                  >
                    {property.email}
                  </a>
                ) : "N/A"}
              </p>

              <p className="flex items-center gap-1">
                <MapPin size={16} /> {property.location}
              </p>

              <h3 className="font-semibold mt-4">Description</h3>
              <p className="leading-relaxed">
                {property.description}
              </p>

              <div className="grid grid-cols-2 pt-4 text-muted-foreground">
                <p>
                  Status:{" "}
                  <span className="font-medium">{property.status}</span>
                </p>
                <p>
                  Views:{" "}
                  <span className="font-medium">{property.views}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
