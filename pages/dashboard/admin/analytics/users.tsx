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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface GrowthType {
  month: string;
  users: number;
}

export default function UserGrowthAnalyticsPage() {
  const [growth, setGrowth] = useState<GrowthType[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrowth = async () => {
      try {
        const res = await axios.get("/api/admin/analytics/users");
        setGrowth(res.data.growth);
        setTotalUsers(res.data.totalUsers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrowth();
  }, []);

  const bestMonth =
    growth.reduce(
      (max, cur) => (cur.users > max.users ? cur : max),
      growth[0] || { month: "-", users: 0 }
    );

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">User Growth Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track user registration trends and platform adoption
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {loading ? <Skeleton className="h-8 w-24" /> : totalUsers}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Growth Month</CardTitle>
            <CardDescription>Highest signups</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <span className="text-2xl font-bold">{bestMonth.month}</span>
                <Badge variant="secondary">
                  {bestMonth.users} users
                </Badge>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Status</CardTitle>
            <CardDescription>Platform trend</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <Badge className="bg-green-600">Growing</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CHART */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>User Registrations Per Month</CardTitle>
          <CardDescription>
            Monthly growth overview
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={growth}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* INSIGHTS */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth Insights</CardTitle>
          <CardDescription>Admin recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Identify months with high signups for targeted campaigns.</p>
          <p>• Monitor growth consistency to assess platform adoption.</p>
          <p>• Combine growth data with sales for conversion insights.</p>
          <p>• Detect slow periods early and boost engagement.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
