"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import axios from "axios";

interface StatsType {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  totalUsers: number;
  unverifiedUsers: number;
}

interface SalesType {
  month: string;
  sales: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [salesData, setSalesData] = useState<SalesType[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);

  useEffect(() => {
    // Fetch summary stats
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await axios.get("/api/admin/stats"); // implement this API
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoadingStats(false);
    };

    // Fetch sales chart
    const fetchSales = async () => {
      setLoadingSales(true);
      try {
        const res = await axios.get("/api/admin/analytics"); // implement this API
        setSalesData(res.data.sales);
      } catch (err) {
        console.error(err);
      }
      setLoadingSales(false);
    };

    fetchStats();
    fetchSales();
  }, []);

  const statCards = [
    { title: "Total Properties", value: stats?.totalProperties },
    { title: "Available Properties", value: stats?.availableProperties },
    { title: "Sold Properties", value: stats?.soldProperties },
    { title: "Total Users", value: stats?.totalUsers },
    { title: "Unverified Users", value: stats?.unverifiedUsers },
  ];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statCards.map((card, i) => (
          <Card key={i} className="p-4">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {loadingStats ? <Skeleton className="h-8 w-24" /> : card.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Property Sales per Month</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSales ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
