"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MoveRight } from "lucide-react";
import axios from "axios";
import Link from "next/link";

type ListingType = {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  type: string;
};

export default function FeaturedListings() {
  const [listings, setListings] = useState<ListingType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("/api/properties/featured");
        setListings(res.data); // ← REAL FEATURED FROM DB
      } catch (err) {
        console.error("Failed to fetch featured:", err);
      }
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  return (
    <div className="py-16 px-4 lg:px-25 max-w-8xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-6"
      >
        Featured Listings
      </motion.h2>

      <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : listings.map((listing, i) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="min-w-[300px]"
              >
                <PropertyCard listing={listing} />
              </motion.div>
            ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <Card className="min-w-[300px] rounded-xl overflow-hidden shadow-md">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}

function PropertyCard({ listing }: { listing: ListingType }) {
  return (
    <Link href={`/properties/${listing._id}`}>
      <Card className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={listing.images?.[0]}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
            {listing.type}
          </Badge>
        </div>

        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{listing.title}</h3>
          <p className="text-blue-600 font-bold text-xl mt-1">
            ₦{listing.price.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{listing.location}</p>

          <div className="flex items-center gap-2 text-blue-600 font-medium mt-3 group-hover:underline">
            View Details <MoveRight size={18} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}