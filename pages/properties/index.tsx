"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SearchSidebar from "@/components/SearchSidebar";
import { Bed, Bath, RulerDimensionLine } from "lucide-react";

// ⭐ TRUNCATE FUNCTION
const truncate = (text: string, max = 35) =>
  text.length > max ? text.substring(0, max) + "..." : text;

interface PropertyType {
  _id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

type Filters = {
  location: string;
  type: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
};

export default function UserPropertiesPage() {
  const params = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    location: "",
    type: "any",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
  });

  const [searchFilters, setSearchFilters] = useState<Filters>(filters);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const cacheRef = useRef<Map<string, PropertyType[]>>(new Map());

  const [sessionSeed] = useState(() => Math.floor(Math.random() * 10000));

  // Load URL filters ONCE when page loads
  useEffect(() => {
    const urlFilters: any = {};
    ["location", "type", "bedrooms", "minPrice", "maxPrice"].forEach((key) => {
      const value = params.get(key);
      if (value && value !== "") urlFilters[key] = value;
    });

    if (Object.keys(urlFilters).length > 0) {
      setFilters((prev) => ({ ...prev, ...urlFilters }));
      setSearchFilters((prev) => ({ ...prev, ...urlFilters }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  cacheRef.current.clear(); // 🗑️ Clear cache on new search to force a fresh shuffle
  setSearchFilters(filters);
  setPage(1);
};

  const fetchProperties = async (currentPage = 1) => {
    const paramsObj: any = { ...searchFilters, limit: 8, page: currentPage,  seed: sessionSeed };
    Object.keys(paramsObj).forEach((k) => {
      if (paramsObj[k] === "any") paramsObj[k] = "";
    });

    const cacheKey = JSON.stringify(paramsObj);
    if (cacheRef.current.has(cacheKey)) {
      setProperties(cacheRef.current.get(cacheKey)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("/api/properties", { params: paramsObj });
      // const data = Array.isArray(res.data.data) ? res.data.data : [];
      setProperties(res.data.data);
      // setTotalPages(Math.ceil(res.data.meta.total / res.data.meta.perPage));
      setTotalPages(res.data.meta.totalPages);
      // cacheRef.current.set(cacheKey, data);
    } catch (err) {
      console.error(err);
      // setProperties([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties(page);
  }, [searchFilters, page]);

  return (
    <div className="py-20 px-4 lg:px-20 max-w-8xl mx-auto bg-white text-black/80">
      <h1 className="text-2xl lg:text-4xl font-bold mb-6">Available Properties</h1>

      <div className="mb-8">
        <SearchSidebar
          filters={filters}
          handleChange={handleChange}
          handleSearch={handleSearch}
        />
      </div>

      {/* GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------
// 🔵 Skeleton Card with specs placeholders
// ---------------------------------------
function SkeletonCard() {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md border p-0">
      {/* IMAGE PLACEHOLDER */}
      <div className="skeleton h-[180px] w-full" />

      <CardContent className="p-3 space-y-2">
        {/* TITLE */}
        <div className="skeleton h-4 w-3/4" />
        {/* PRICE */}
        <div className="skeleton h-3 w-1/2" />
        {/* LOCATION */}
        <div className="skeleton h-3 w-1/3" />
        {/* SPECS PLACEHOLDER: Bed / Bath / Sqft */}
        <div className="flex items-center gap-2 mt-2">
          <div className="skeleton h-3 w-8" />
          <div className="skeleton h-3 w-8" />
          <div className="skeleton h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------
// 🟢 Property Card
// ---------------------------------------
function PropertyCard({ property }: { property: PropertyType }) {
  return (
    <Link href={`/properties/${property._id}`}>
      <Card className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transition cursor-pointer group">
        <div className="h-40 w-full overflow-hidden">
          <img
            src={property.images?.[0] || "/placeholder.jpg"}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <CardContent className="px-3 space-y-1">
          <h3 className="text-sm font-semibold">{truncate(property.title, 30)}</h3>
          <p className="text-blue-600 font-bold text-xs">₦{property.price.toLocaleString()}</p>
          <p className="text-gray-500 text-xs">{truncate(property.location, 25)}</p>

          {/* Specs: Bed / Bath / Sqft */}
          <div className="flex items-center gap-4 text-xs text-gray-700 mt-2">
            <span className="flex items-center gap-1 text-[10px]">
              <Bed size={12} /> {property.bedrooms} Beds
            </span>
            <span className="flex items-center gap-1 text-[10px]">
              <Bath size={12} /> {property.bathrooms} Bath
            </span>
            <span className="flex items-center gap-1 text-[10px]">
              <RulerDimensionLine size={12} /> {property.sqft} sqft
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
