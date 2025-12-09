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

export default function UserPropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const cacheRef = useRef<Map<string, PropertyType[]>>(new Map());

  const fetchProperties = async (currentPage = 1) => {
    const params: any = { limit: 8, page: currentPage };

    if (searchParams.get("location")) params.location = searchParams.get("location");
    if (searchParams.get("type")) params.type = searchParams.get("type");
    if (searchParams.get("bedrooms")) params.bedrooms = searchParams.get("bedrooms");
    if (searchParams.get("minPrice")) params.minPrice = searchParams.get("minPrice");
    if (searchParams.get("maxPrice")) params.maxPrice = searchParams.get("maxPrice");
    if (searchParams.get("time")) params.time = searchParams.get("time");

    const cacheKey = `${JSON.stringify(params)}`;

    if (cacheRef.current.has(cacheKey)) {
      setProperties(cacheRef.current.get(cacheKey)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("/api/properties", { params });
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

  // Re-fetch whenever query params or page change
  useEffect(() => {
    fetchProperties(page);
  }, [searchParams.toString(), page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="py-20 px-4 lg:px-20 max-w-8xl mx-auto">
      <h1 className="text-2xl lg:text-4xl font-bold mb-6 tracking-tight">
        Available Properties
      </h1>

      <div className="mb-8 flex flex-col lg:flex-row gap-4">
        <SearchSidebar setResults={setProperties} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
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
                <Card className="shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="h-50 w-full overflow-hidden">
                    <img
                      src={p.images?.[0] || "/placeholder.jpg"}
                      className="h-full w-full object-cover hover:scale-110 transition duration-500"
                    />
                  </div>

                  <CardContent className="px-2 space-y-1">
                    <h2 className="font-semibold text-sm lg:text-lg">{p.title}</h2>
                    <p className="text-gray-600 text-xs lg:text-sm">{p.location}</p>
                    <p className="font-bold text-sm lg:text-lg">
                      ₦{p.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> {p.views} views
                      </span>
                      <span>{p.status}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 text-black disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-black disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
