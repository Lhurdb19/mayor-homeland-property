"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, MoveRight, Bed, Bath, Ruler, RulerDimensionLine, } from "lucide-react";

// ⭐ TRUNCATE FUNCTION
const truncate = (text: string, max = 35) =>
  text.length > max ? text.substring(0, max) + "..." : text;

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
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

export default function Categories({
  initialType = "sale",
  showModalButton = false,
  enablePagination = false,
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialType);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = enablePagination ? 8 : 1000;
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
    <div className="py-16 px-4 lg:px-25 md:max-w-8xl w-full mx-auto bg-white text-black/80">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl lg:text-3xl font-bold text-center mb-5"
      >
        Explore {categories.find((c) => c.type === selectedCategory)?.title}
      </motion.h2>

      {/* Desktop Category Buttons */}
      {showModalButton && (
        <div className="hidden sm:flex justify-center gap-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.type}
              className={`px-4 py-2 text-xs rounded-md font-medium ${
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

      {/* GRID — Skeleton or Data */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="overflow-hidden rounded-xl shadow-md h-[280px] border p-0"
            >
              <div className="skeleton h-[180px] w-full" />
              <CardContent className="p-4 space-y-3">
                <div className="skeleton h-[18px] w-3/4" />
                <div className="skeleton h-[15px] w-2/4" />
                <div className="skeleton h-[15px] w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(showModalButton ? properties.slice(0, 4) : properties).map((prop) => (
            <motion.a
              key={prop._id}
              href={`/properties/${prop._id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition cursor-pointer group">
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={prop.images[0] || "/placeholder.jpg"}
                    className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                <CardContent className="px-3 space-y-1">
                  {/* Title */}
                  <h3 className="font-semibold text-sm">
                    {truncate(prop.title, 30)}
                  </h3>

                  {/* Price */}
                  <p className="text-blue-600 text-xs font-bold">
                    ₦{prop.price.toLocaleString()}
                  </p>

                  {/* Location */}
                  <p className="text-gray-500 text-xs">
                    {truncate(prop.location, 35)}
                  </p>

                  {/* ⭐ PROPERTY SPECS */}
                  <div className="flex items-center gap-4 text-xs mt-2 text-gray-700">
                    <span className="flex items-center text-[10px] gap-1">
                      <Bed size={12} /> {prop.bedrooms}Beds
                    </span>

                    <span className="flex items-center text-[10px] gap-1">
                      <Bath size={12} /> {prop.bathrooms}Bath
                    </span>

                    <span className="flex items-center text-[10px] gap-1">
                      <RulerDimensionLine size={12} /> {prop.sqft} sqft
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </div>
      )}

      {/* Pagination */}
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
