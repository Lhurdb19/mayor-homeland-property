"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import axios from "axios";

interface PropertyType {
  _id: string;
  title: string;
  images: string[];
  featured: boolean;
  status: string;
}

export default function FeaturedPage() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/properties/featured");
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await axios.put("/api/admin/properties/featured", { id, featured: !featured });
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Featured Listings Management</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-40 w-full mb-4 rounded-md" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property._id} className="p-4 flex flex-col justify-between">
              <div>
                {property.images[0] ? (
                  <img src={property.images[0]} alt={property.title} className="h-40 w-full object-cover rounded-md mb-2" />
                ) : (
                  <Skeleton className="h-40 w-full mb-2 rounded-md" />
                )}
                <CardHeader>
                  <CardTitle>{property.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Status: {property.status}</p>
                  <p className="text-sm font-medium">Featured: {property.featured ? "Yes" : "No"}</p>
                </CardContent>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant={property.featured ? "destructive" : "default"}
                  onClick={() => toggleFeatured(property._id, property.featured)}
                >
                  <Star size={16} className="mr-2" />
                  {property.featured ? "Unfeature" : "Feature"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
