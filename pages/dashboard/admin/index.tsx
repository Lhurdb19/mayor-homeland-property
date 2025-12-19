"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import AdminLayout from "@/components/admin/AdminLayout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Home,
  Users,
  BarChart3,
  Plus,
  Bell,
  ChartBar,
} from "lucide-react";

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
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchSales = async () => {
      try {
        const res = await axios.get("/api/admin/analytics");
        setSalesData(res.data.sales);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSales(false);
      }
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
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor platform activity, manage properties, and oversee users.
        </p>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {statCards.map((card, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-sm">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {loadingStats ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                card.value
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHART + QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* SALES CHART */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Property Sales (Monthly)</CardTitle>
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
                  <Bar dataKey="sales" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* QUICK ACTIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-between">
              <Link href="/dashboard/admin/properties">
                Add Property <Plus className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="secondary" className="w-full justify-between">
              <Link href="/dashboard/admin/properties">
                Manage Properties <Home className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="secondary" className="w-full justify-between">
              <Link href="/dashboard/admin/users">
                Manage Users <Users className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="secondary" className="w-full justify-between">
              <Link href="/dashboard/admin/analytics">
                View Analytics <BarChart3 className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="secondary" className="w-full justify-between">
              <Link href="/dashboard/admin/analytics/users">
                User Growth Analytics <ChartBar />
              </Link>

            </Button>

            <Button asChild variant="secondary" className="w-full justify-between">
              <Link href="/dashboard/admin/notifications">
                Notifications <Bell className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ADMIN INSIGHTS */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Insights</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Review newly listed properties for approval.</p>
          <p>• Track monthly property sales trends.</p>
          <p>• Identify unverified users requiring attention.</p>
          <p>• Respond quickly to platform notifications.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
