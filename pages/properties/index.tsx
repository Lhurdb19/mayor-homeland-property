"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye } from "lucide-react";
import SearchSidebar from "@/components/SearchSidebar";

interface PropertyType {
  _id: string;
  title: string;
  location: string;
  price: number;
  status: string;
  images: string[];
  views: number;
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

  const [searchFilters, setSearchFilters] = useState<Filters>({
    location: "",
    type: "any",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
  });

  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const cacheRef = useRef<Map<string, PropertyType[]>>(new Map());

  // Load URL filters ONCE when page loads (Hero search or URL query)
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
  }, []); // empty dependency → run only once

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters(filters);
    setPage(1);
  };

  // Fetch properties based on searchFilters
  const fetchProperties = async (currentPage = 1) => {
    const paramsObj: any = { ...searchFilters, limit: 8, page: currentPage };

    // Convert "any" to empty string for API
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
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setProperties(data);
      setTotalPages(Math.ceil(res.data.meta.total / res.data.meta.perPage));
      cacheRef.current.set(cacheKey, data);
    } catch (err) {
      console.error(err);
      setProperties([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties(page);
  }, [searchFilters, page]);

  return (
    <div className="py-20 px-4 lg:px-20 max-w-8xl mx-auto">
      <h1 className="text-2xl lg:text-4xl font-bold mb-6">Available Properties</h1>

      <div className="mb-8">
        <SearchSidebar
          filters={filters}
          handleChange={handleChange}
          handleSearch={handleSearch}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((p) => (
              <Link key={p._id} href={`/properties/${p._id}`}>
                <Card className="rounded-xl shadow-md">
                  <div className="h-50 w-full overflow-hidden">
                    <img
                      src={p.images?.[0] || "/placeholder.jpg"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <CardContent className="px-2 space-y-1">
                    <h2 className="font-semibold">{p.title}</h2>
                    <p className="text-gray-600 text-sm">{p.location}</p>
                    <p className="font-bold">₦{p.price.toLocaleString()}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <Eye className="h-4 w-4" /> {p.views} views
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
