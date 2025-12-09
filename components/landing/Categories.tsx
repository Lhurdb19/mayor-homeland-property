"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, MoveRight } from "lucide-react";

const categories = [
  { title: "Homes for Sale", type: "sale" },
  { title: "Homes for Rent", type: "rent" },
  { title: "Lease Properties", type: "lease" },
  { title: "Land Properties", type: "land" },
];

interface Property {
  _id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
}


export default function Categories({
  initialType = "sale",
  showModalButton = false,
  enablePagination = false, // new prop
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialType);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const limit = enablePagination ? 8 : 1000; // landing page shows all
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/properties?type=${selectedCategory}&page=${page}&limit=${limit}`
        );

        setProperties(res.data.data);
        if (enablePagination) setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [selectedCategory, page, enablePagination]);

  return (
    <div className="py-10 px-4 lg:p-25 md:max-w-8xl w-full mx-auto">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl lg:text-4xl font-bold text-center mb-10"
      >
        Explore {categories.find((c) => c.type === selectedCategory)?.title}
      </motion.h2>

      {/* Desktop Category Buttons */}
      {showModalButton && (
        <div className="hidden sm:flex justify-center gap-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.type}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedCategory === cat.type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setSelectedCategory(cat.type);
                setPage(1);
              }}
            >
              {cat.title}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Dropdown */}
      {showModalButton && (
        <div className="sm:hidden flex justify-center mb-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-64 justify-between">
                {categories.find((c) => c.type === selectedCategory)?.title}
                <ChevronsUpDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.type}
                  onClick={() => {
                    setSelectedCategory(cat.type);
                    setPage(1);
                  }}
                >
                  {cat.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Properties Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="border rounded-xl p-4">
              <Skeleton className="h-40 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          No properties found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(showModalButton ? properties.slice(0, 4) : properties).map(
            (property) => (
              <motion.a
                key={property._id}
                href={`/properties/${property._id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition h-80 cursor-pointer group">
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={property.images[0] || "/placeholder.jpg"}
                      className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-md">{property.title}</h3>
                      <p className="text-blue-600 font-bold">
                        ₦{property.price.toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-sm">{property.location}</p>
                    </div>

                    <MoveRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition" />
                  </CardContent>
                </Card>
              </motion.a>
            )
          )}
        </div>
      )}

      {/* Pagination for Category Pages Only */}
      {enablePagination && !loading && properties.length > 0 && (
        <div className="flex items-center justify-center gap-5 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-md border disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-md border disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
