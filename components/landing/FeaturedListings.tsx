"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, RulerDimensionLine, MoveRight } from "lucide-react";
import axios from "axios";
import Link from "next/link";

// ------------------------------
// TEXT TRUNCATE HELPER
// ------------------------------
const truncateText = (text: string, maxLength = 35) =>
  text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

type ListingType = {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
};

export default function FeaturedListings() {
  const [listings, setListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("/api/properties/featured");
        setListings(res.data);
      } catch (err) {
        console.error("Failed to fetch featured:", err);
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  return (
    <div className="py-5 px-4 lg:px-25 max-w-8xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-6 text-center"
      >
        Featured Listings
      </motion.h2>

      <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : listings.map((listing, i) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className="min-w-[280px] shrink-0"
              >
                <PropertyCard listing={listing} />
              </motion.div>
            ))}
      </div>
    </div>
  );
}

// ---------------------------------------
// 🔵 Skeleton Card
// ---------------------------------------
function SkeletonCard() {
  return (
    <Card className="min-w-[280px] shrink-0 rounded-xl overflow-hidden shadow-md border">
      <div className="skeleton h-44 w-full"></div>
      <CardContent className="p-3 space-y-2">
        <div className="skeleton h-4 w-3/4"></div>
        <div className="skeleton h-3 w-1/2"></div>
        <div className="skeleton h-3 w-1/3"></div>
        <div className="flex gap-2 mt-2">
          <div className="skeleton h-3 w-8" />
          <div className="skeleton h-3 w-8" />
          <div className="skeleton h-3 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------
// 🟢 Property Card
// ---------------------------------------
function PropertyCard({ listing }: { listing: ListingType }) {
  return (
    <Link href={`/properties/${listing._id}`}>
      <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition cursor-pointer group">
        {/* IMAGE */}
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={listing.images?.[0] || "/placeholder.jpg"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <Badge className="absolute top-2 left-2 bg-blue-600 text-white capitalize">
            For {listing.type}
          </Badge>
        </div>

        {/* CONTENT */}
        <CardContent className="px-3 space-y-1">
          {/* Title */}
          <h3 className="font-semibold text-sm">{truncateText(listing.title, 30)}</h3>

          {/* Price */}
          <p className="text-blue-600 font-bold text-xs">
            ₦{listing.price.toLocaleString()}
          </p>

          {/* Location */}
          <p className="text-gray-500 text-xs">{truncateText(listing.location, 30)}</p>

          {/* Property Specs */}
          <div className="flex items-center gap-3 text-xs mt-2 text-gray-700">
            <span className="flex items-center gap-1 text-[10px] text-gray-700">
              <Bed size={12} /> {listing.bedrooms} Beds
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-700">
              <Bath size={12} /> {listing.bathrooms} Baths
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-700">
              <RulerDimensionLine size={12} /> {listing.sqft} sqft
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
