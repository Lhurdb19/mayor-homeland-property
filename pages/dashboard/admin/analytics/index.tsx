"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/admin/AdminLayout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface SalesType {
  month: string;
  sales: number;
}

export default function AdminAnalyticsPage() {
  const [salesData, setSalesData] = useState<SalesType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/admin/analytics");
        setSalesData(res.data.sales);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalSales = salesData.reduce((acc, cur) => acc + cur.sales, 0);
  const bestMonth = salesData.reduce(
    (max, cur) => (cur.sales > max.sales ? cur : max),
    salesData[0] || { month: "-", sales: 0 }
  );

  return (
    <AdminLayout>
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Property sales performance and platform growth insights
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Properties Sold</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {loading ? <Skeleton className="h-8 w-24" /> : totalSales}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Performing Month</CardTitle>
            <CardDescription>Highest sales</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <span className="text-2xl font-bold">{bestMonth.month}</span>
                <Badge variant="secondary">{bestMonth.sales} sold</Badge>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Status</CardTitle>
            <CardDescription>Current trend</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-6 w-40" />
            ) : (
              <Badge className="bg-green-600">Active</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* MAIN CHART */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly Property Sales</CardTitle>
          <CardDescription>
            Number of properties sold per month
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="sales"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* INSIGHTS */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Insights</CardTitle>
          <CardDescription>Actionable observations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Monitor peak months to plan marketing campaigns.</p>
          <p>• Compare sales trends against new property listings.</p>
          <p>• Use data to forecast inventory demand.</p>
          <p>• Identify low-performing months for promotions.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
