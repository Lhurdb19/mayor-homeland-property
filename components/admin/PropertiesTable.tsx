// components/admin/PropertiesTable.tsx
"use client";

import useSWR from "swr";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function PropertiesTable() {
  const { data, error, isLoading } = useSWR("/api/admin/properties", fetcher);

  if (isLoading) return Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 w-full mb-4 rounded" />);

  if (error) return <p>Error loading properties</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {data.map((property: any) => (
        <Card key={property._id} className="p-2 rounded-lg shadow-md">
          <div className="relative w-full h-48 mb-2">
            <Image src={property.images[0]} alt={property.title} fill className="object-cover rounded-lg" />
          </div>
          <h3 className="font-bold">{property.title}</h3>
          <p className="text-gray-600">{property.location}</p>
          <p className="text-blue-600 font-semibold">{property.price.toLocaleString()} NGN</p>
        </Card>
      ))}
    </div>
  );
}
