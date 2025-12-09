// components/admin/DashboardCards.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function DashboardCards({ metrics }: { metrics: { title: string; value: number }[] }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, i) => (
        <Card key={i} className="p-4 rounded-lg shadow-md">
          {loading ? (
            <>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium">{metric.title}</h3>
              <p className="text-2xl font-bold">{metric.value}</p>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
